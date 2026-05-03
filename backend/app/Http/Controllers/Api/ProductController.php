<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\Notification;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $products = \Illuminate\Support\Facades\Cache::remember('products_list', 600, function () {
            return Product::with('category')->get()->map(function ($product) {
                return $this->mapProductToFrontend($product);
            });
        });

        return response()->json($products);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ad' => 'required|string',
            'urunId' => 'required|string|unique:products,sku',
            'kategori' => 'required|string',
            'urunAdedi' => 'required|integer',
            'magazaStok' => 'required|integer',
            'minimumStok' => 'nullable|integer',
            'alisFiyati' => 'nullable|numeric',
            'satisFiyati' => 'nullable|numeric',
        ]);

        // Kategori ID bul veya oluştur
        $category = Category::firstOrCreate(['name' => $request->kategori]);

        $product = Product::create([
            'category_id' => $category->id,
            'sku' => $request->urunId,
            'barcode' => $request->barkod ?? null,
            'name' => $request->ad,
            'avatar' => $request->avatar ?? null,
            'stock_quantity' => $request->urunAdedi,
            'store_stock' => $request->magazaStok,
            'minimum_stock' => $request->minimumStok ?? 5,
            'purchase_price' => $request->alisFiyati ?? 0,
            'sale_price' => $request->satisFiyati ?? 0,
            'is_favorite' => $request->favori ?? false,
        ]);

        \Illuminate\Support\Facades\Cache::forget('products_list');
        return response()->json($this->mapProductToFrontend($product), 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'ad' => 'required|string|max:255',
            'urunId' => 'required|string|unique:products,sku,' . $id,
            'kategori' => 'required|string|max:50',
            'urunAdedi' => 'required|integer|min:0',
            'magazaStok' => 'required|integer|min:0',
            'minimumStok' => 'nullable|integer|min:0',
            'alisFiyati' => 'nullable|numeric|min:0',
            'satisFiyati' => 'nullable|numeric|min:0',
            'favori' => 'nullable|boolean',
        ]);

        // Kategori ID bul veya oluştur (Güvenlik için isim uzunluğu kısıtlandı)
        $category = Category::firstOrCreate(['name' => trim($validated['kategori'])]);

        $product->update([
            'category_id' => $category->id,
            'sku' => $validated['urunId'],
            'barcode' => $request->barkod,
            'name' => $validated['ad'],
            'avatar' => $request->avatar,
            'stock_quantity' => $validated['urunAdedi'],
            'store_stock' => $validated['magazaStok'],
            'minimum_stock' => $validated['minimumStok'] ?? 5,
            'purchase_price' => $validated['alisFiyati'] ?? 0,
            'sale_price' => $validated['satisFiyati'] ?? 0,
            'is_favorite' => $validated['favori'] ?? false,
        ]);

        // Kritik stok kontrolü ve bildirim
        if ($product->store_stock <= $product->minimum_stock) {
            Notification::create([
                'user_id' => $request->user()->id,
                'type' => 'kritik',
                'title' => 'Kritik Stok Uyarısı',
                'details' => $product->name . ' ürününün stoğu kritik seviyeye düştü: ' . $product->store_stock,
                'page' => 'envanter',
                'tab' => 'urunler',
                'is_read' => false,
                'is_archived' => false,
                'is_transactional' => false
            ]);
        }

        \Illuminate\Support\Facades\Cache::forget('products_list');
        return response()->json($this->mapProductToFrontend($product));
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        \Illuminate\Support\Facades\Cache::forget('products_list');
        return response()->json(['message' => 'Ürün silindi']);
    }

    public function bulkStockUpdate(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.uid' => 'required|exists:products,id',
            'items.*.miktar' => 'required|integer|min:1',
            'type' => 'required|in:alis,satis',
        ]);

        foreach ($request->items as $item) {
            $product = Product::find($item['uid']);
            if ($request->type === 'alis') {
                $product->increment('store_stock', $item['miktar']);
            } else {
                $product->decrement('store_stock', $item['miktar']);
                
                // Kritik stok kontrolü
                if ($product->fresh()->store_stock <= $product->minimum_stock) {
                    Notification::create([
                        'user_id' => $request->user()->id,
                        'type' => 'kritik',
                        'title' => 'Kritik Stok Uyarısı',
                        'details' => $product->name . ' ürününün stoğu kritik seviyeye düştü: ' . $product->store_stock,
                        'page' => 'envanter',
                        'tab' => 'urunler',
                        'is_read' => false,
                        'is_archived' => false,
                        'is_transactional' => false
                    ]);
                }
            }
        }

        return response()->json(['message' => 'Stoklar başarıyla güncellendi']);
    }

    private function mapProductToFrontend($product) {
        return [
            'uid' => $product->id,
            'urunId' => $product->sku,
            'barkod' => $product->barcode,
            'kategori' => $product->category ? $product->category->name : 'Diğer',
            'ad' => $product->name,
            'avatar' => $product->avatar,
            'urunAdedi' => $product->stock_quantity,
            'magazaStok' => $product->store_stock,
            'minimumStok' => $product->minimum_stock,
            'alisFiyati' => (float)$product->purchase_price,
            'satisFiyati' => (float)$product->sale_price,
            'favori' => (bool)$product->is_favorite,
        ];
    }
}
