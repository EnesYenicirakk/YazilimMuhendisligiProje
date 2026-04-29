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
        'is_favorite',
    ];

    protected $casts = [
        'last_purchase_date' => 'date',
        'is_favorite' => 'boolean',
    ];

    public function orders(): HasMany
    {
        return $this->hasMany(CustomerOrder::class);
    }
}
