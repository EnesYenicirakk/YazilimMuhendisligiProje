<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Cache;

class CustomerDemoSeeder extends Seeder
{
    public function run(): void
    {
        $customers = [
            [
                'full_name' => 'Acar Oto Elektrik',
                'authorized_person' => 'Murat Acar',
                'phone' => '0212 612 14 35',
                'email' => 'murat@acarotoelektrik.com',
                'address' => 'İkitelli OSB Mah., Başakşehir / İstanbul',
                'tax_number' => '3415567820',
                'last_purchase_date' => '2026-04-28',
                'notes' => 'Elektrik ve aydınlatma ürünlerinde toplu alım yapıyor.',
                'is_favorite' => true,
            ],
            [
                'full_name' => 'Demirler Ağır Vasıta',
                'authorized_person' => 'Onur Demir',
                'phone' => '0224 453 88 12',
                'email' => 'onur@demirleragirvasita.com',
                'address' => 'Küçük Sanayi Sitesi 5. Blok, Nilüfer / Bursa',
                'tax_number' => '5120047816',
                'last_purchase_date' => '2026-04-18',
                'notes' => 'Kamyon fren ve filtre grubu siparişleri yoğun.',
                'is_favorite' => false,
            ],
            [
                'full_name' => 'Kuzey Motor Servis',
                'authorized_person' => 'Selçuk Yılmaz',
                'phone' => '0232 489 02 77',
                'email' => 'selcuk@kuzeymotorservis.com',
                'address' => 'Pınarbaşı Mah., Bornova / İzmir',
                'tax_number' => '6127784501',
                'last_purchase_date' => '2026-05-01',
                'notes' => 'Motor bakım setleri ve yağ filtreleri tercih ediyor.',
                'is_favorite' => true,
            ],
            [
                'full_name' => 'Mavi Yol Filo Bakım',
                'authorized_person' => 'Büşra Akın',
                'phone' => '0312 395 61 90',
                'email' => 'busra@maviyolfilo.com',
                'address' => 'Şaşmaz Oto Sanayi, Etimesgut / Ankara',
                'tax_number' => '4281175309',
                'last_purchase_date' => '2026-04-24',
                'notes' => 'Filo araçları için aylık düzenli alım yapıyor.',
                'is_favorite' => false,
            ],
            [
                'full_name' => 'Güneş Dizel Center',
                'authorized_person' => 'Ferhat Güneş',
                'phone' => '0322 457 30 44',
                'email' => 'ferhat@gunesdizel.com',
                'address' => 'Yeşiloba Mah., Seyhan / Adana',
                'tax_number' => '7384412605',
                'last_purchase_date' => '2026-04-20',
                'notes' => 'Yakıt ve ateşleme ürünlerinde fiyat hassasiyeti yüksek.',
                'is_favorite' => false,
            ],
            [
                'full_name' => 'Atlas Fren Sistemleri',
                'authorized_person' => 'Caner Şahin',
                'phone' => '0352 336 74 19',
                'email' => 'caner@atlasfren.com',
                'address' => 'Organize Sanayi 12. Cadde, Melikgazi / Kayseri',
                'tax_number' => '8215603497',
                'last_purchase_date' => '2026-04-30',
                'notes' => 'Balata ve disk siparişlerinde hızlı teslimat bekliyor.',
                'is_favorite' => true,
            ],
            [
                'full_name' => 'Yeditepe Parça Market',
                'authorized_person' => 'Ece Karataş',
                'phone' => '0216 498 52 11',
                'email' => 'ece@yeditepeparca.com',
                'address' => 'Dudullu OSB, Ümraniye / İstanbul',
                'tax_number' => '9053321748',
                'last_purchase_date' => '2026-04-26',
                'notes' => 'Perakende hızlı satış için küçük ama sık sipariş geçiyor.',
                'is_favorite' => false,
            ],
        ];

        foreach ($customers as $customer) {
            Customer::updateOrCreate(
                ['full_name' => $customer['full_name']],
                $customer,
            );
        }

        Cache::forget('customers_list');
    }
}
