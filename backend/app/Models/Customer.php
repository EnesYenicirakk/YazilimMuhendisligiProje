<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    // Müşteri kayıt formundan gelecek veriler için izinler
    protected $fillable = [
        'full_name', 
        'phone', 
        'email', 
        'address', 
        'tax_number', 
        'last_purchase_date', 
        'notes'
    ];
}