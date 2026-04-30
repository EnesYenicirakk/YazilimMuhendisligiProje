<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SupplierOrder extends Model
{
    protected $fillable = [
        'supplier_id',
        'order_number',
        'total_amount',
        'order_date',
        'status',
        'product_name',
        'product_sku',
        'quantity',
        'unit_price',
        'is_automatic',
        'source',
        'previous_stock',
        'target_stock',
        'expected_stock',
        'created_at',
    ];

    protected $casts = [
        'total_amount'    => 'decimal:2',
        'unit_price'      => 'decimal:2',
        'is_automatic'    => 'boolean',
        'quantity'        => 'integer',
        'previous_stock'  => 'integer',
        'target_stock'    => 'integer',
        'expected_stock'  => 'integer',
    ];

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }
}
