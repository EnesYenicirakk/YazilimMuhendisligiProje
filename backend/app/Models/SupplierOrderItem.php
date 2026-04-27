<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupplierOrderItem extends Model
{
    use HasFactory;

    // Dışarıdan veri girişine izin veriyoruz (Alış Faturası Kalemleri)
    protected $fillable = [
        'supplier_order_id', 
        'product_id', 
        'quantity', 
        'unit_price'
    ];

    // Bu alınan kalem, depomuzdaki belirli bir ürünü temsil eder
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}