<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('category')->get()->map(function ($product) {
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
        });

        return response()->json($products);
    }
}
