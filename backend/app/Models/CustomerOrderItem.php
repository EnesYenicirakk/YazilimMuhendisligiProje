<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerOrderItem extends Model
{
    protected $fillable = [
        'customer_order_id',
        'product_id',
        'quantity',
        'unit_price',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
