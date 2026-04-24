<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupplierOrder extends Model
{
    use HasFactory;

    // Dışarıdan veri girişine izin veriyoruz (Alış Faturası Başlığı)
    protected $fillable = [
        'supplier_id', 
        'order_number', 
        'total_amount', 
        'order_date', 
        'status'
    ];

    // Bu toptan alım, bir tedarikçiye (fabrikaya/toptancıya) aittir
    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    // Bu toptan alımın İÇİNDE birden fazla ürün (kalem) olabilir
    public function items()
    {
        return $this->hasMany(SupplierOrderItem::class);
    }
}