<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvoiceItem extends Model
{
    use HasFactory;

    // Dışarıdan veri girişine izin veriyoruz (Fatura Kalemleri)
    protected $fillable = [
        'invoice_id', 
        'product_id', 
        'quantity', 
        'unit_price', 
        'tax_rate'
    ];

    // Bu kalem hangi faturaya ait?
    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    // Bu kalem depodaki hangi ürünü temsil ediyor?
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}