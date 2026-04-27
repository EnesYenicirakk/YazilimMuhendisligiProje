<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Resources\ProductResource;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // 1. READ: Tüm ürünleri listele
    public function index()
    {
        // Sihir burada: 'with' fonksiyonu sayesinde ürünleri çekerken, 
        // o ürüne bağlı olan kategori detaylarını da otomatik olarak getiriyoruz (Eager Loading)
        $products = Product::with('category')->get();
        return ProductResource::collection($products);
    }

    // 2. CREATE: Yeni bir ürün ekle
    public function store(Request $request)
    {
        // Gelen verileri veritabanına yazmadan önce doğrula
        $validatedData = $request->validate([
            'category_id' => 'required|exists:categories,id', // Kategori tablosunda gerçekten var mı kontrolü
            'sku' => 'required|string|unique:products,sku',   // SKU benzersiz olmalı
            'barcode' => 'nullable|string',
            'name' => 'required|string|max:255',
            'avatar' => 'nullable|string',
            'stock_quantity' => 'integer',
            'store_stock' => 'integer',
            'minimum_stock' => 'integer',
            'purchase_price' => 'required|numeric',
            'sale_price' => 'required|numeric',
            'is_favorite' => 'boolean'
        ]);

        $product = Product::create($validatedData);

        // Ürünü oluşturduktan sonra kategori bilgisiyle beraber geri döndür ki React hemen ekrana basabilsin
        $product->load('category');
        return new ProductResource($product);
    }

    // 3. READ (Tekil): Sadece tek bir ürünün detaylarını getir
    public function show(string $id)
    {
        // Ürünü bul, bulursan kategori bilgisiyle birlikte ver, bulamazsan 404 hatası fırlat
        $product = Product::with('category')->findOrFail($id);
        return new ProductResource($product);
    }

    // 4. UPDATE: Mevcut bir ürünü düzenle
    public function update(Request $request, string $id)
    {
        $product = Product::findOrFail($id);

        $validatedData = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'sku' => 'sometimes|string|unique:products,sku,' . $product->id, // Kendisi hariç benzersiz olmalı
            'barcode' => 'nullable|string',
            'name' => 'sometimes|string|max:255',
            'avatar' => 'nullable|string',
            'stock_quantity' => 'integer',
            'store_stock' => 'integer',
            'minimum_stock' => 'integer',
            'purchase_price' => 'sometimes|numeric',
            'sale_price' => 'sometimes|numeric',
            'is_favorite' => 'boolean'
        ]);

        $product->update($validatedData);
        $product->load('category');
        return new ProductResource($product);
    }

    // 5. DELETE: Bir ürünü sil
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json(null, 204);
    }
}