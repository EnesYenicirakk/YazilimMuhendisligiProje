<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\CustomerOrder;
use App\Models\CustomerOrderItem;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class CustomerOrderDemoSeeder extends Seeder
{
    public function run(): void
    {
        $orders = [
            ['customer' => 'Yıldız Oto', 'product' => 'Yağ Filtresi', 'quantity' => 1, 'date' => '2026-02-11', 'payment' => 'paid', 'prep' => 'ready', 'delivery' => 'delivered'],
            ['customer' => 'Tekin Otomotiv', 'product' => 'Hava Filtresi', 'quantity' => 1, 'date' => '2026-02-14', 'payment' => 'paid', 'prep' => 'ready', 'delivery' => 'delivered'],
            ['customer' => 'Mert Motor', 'product' => 'Polen Filtresi', 'quantity' => 1, 'date' => '2026-02-18', 'payment' => 'paid', 'prep' => 'ready', 'delivery' => 'delivered'],
            ['customer' => 'Hızlı Servis', 'product' => 'Yakıt Filtresi', 'quantity' => 1, 'date' => '2026-02-24', 'payment' => 'paid', 'prep' => 'ready', 'delivery' => 'delivered'],
            ['customer' => 'Akın Oto', 'product' => 'Fren Balatası Ön Takım', 'quantity' => 1, 'date' => '2026-03-02', 'payment' => 'paid', 'prep' => 'ready', 'delivery' => 'delivered'],
            ['customer' => 'Bora Yedek Parça', 'product' => 'Fren Balatası Arka Takım', 'quantity' => 1, 'date' => '2026-03-08', 'payment' => 'paid', 'prep' => 'ready', 'delivery' => 'delivered'],
            ['customer' => 'Demir Oto', 'product' => 'Fren Diski Ön Çift', 'quantity' => 1, 'date' => '2026-03-15', 'payment' => 'paid', 'prep' => 'ready', 'delivery' => 'delivered'],
            ['customer' => 'Asil Sanayi', 'product' => 'Fren Hortumu', 'quantity' => 1, 'date' => '2026-03-21', 'payment' => 'paid', 'prep' => 'ready', 'delivery' => 'delivered'],
            ['customer' => 'Nehir Otomotiv', 'product' => 'Akü 72Ah', 'quantity' => 1, 'date' => '2026-03-27', 'payment' => 'paid', 'prep' => 'ready', 'delivery' => 'delivered'],
            ['customer' => 'Kaya Oto Servis', 'product' => 'Buji Takımı', 'quantity' => 1, 'date' => '2026-04-02', 'payment' => 'paid', 'prep' => 'ready', 'delivery' => 'delivered'],
            ['customer' => 'Yaman Yedek', 'product' => 'ABS Sensörü Ön', 'quantity' => 1, 'date' => '2026-04-08', 'payment' => 'paid', 'prep' => 'ready', 'delivery' => 'delivered'],
            ['customer' => 'Gürkan Oto', 'product' => 'Debriyaj Seti', 'quantity' => 1, 'date' => '2026-04-12', 'payment' => 'paid', 'prep' => 'ready', 'delivery' => 'delivered'],
            ['customer' => 'Doğan Oto', 'product' => 'Debriyaj Bilyası', 'quantity' => 1, 'date' => '2026-04-17', 'payment' => 'paid', 'prep' => 'ready', 'delivery' => 'delivered'],
            ['customer' => 'Özen Servis', 'product' => 'Şanzıman Takozu', 'quantity' => 1, 'date' => '2026-04-20', 'payment' => 'paid', 'prep' => 'ready', 'delivery' => 'delivered'],

            ['customer' => 'Başak Otomotiv', 'product' => 'Silindir Kapak Contası', 'quantity' => 1, 'date' => '2026-02-28', 'payment' => 'cancelled', 'prep' => 'pending', 'delivery' => 'pending', 'cancel_note' => 'Müşteri siparişi teslim süresi uzadığı için iptal etti.'],
            ['customer' => 'Acar Oto Elektrik', 'product' => 'Şarj Dinamosu', 'quantity' => 1, 'date' => '2026-03-19', 'payment' => 'cancelled', 'prep' => 'preparing', 'delivery' => 'pending', 'cancel_note' => 'Fiyat revizyonu sonrası müşteri onayı alınamadı.'],
            ['customer' => 'Demirler Ağır Vasıta', 'product' => 'Motor Yağ Soğutucusu', 'quantity' => 1, 'date' => '2026-04-11', 'payment' => 'cancelled', 'prep' => 'pending', 'delivery' => 'pending', 'cancel_note' => 'Araç servise girmediği için sipariş geri çekildi.'],

            ['customer' => 'Kuzey Motor Servis', 'product' => 'Triger Kayışı Seti', 'quantity' => 1, 'date' => '2026-04-14', 'payment' => 'pending', 'prep' => 'preparing', 'delivery' => 'pending'],
            ['customer' => 'Mavi Yol Filo Bakım', 'product' => 'Yağ Pompası', 'quantity' => 1, 'date' => '2026-04-19', 'payment' => 'pending', 'prep' => 'pending', 'delivery' => 'pending'],
            ['customer' => 'Güneş Dizel Center', 'product' => 'Hava Filtresi', 'quantity' => 1, 'date' => '2026-04-21', 'payment' => 'paid', 'prep' => 'preparing', 'delivery' => 'shipped'],
            ['customer' => 'Atlas Fren Sistemleri', 'product' => 'Fren Balatası Arka Takım', 'quantity' => 1, 'date' => '2026-04-23', 'payment' => 'pending', 'prep' => 'preparing', 'delivery' => 'pending'],
            ['customer' => 'Yeditepe Parça Market', 'product' => 'Polen Filtresi', 'quantity' => 1, 'date' => '2026-04-25', 'payment' => 'paid', 'prep' => 'ready', 'delivery' => 'shipped'],
            ['customer' => 'Yıldız Oto', 'product' => 'Buji Takımı', 'quantity' => 1, 'date' => '2026-04-27', 'payment' => 'pending', 'prep' => 'preparing', 'delivery' => 'pending'],
            ['guest_name' => 'Kayıtsız Müşteri - Hızlı Satış 1', 'product' => 'Yakıt Filtresi', 'quantity' => 1, 'date' => '2026-04-29', 'payment' => 'paid', 'prep' => 'ready', 'delivery' => 'shipped'],
            ['guest_name' => 'Kayıtsız Müşteri - Hızlı Satış 2', 'product' => 'Fren Hortumu', 'quantity' => 1, 'date' => '2026-05-02', 'payment' => 'pending', 'prep' => 'preparing', 'delivery' => 'pending'],
        ];

        DB::transaction(function () use ($orders) {
            foreach ($orders as $entry) {
                $product = Product::where('name', $entry['product'])->first();
                if (!$product) {
                    continue;
                }

                $customer = isset($entry['customer'])
                    ? Customer::where('full_name', $entry['customer'])->first()
                    : null;

                $orderDate = Carbon::parse($entry['date'])->setTime(10, 0);
                $quantity = (int) $entry['quantity'];
                $unitPrice = (float) $product->sale_price;
                $totalAmount = round($unitPrice * $quantity, 2);

                $existingOrder = CustomerOrder::query()
                    ->where('customer_id', $customer?->id)
                    ->where('guest_name', $entry['guest_name'] ?? null)
                    ->whereDate('order_date', $orderDate->toDateString())
                    ->where('total_amount', $totalAmount)
                    ->where('payment_status', $entry['payment'])
                    ->first();

                if ($existingOrder) {
                    continue;
                }

                if (($entry['payment'] !== 'cancelled') && (int) $product->store_stock < $quantity) {
                    continue;
                }

                $order = CustomerOrder::create([
                    'customer_id' => $customer?->id,
                    'guest_name' => $entry['guest_name'] ?? null,
                    'total_amount' => $totalAmount,
                    'order_date' => $orderDate,
                    'payment_status' => $entry['payment'],
                    'preparation_status' => $entry['prep'],
                    'delivery_status' => $entry['delivery'],
                    'cancellation_note' => $entry['cancel_note'] ?? null,
                ]);

                CustomerOrderItem::create([
                    'customer_order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                ]);

                if ($entry['payment'] !== 'cancelled') {
                    $product->decrement('store_stock', $quantity);
                }
            }

            $customerIds = CustomerOrder::query()
                ->whereNotNull('customer_id')
                ->pluck('customer_id')
                ->unique()
                ->values();

            foreach ($customerIds as $customerId) {
                $lastOrderDate = CustomerOrder::query()
                    ->where('customer_id', $customerId)
                    ->max('order_date');

                if ($lastOrderDate) {
                    Customer::whereKey($customerId)->update([
                        'last_purchase_date' => Carbon::parse($lastOrderDate)->toDateString(),
                    ]);
                }
            }
        });

        Cache::forget('products_list');
    }
}
