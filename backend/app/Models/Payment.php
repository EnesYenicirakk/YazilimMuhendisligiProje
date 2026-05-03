<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'type',
        'amount',
        'payment_date',
        'customer_id',
        'supplier_id',
        'invoice_id',
        'status',
        'description',
        'is_favorite',
    ];

    protected $casts = [
        'payment_date' => 'date',
        'amount' => 'float',
        'is_favorite' => 'boolean',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }
}
