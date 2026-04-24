<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    // Dışarıdan veri girişine izin verdiğimiz kolon (Mass Assignment Koruması)
    protected $fillable = [
        'name',
    ];
}