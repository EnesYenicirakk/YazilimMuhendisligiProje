<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Customer;

$isimler = ['Ahmet Yılmaz', 'Mehmet Demir', 'Mustafa Kaya', 'Ayşe Yıldız', 'Fatma Çelik', 'Emre Aydın', 'Caner Özdemir', 'Selin Şahin', 'Deniz Bulut', 'Murat Koç'];
$sehirler = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep', 'Kocaeli', 'Mersin'];
$ilceler = ['Merkez', 'Çarşı', 'Sanayi Sitesi', 'Organize Sanayi', 'Yeni Mahalle'];

$customers = Customer::all();

foreach ($customers as $customer) {
    // Sadece boş olanları dolduralım
    $updates = [];
    
    if (empty($customer->authorized_person)) {
        $updates['authorized_person'] = $isimler[array_rand($isimler)];
    }
    
    if (empty($customer->tax_number)) {
        $updates['tax_number'] = str_pad(mt_rand(1000000000, 9999999999), 10, '0', STR_PAD_LEFT);
    }
    
    if (empty($customer->email)) {
        $slug = strtolower(str_replace(' ', '', $customer->full_name));
        $updates['email'] = $slug . mt_rand(10, 99) . '@gmail.com';
    }
    
    if (empty($customer->address)) {
        $updates['address'] = $sehirler[array_rand($sehirler)] . ' ' . $ilceler[array_rand($ilceler)] . ' No: ' . mt_rand(1, 150);
    }

    if (!empty($updates)) {
        $customer->update($updates);
        echo "Güncellendi: {$customer->full_name}\n";
    }
}

// Cache'i temizle
\Illuminate\Support\Facades\Cache::forget('customers_list');

echo "Müşteri listesi eksik verileri tamamlandı.\n";
