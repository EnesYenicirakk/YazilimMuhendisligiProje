<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerOrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_order_id', 
        'product_id', 
        'quantity', 
        'unit_price'
    ];

    // Bu sepet kalemi, siparişteki belirli bir ürünü temsil eder
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}