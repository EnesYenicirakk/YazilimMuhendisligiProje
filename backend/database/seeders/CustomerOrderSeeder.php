<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Product;
use App\Models\CustomerOrder;
use App\Models\CustomerOrderItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CustomerOrderSeeder extends Seeder
{
    public function run(): void
    {
        $orders = [
            [
                'customer_name'      => 'Yıldız Oto',
                'total_amount'       => 580,
                'order_date'         => '2026-04-10 10:00:00',
                'payment_status'     => 'paid',
                'preparation_status' => 'ready',
                'delivery_status'    => 'delivered',
                'items' => [
                    ['sku' => 'FRN-2101', 'quantity' => 2, 'unit_price' => 290],
                ],
            ],
            [
                'customer_name'      => 'Tekin Otomotiv',
                'total_amount'       => 930,
                'order_date'         => '2026-04-11 11:00:00',
                'payment_status'     => 'paid',
                'preparation_status' => 'ready',
                'delivery_status'    => 'delivered',
                'items' => [
                    ['sku' => 'ELK-2301', 'quantity' => 1, 'unit_price' => 1450],
                    ['sku' => 'FLT-2201', 'quantity' => 1, 'unit_price' => 120],
                ],
            ],
            [
                'customer_name'      => 'Mert Motor',
                'total_amount'       => 1200,
                'order_date'         => '2026-04-13 09:00:00',
                'payment_status'     => 'pending',
                'preparation_status' => 'preparing',
                'delivery_status'    => 'pending',
                'items' => [
                    ['sku' => 'SAN-2401', 'quantity' => 1, 'unit_price' => 1200],
                ],
            ],
            [
                'customer_name'      => 'Hızlı Servis',
                'total_amount'       => 625,
                'order_date'         => '2026-04-14 14:00:00',
                'payment_status'     => 'pending',
                'preparation_status' => 'pending',
                'delivery_status'    => 'pending',
                'items' => [
                    ['sku' => 'FLT-2202', 'quantity' => 2, 'unit_price' => 145],
                    ['sku' => 'FRN-2104', 'quantity' => 2, 'unit_price' => 150],
                    ['sku' => 'ELK-2305', 'quantity' => 2, 'unit_price' => 195],
                ],
            ],
            [
                'customer_name'      => 'Bora Yedek Parça',
                'total_amount'       => 675,
                'order_date'         => '2026-04-15 16:00:00',
                'payment_status'     => 'paid',
                'preparation_status' => 'ready',
                'delivery_status'    => 'pending',
                'items' => [
                    ['sku' => 'DGR-2510', 'quantity' => 1, 'unit_price' => 675],
                ],
            ],
        ];

        foreach ($orders as $orderData) {
            $customer = Customer::where('full_name', $orderData['customer_name'])->first();
            if (!$customer) continue;

            DB::beginTransaction();
            try {
                $order = CustomerOrder::create([
                    'customer_id'        => $customer->id,
                    'total_amount'       => $orderData['total_amount'],
                    'order_date'         => $orderData['order_date'],
                    'payment_status'     => $orderData['payment_status'],
                    'preparation_status' => $orderData['preparation_status'],
                    'delivery_status'    => $orderData['delivery_status'],
                ]);

                foreach ($orderData['items'] as $item) {
                    $product = Product::where('sku', $item['sku'])->first();
                    if (!$product) continue;

                    CustomerOrderItem::create([
                        'customer_order_id' => $order->id,
                        'product_id'        => $product->id,
                        'quantity'          => $item['quantity'],
                        'unit_price'        => $item['unit_price'],
                    ]);
                }
                DB::commit();
            } catch (\Exception $e) {
                DB::rollBack();
            }
        }
    }
}
