<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categoryIds = Category::pluck('id', 'name');

        $products = [
            // Filtre
            ['category' => 'Filtre', 'sku' => 'FLT-2201', 'barcode' => '8690123456781', 'name' => 'Yağ Filtresi',         'avatar' => '#F59E0B', 'stock_quantity' => 45, 'store_stock' => 10, 'minimum_stock' => 10, 'purchase_price' => 75,  'sale_price' => 120,  'is_favorite' => true],
            ['category' => 'Filtre', 'sku' => 'FLT-2202', 'barcode' => '8690123456782', 'name' => 'Hava Filtresi',        'avatar' => '#F59E0B', 'stock_quantity' => 32, 'store_stock' => 8,  'minimum_stock' => 8,  'purchase_price' => 90,  'sale_price' => 145,  'is_favorite' => false],
            ['category' => 'Filtre', 'sku' => 'FLT-2203', 'barcode' => '8690123456783', 'name' => 'Polen Filtresi',       'avatar' => '#F59E0B', 'stock_quantity' => 28, 'store_stock' => 6,  'minimum_stock' => 5,  'purchase_price' => 55,  'sale_price' => 90,   'is_favorite' => false],
            ['category' => 'Filtre', 'sku' => 'FLT-2204', 'barcode' => '8690123456784', 'name' => 'Yakıt Filtresi',       'avatar' => '#F59E0B', 'stock_quantity' => 20, 'store_stock' => 5,  'minimum_stock' => 5,  'purchase_price' => 110, 'sale_price' => 175,  'is_favorite' => false],
            // Fren
            ['category' => 'Fren',   'sku' => 'FRN-2101', 'barcode' => '8690123456785', 'name' => 'Fren Balatası Ön Takım','avatar' => '#EF4444', 'stock_quantity' => 38, 'store_stock' => 12, 'minimum_stock' => 10, 'purchase_price' => 180, 'sale_price' => 290,  'is_favorite' => true],
            ['category' => 'Fren',   'sku' => 'FRN-2102', 'barcode' => '8690123456786', 'name' => 'Fren Balatası Arka Takım','avatar' => '#EF4444','stock_quantity' => 25, 'store_stock' => 8,  'minimum_stock' => 8,  'purchase_price' => 160, 'sale_price' => 255,  'is_favorite' => false],
            ['category' => 'Fren',   'sku' => 'FRN-2103', 'barcode' => '8690123456787', 'name' => 'Fren Diski Ön Çift',   'avatar' => '#EF4444', 'stock_quantity' => 18, 'store_stock' => 4,  'minimum_stock' => 5,  'purchase_price' => 350, 'sale_price' => 560,  'is_favorite' => false],
            ['category' => 'Fren',   'sku' => 'FRN-2104', 'barcode' => '8690123456788', 'name' => 'Fren Hortumu',         'avatar' => '#EF4444', 'stock_quantity' => 15, 'store_stock' => 4,  'minimum_stock' => 5,  'purchase_price' => 95,  'sale_price' => 150,  'is_favorite' => false],
            // Elektrik
            ['category' => 'Elektrik','sku'=> 'ELK-2301', 'barcode' => '8690123456789', 'name' => 'Akü 72Ah',             'avatar' => '#3B82F6', 'stock_quantity' => 12, 'store_stock' => 3,  'minimum_stock' => 3,  'purchase_price' => 950, 'sale_price' => 1450, 'is_favorite' => true],
            ['category' => 'Elektrik','sku'=> 'ELK-2302', 'barcode' => '8690123456790', 'name' => 'Şarj Dinamosu',        'avatar' => '#3B82F6', 'stock_quantity' => 8,  'store_stock' => 2,  'minimum_stock' => 2,  'purchase_price' => 1200,'sale_price' => 1900, 'is_favorite' => false],
            ['category' => 'Elektrik','sku'=> 'ELK-2305', 'barcode' => '8690123456791', 'name' => 'Buji Takımı',          'avatar' => '#3B82F6', 'stock_quantity' => 40, 'store_stock' => 10, 'minimum_stock' => 10, 'purchase_price' => 120, 'sale_price' => 195,  'is_favorite' => false],
            ['category' => 'Elektrik','sku'=> 'ELK-2311', 'barcode' => '8690123456792', 'name' => 'ABS Sensörü Ön',       'avatar' => '#3B82F6', 'stock_quantity' => 10, 'store_stock' => 3,  'minimum_stock' => 3,  'purchase_price' => 280, 'sale_price' => 450,  'is_favorite' => false],
            // Şanzıman
            ['category' => 'Şanzıman','sku'=> 'SAN-2401', 'barcode' => '8690123456793', 'name' => 'Debriyaj Seti',        'avatar' => '#8B5CF6', 'stock_quantity' => 14, 'store_stock' => 4,  'minimum_stock' => 3,  'purchase_price' => 750, 'sale_price' => 1200, 'is_favorite' => true],
            ['category' => 'Şanzıman','sku'=> 'SAN-2402', 'barcode' => '8690123456794', 'name' => 'Debriyaj Bilyası',     'avatar' => '#8B5CF6', 'stock_quantity' => 20, 'store_stock' => 5,  'minimum_stock' => 5,  'purchase_price' => 110, 'sale_price' => 175,  'is_favorite' => false],
            ['category' => 'Şanzıman','sku'=> 'SAN-2405', 'barcode' => '8690123456795', 'name' => 'Şanzıman Takozu',      'avatar' => '#8B5CF6', 'stock_quantity' => 16, 'store_stock' => 4,  'minimum_stock' => 4,  'purchase_price' => 145, 'sale_price' => 230,  'is_favorite' => false],
            // Motor
            ['category' => 'Motor',  'sku' => 'MTR-2001', 'barcode' => '8690123456796', 'name' => 'Silindir Kapak Contası','avatar' => '#10B981', 'stock_quantity' => 9,  'store_stock' => 2,  'minimum_stock' => 2,  'purchase_price' => 320, 'sale_price' => 510,  'is_favorite' => false],
            ['category' => 'Motor',  'sku' => 'MTR-2005', 'barcode' => '8690123456797', 'name' => 'Yağ Pompası',           'avatar' => '#10B981', 'stock_quantity' => 7,  'store_stock' => 2,  'minimum_stock' => 2,  'purchase_price' => 480, 'sale_price' => 770,  'is_favorite' => false],
            ['category' => 'Motor',  'sku' => 'MTR-2012', 'barcode' => '8690123456798', 'name' => 'Motor Yağ Soğutucusu', 'avatar' => '#10B981', 'stock_quantity' => 11, 'store_stock' => 3,  'minimum_stock' => 3,  'purchase_price' => 220, 'sale_price' => 350,  'is_favorite' => false],
            // Diğer
            ['category' => 'Diğer',  'sku' => 'DGR-2502', 'barcode' => '8690123456799', 'name' => 'Klima Kompresörü',     'avatar' => '#6B7280', 'stock_quantity' => 5,  'store_stock' => 1,  'minimum_stock' => 2,  'purchase_price' => 1800,'sale_price' => 2900, 'is_favorite' => false],
            ['category' => 'Diğer',  'sku' => 'DGR-2503', 'barcode' => '8690123456800', 'name' => 'Direksiyon Kutusu',    'avatar' => '#6B7280', 'stock_quantity' => 4,  'store_stock' => 1,  'minimum_stock' => 2,  'purchase_price' => 2200,'sale_price' => 3500, 'is_favorite' => false],
            ['category' => 'Diğer',  'sku' => 'DGR-2510', 'barcode' => '8690123456801', 'name' => 'Triger Kayışı Seti',   'avatar' => '#6B7280', 'stock_quantity' => 22, 'store_stock' => 6,  'minimum_stock' => 5,  'purchase_price' => 420, 'sale_price' => 675,  'is_favorite' => true],
        ];

        foreach ($products as $data) {
            $catName = $data['category'];
            unset($data['category']);
            $data['category_id'] = $categoryIds[$catName];
            Product::firstOrCreate(['sku' => $data['sku']], $data);
        }
    }
}
