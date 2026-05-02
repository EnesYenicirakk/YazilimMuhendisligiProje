<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Customer;
use App\Models\CustomerOrder;

$customers = Customer::all();

foreach ($customers as $customer) {
    // Bu müşterinin en son siparişini bul
    $lastOrder = CustomerOrder::where('customer_id', $customer->id)
        ->orderBy('order_date', 'desc')
        ->first();
        
    if ($lastOrder) {
        $customer->update(['last_purchase_date' => $lastOrder->order_date]);
        echo "Updated: {$customer->full_name} -> {$lastOrder->order_date}\n";
    }
}

// Cache'i temizle
\Illuminate\Support\Facades\Cache::forget('customers_list');

echo "Tüm müşteri son satın alım tarihleri güncellendi.\n";
