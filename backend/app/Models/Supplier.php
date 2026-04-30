<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    protected $fillable = [
        'company_name',
        'contact_person',
        'phone',
        'email',
        'address',
        'tax_number',
        'product_group',
        'total_purchase_count',
        'average_delivery_time',
        'total_spent',
        'notes',
        'is_favorite',
    ];

    protected $casts = [
        'is_favorite' => 'boolean',
        'total_purchase_count' => 'integer',
        'total_spent' => 'decimal:2',
    ];

    public function orders()
    {
        return $this->hasMany(SupplierOrder::class);
    }
}
