<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    // Dışarıdan veri girişine izin veriyoruz (Kasa İşlemleri)
    protected $fillable = [
        'type', // 'incoming' (gelir) veya 'outgoing' (gider)
        'amount', 
        'payment_date', 
        'customer_id', 
        'supplier_id', 
        'invoice_id', 
        'status', 
        'description'
    ];

    // Ödemeyi yapan müşteri olabilir
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    // Ödemeyi yaptığımız yer bir toptancı/tedarikçi olabilir
    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    // Bu ödeme belirli bir faturayı kapatmak için yapılmış olabilir
    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }
}