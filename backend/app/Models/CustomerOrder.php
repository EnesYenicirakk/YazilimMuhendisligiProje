<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerOrder extends Model
{
    use HasFactory;

    // Dışarıdan veri girişine izin veriyoruz
    protected $fillable = [
        'customer_id', 
        'total_amount', 
        'order_date', 
        'payment_status', 
        'preparation_status', 
        'delivery_status'
    ];

    // Bir sipariş, bir müşteriye aittir
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    // Bir siparişin İÇİNDE birden fazla ürün (kalem) olabilir
    public function items()
    {
        return $this->hasMany(CustomerOrderItem::class);
    }
}