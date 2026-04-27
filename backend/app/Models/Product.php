<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
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
        'is_favorite',
    ];

    protected $casts = [
        'is_favorite' => 'boolean',
        'purchase_price' => 'decimal:2',
        'sale_price' => 'decimal:2',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
