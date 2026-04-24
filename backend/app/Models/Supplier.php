<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use HasFactory;

    // Tedarikçi ekleme formundan gelecek veriler için izinler
    protected $fillable = [
        'company_name', 
        'contact_person', 
        'phone', 
        'email', 
        'address', 
        'tax_number', 
        'product_group'
    ];
}