<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    // Dışarıdan veri girişine izin veriyoruz (Fatura Başlığı)
    protected $fillable = [
        'invoice_number', 
        'type', // 'sales' (satış) veya 'purchase' (alış)
        'customer_id', 
        'supplier_id', 
        'issue_date', 
        'due_date', 
        'sub_total', 
        'tax_total', 
        'grand_total', 
        'status', 
        'notes'
    ];

    // Eğer bu bir SATIŞ faturasıysa, bir müşteriye aittir
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    // Eğer bu bir ALIŞ faturasıysa, bir tedarikçiye aittir
    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    // Bir faturanın İÇİNDE birden fazla kalem (ürün) vardır
    public function items()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    // Bir faturaya yapılmış birden fazla ödeme parçası olabilir (Taksit vb.)
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}