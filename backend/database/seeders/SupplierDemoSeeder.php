<?php

namespace Database\Seeders;

use App\Models\Supplier;
use Illuminate\Database\Seeder;

class SupplierDemoSeeder extends Seeder
{
    public function run(): void
    {
        $suppliers = [
            [
                'company_name' => 'Teknova Motor Parça',
                'contact_person' => 'Harun Tekin',
                'phone' => '0216 611 40 80',
                'email' => 'harun@teknovamotor.com',
                'address' => 'DES Sanayi Sitesi, Ümraniye / İstanbul',
                'tax_number' => '1405526738',
                'product_group' => 'Motor',
                'total_purchase_count' => 12,
                'average_delivery_time' => '2 iş günü',
                'total_spent' => 18450,
                'notes' => 'Motor bakım ve conta setlerinde güçlü stok tutuyor.',
                'is_favorite' => true,
            ],
            [
                'company_name' => 'Optimum Filtre Dağıtım',
                'contact_person' => 'Zeki Kılıç',
                'phone' => '0224 251 90 17',
                'email' => 'zeki@optimumfiltre.com',
                'address' => 'NOSAB, Nilüfer / Bursa',
                'tax_number' => '2564409812',
                'product_group' => 'Filtre',
                'total_purchase_count' => 9,
                'average_delivery_time' => '3 iş günü',
                'total_spent' => 12780,
                'notes' => 'Yağ, hava ve polen filtrelerinde rekabetçi.',
                'is_favorite' => false,
            ],
            [
                'company_name' => 'Voltis Elektrik Otomotiv',
                'contact_person' => 'Pelin Aras',
                'phone' => '0232 433 18 55',
                'email' => 'pelin@voltiselektrik.com',
                'address' => 'Kemalpaşa OSB, İzmir',
                'tax_number' => '3987712450',
                'product_group' => 'Elektrik',
                'total_purchase_count' => 15,
                'average_delivery_time' => '1 iş günü',
                'total_spent' => 22340,
                'notes' => 'Far, ampul ve sensör ürünlerinde hızlı dönüş sağlıyor.',
                'is_favorite' => true,
            ],
            [
                'company_name' => 'Anka Fren Teknolojileri',
                'contact_person' => 'Merve Doğan',
                'phone' => '0312 278 64 03',
                'email' => 'merve@ankafren.com',
                'address' => 'İvedik OSB, Yenimahalle / Ankara',
                'tax_number' => '4721183906',
                'product_group' => 'Fren Balataları',
                'total_purchase_count' => 11,
                'average_delivery_time' => '2 iş günü',
                'total_spent' => 19600,
                'notes' => 'Balata ve disk grubunda sabit kalite sunuyor.',
                'is_favorite' => false,
            ],
            [
                'company_name' => 'Marmara Şanzıman Deposu',
                'contact_person' => 'Tolga Kurt',
                'phone' => '0212 672 48 26',
                'email' => 'tolga@marmarasanziman.com',
                'address' => 'Bağcılar Göztepe Mah., İstanbul',
                'tax_number' => '5158824371',
                'product_group' => 'Şanzıman',
                'total_purchase_count' => 7,
                'average_delivery_time' => '4 iş günü',
                'total_spent' => 15420,
                'notes' => 'Vites ve debriyaj bağlantılı parçalarda güçlü.',
                'is_favorite' => false,
            ],
            [
                'company_name' => 'Serin Soğutma Sistemleri',
                'contact_person' => 'Aylin Erdem',
                'phone' => '0322 503 22 68',
                'email' => 'aylin@serinsogutma.com',
                'address' => 'Hacı Sabancı OSB, Sarıçam / Adana',
                'tax_number' => '6842301954',
                'product_group' => 'Soğutma Sistemi',
                'total_purchase_count' => 8,
                'average_delivery_time' => '3 iş günü',
                'total_spent' => 11190,
                'notes' => 'Radyatör ve devirdaim ürünleri için tercih ediliyor.',
                'is_favorite' => false,
            ],
            [
                'company_name' => 'Yakut Ateşleme Çözümleri',
                'contact_person' => 'Emrah Çetin',
                'phone' => '0352 321 10 87',
                'email' => 'emrah@yakutatesleme.com',
                'address' => 'Kocasinan Sanayi, Kayseri',
                'tax_number' => '7519062843',
                'product_group' => 'Yakıt ve Ateşleme',
                'total_purchase_count' => 10,
                'average_delivery_time' => '2 iş günü',
                'total_spent' => 14750,
                'notes' => 'Buji, bobin ve yakıt pompası siparişlerinde aktif.',
                'is_favorite' => true,
            ],
            [
                'company_name' => 'Birlik Endüstriyel Tedarik',
                'contact_person' => 'Suat Eminoğlu',
                'phone' => '0412 254 77 93',
                'email' => 'suat@birliktedarik.com',
                'address' => 'Bağlar Küçük Sanayi Sitesi, Diyarbakır',
                'tax_number' => '8931174602',
                'product_group' => 'Diğer',
                'total_purchase_count' => 6,
                'average_delivery_time' => '5 iş günü',
                'total_spent' => 9340,
                'notes' => 'Karışık ürün grubunda yedek tedarikçi olarak kullanışlı.',
                'is_favorite' => false,
            ],
        ];

        foreach ($suppliers as $supplier) {
            Supplier::updateOrCreate(
                ['company_name' => $supplier['company_name']],
                $supplier,
            );
        }
    }
}
