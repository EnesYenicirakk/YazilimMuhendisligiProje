<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Product;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Tüm ürünlerin SKU'larını yeni formata göre güncelle
        Product::all()->each(function ($product) {
            $product->update(['sku' => $this->generateSku()]);
        });
    }

    /**
     * Rastgele SKU üretici (XY-1234 formatında)
     */
    private function generateSku(): string
    {
        $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $sku = $chars[rand(0, 25)] . $chars[rand(0, 25)] . '-' . rand(1000, 9999);
        
        // Çakışma kontrolü (nadiren de olsa gerekebilir)
        if (Product::where('sku', $sku)->exists()) {
            return $this->generateSku();
        }
        
        return $sku;
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Bu işlem geri döndürülemez
    }
};
