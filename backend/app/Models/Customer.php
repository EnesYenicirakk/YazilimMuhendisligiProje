<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    protected $fillable = [
        'full_name',
        'phone',
        'email',
        'address',
        'tax_number',
        'last_purchase_date',
        'notes',
    ];

    protected $casts = [
        'last_purchase_date' => 'date',
    ];

    public function orders(): HasMany
    {
        return $this->hasMany(CustomerOrder::class);
    }
}
