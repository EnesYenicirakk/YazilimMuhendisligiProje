<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        $customers = [
            ['full_name' => 'Yıldız Oto',          'phone' => '0212 555 01 01', 'email' => 'info@yildizoto.com',     'address' => 'Bağcılar, İstanbul',     'tax_number' => '1234567890'],
            ['full_name' => 'Tekin Otomotiv',       'phone' => '0216 555 02 02', 'email' => 'info@tekinoto.com',     'address' => 'Kadıköy, İstanbul',      'tax_number' => '2345678901'],
            ['full_name' => 'Mert Motor',           'phone' => '0312 555 03 03', 'email' => 'info@mertmotor.com',    'address' => 'Çankaya, Ankara',        'tax_number' => '3456789012'],
            ['full_name' => 'Hızlı Servis',         'phone' => '0232 555 04 04', 'email' => 'info@hizliservis.com',  'address' => 'Konak, İzmir',           'tax_number' => '4567890123'],
            ['full_name' => 'Akın Oto',             'phone' => '0322 555 05 05', 'email' => 'info@akinoto.com',      'address' => 'Seyhan, Adana',          'tax_number' => '5678901234'],
            ['full_name' => 'Bora Yedek Parça',     'phone' => '0242 555 06 06', 'email' => 'info@borayedek.com',   'address' => 'Muratpaşa, Antalya',     'tax_number' => '6789012345'],
            ['full_name' => 'Demir Oto',            'phone' => '0224 555 07 07', 'email' => 'info@demiroto.com',     'address' => 'Osmangazi, Bursa',       'tax_number' => '7890123456'],
            ['full_name' => 'Asil Sanayi',          'phone' => '0352 555 08 08', 'email' => 'info@asilsanayi.com',   'address' => 'Melikgazi, Kayseri',     'tax_number' => '8901234567'],
            ['full_name' => 'Nehir Otomotiv',       'phone' => '0342 555 09 09', 'email' => 'info@nehiroto.com',     'address' => 'Şahinbey, Gaziantep',    'tax_number' => '9012345678'],
            ['full_name' => 'Kaya Oto Servis',      'phone' => '0362 555 10 10', 'email' => 'info@kayaservis.com',   'address' => 'İlkadım, Samsun',        'tax_number' => '0123456789'],
            ['full_name' => 'Yaman Yedek',          'phone' => '0462 555 11 11', 'email' => 'info@yamanyedek.com',   'address' => 'Ortahisar, Trabzon',     'tax_number' => '1357924680'],
            ['full_name' => 'Gürkan Oto',           'phone' => '0452 555 12 12', 'email' => 'info@gurkanoto.com',    'address' => 'Yakutiye, Erzurum',      'tax_number' => '2468013579'],
            ['full_name' => 'Doğan Oto',            'phone' => '0382 555 13 13', 'email' => 'info@doganoto.com',     'address' => 'Merkez, Kırşehir',       'tax_number' => '1122334455'],
            ['full_name' => 'Özen Servis',          'phone' => '0422 555 14 14', 'email' => 'info@ozenservis.com',   'address' => 'Merkez, Malatya',        'tax_number' => '2233445566'],
            ['full_name' => 'Başak Otomotiv',       'phone' => '0414 555 15 15', 'email' => 'info@basakoto.com',     'address' => 'Eyyübiye, Şanlıurfa',    'tax_number' => '3344556677'],
        ];

        foreach ($customers as $data) {
            Customer::firstOrCreate(['full_name' => $data['full_name']], $data);
        }
    }
}
