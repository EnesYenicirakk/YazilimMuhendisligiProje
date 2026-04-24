<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    // Dışarıdan veri girişine (React'ten gönderilmesine) izin verdiğimiz ürün kolonları
    protected $fillable = [
        'category_id', 
        'sku', 
        'barcode', 
        'name', 
        'avatar',
        'stock_quantity', 
        'store_stock', 
        'minimum_stock',
        'purchase_price', 
        'sale_price', 
        'is_favorite'
    ];

    // Bir ürün, tek bir kategoriye aittir (Relationship tanımlaması)
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}