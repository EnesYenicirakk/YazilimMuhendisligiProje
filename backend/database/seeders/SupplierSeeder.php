<?php

namespace Database\Seeders;

use App\Models\Supplier;
use Illuminate\Database\Seeder;

class SupplierSeeder extends Seeder
{
    public function run(): void
    {
        $suppliers = [
            ['company_name' => 'Anadolu Filtre Sanayi',      'contact_person' => 'Kemal Aydın',    'phone' => '0212 600 01 01', 'email' => 'satis@anadolufiltre.com',  'address' => 'İkitelli OSB, İstanbul',     'tax_number' => '1111111111', 'product_group' => 'Filtre'],
            ['company_name' => 'Delta Fren Sistemleri',       'contact_person' => 'Serdar Kaya',    'phone' => '0232 600 02 02', 'email' => 'satis@deltafren.com',       'address' => 'Atatürk OSB, İzmir',         'tax_number' => '2222222222', 'product_group' => 'Fren'],
            ['company_name' => 'Mavi Elektrik Oto',           'contact_person' => 'Burak Çelik',    'phone' => '0312 600 03 03', 'email' => 'satis@mavielektrik.com',    'address' => 'Ostim OSB, Ankara',           'tax_number' => '3333333333', 'product_group' => 'Elektrik'],
            ['company_name' => 'Şanzıman Parça Merkezi',      'contact_person' => 'Hüseyin Yıldız', 'phone' => '0224 600 04 04', 'email' => 'satis@sanzımanparca.com',   'address' => 'Nilüfer OSB, Bursa',          'tax_number' => '4444444444', 'product_group' => 'Şanzıman'],
            ['company_name' => 'MotorTek Endüstri',           'contact_person' => 'Faruk Demir',    'phone' => '0342 600 05 05', 'email' => 'satis@motortek.com.tr',     'address' => 'İslahiye OSB, Gaziantep',    'tax_number' => '5555555555', 'product_group' => 'Motor'],
            ['company_name' => 'Kuzey Oto Kimya',             'contact_person' => 'Mustafa Öztürk', 'phone' => '0462 600 06 06', 'email' => 'satis@kuzeyotokimya.com',   'address' => 'Arsin OSB, Trabzon',          'tax_number' => '6666666666', 'product_group' => 'Diğer'],
            ['company_name' => 'Eksen Filtre Dağıtım',        'contact_person' => 'Cem Arslan',     'phone' => '0216 600 07 07', 'email' => 'satis@eksenfiltre.com',     'address' => 'Dudullu OSB, İstanbul',       'tax_number' => '7777777777', 'product_group' => 'Filtre'],
            ['company_name' => 'Atlas Fren Lojistik',         'contact_person' => 'Tolga Şahin',    'phone' => '0322 600 08 08', 'email' => 'satis@atlasfren.com',       'address' => 'Huzur OSB, Adana',            'tax_number' => '8888888888', 'product_group' => 'Fren'],
            ['company_name' => 'Volta Elektrik Parça',        'contact_person' => 'Emre Yılmaz',    'phone' => '0352 600 09 09', 'email' => 'satis@voltaelektrik.com',   'address' => 'Hacılar OSB, Kayseri',        'tax_number' => '9999999999', 'product_group' => 'Elektrik'],
            ['company_name' => 'YedekNet Genel Tedarik',      'contact_person' => 'Alper Kılıç',    'phone' => '0242 600 10 10', 'email' => 'satis@yedeknet.com',        'address' => 'Antalya OSB, Antalya',        'tax_number' => '1010101010', 'product_group' => 'Diğer'],
        ];

        foreach ($suppliers as $data) {
            Supplier::firstOrCreate(['company_name' => $data['company_name']], $data);
        }
    }
}
