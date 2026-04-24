<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockLog extends Model
{
    use HasFactory;

    // Dışarıdan veri girişine izin veriyoruz
    protected $fillable = [
        'product_id', 
        'user_id', 
        'type', // 'in' (giriş), 'out' (çıkış), 'adjustment' (elle düzeltme)
        'old_stock', 
        'new_stock', 
        'description'
    ];

    // Bu log kaydı hangi ürüne ait?
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // Bu işlemi hangi kullanıcı yaptı? (İleride yetkilendirme eklerseniz diye hazır tutuyoruz)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}