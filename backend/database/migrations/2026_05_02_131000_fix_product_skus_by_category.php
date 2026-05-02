<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\Product;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $mapping = [
            'Elektrik' => 'ELK',
            'Filtre' => 'FLT',
            'Fren' => 'FRN',
            'Fren Balataları' => 'BLT',
            'Motor' => 'MTR',
            'Şanzıman' => 'SNZ',
            'Diğer' => 'DGR'
        ];

        // Tüm ürünleri kategorilerine göre yeniden ID'lendir
        Product::with('category')->get()->each(function ($product) use ($mapping) {
            $catName = $product->category ? $product->category->name : 'Diğer';
            $prefix = $mapping[$catName] ?? strtoupper(substr($catName, 0, 3));
            
            $newSku = $this->generateUniqueSku($prefix);
            $product->update(['sku' => $newSku]);
        });
    }

    /**
     * Benzersiz SKU üretici
     */
    private function generateUniqueSku(string $prefix): string
    {
        $sku = $prefix . '-' . rand(1000, 9999);
        
        if (Product::where('sku', $sku)->exists()) {
            return $this->generateUniqueSku($prefix);
        }
        
        return $sku;
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Geri döndürülemez
    }
};
