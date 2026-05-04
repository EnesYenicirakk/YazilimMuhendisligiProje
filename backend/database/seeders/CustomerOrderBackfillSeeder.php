<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\CustomerOrder;
use App\Models\CustomerOrderItem;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class CustomerOrderBackfillSeeder extends Seeder
{
    public function run(): void
    {
        $startDate = Carbon::create(2026, 2, 4)->startOfDay();
        $recentOrders = CustomerOrder::with('items.product')
            ->whereDate('order_date', '>=', $startDate->toDateString())
            ->get();

        $cancelledCount = $recentOrders->where('payment_status', 'cancelled')->count();
        $pastCount = $recentOrders->filter(fn ($order) => $order->payment_status !== 'cancelled' && $order->delivery_status === 'delivered')->count();
        $activeCount = $recentOrders->filter(fn ($order) => $order->payment_status !== 'cancelled' && $order->delivery_status !== 'delivered')->count();
        $guestActiveCount = $recentOrders->filter(fn ($order) => !$order->customer_id && $order->payment_status !== 'cancelled' && $order->delivery_status !== 'delivered')->count();

        $missingCancelled = max(0, 3 - $cancelledCount);
        $missingPast = max(0, 14 - $pastCount);
        $missingActive = max(0, 8 - $activeCount);
        $missingGuestActive = max(0, 2 - $guestActiveCount);

        if ($missingCancelled === 0 && $missingPast === 0 && $missingActive === 0 && $missingGuestActive === 0) {
            return;
        }

        DB::transaction(function () use ($missingCancelled, $missingPast, $missingActive, $missingGuestActive) {
            $customers = Customer::orderBy('id')->get();
            $products = Product::orderByDesc('store_stock')->get()->values();

            $customerCursor = 0;
            $productCursor = 0;

            $nextCustomer = function () use ($customers, &$customerCursor) {
                if ($customers->isEmpty()) {
                    return null;
                }

                $customer = $customers[$customerCursor % $customers->count()];
                $customerCursor++;

                return $customer;
            };

            $nextProduct = function (bool $needsStock = true) use ($products, &$productCursor) {
                if ($products->isEmpty()) {
                    return null;
                }

                $attempts = 0;
                while ($attempts < $products->count()) {
                    $product = $products[$productCursor % $products->count()];
                    $productCursor++;
                    $attempts++;

                    if (!$needsStock || (int) $product->store_stock > 0) {
                        return $product->fresh();
                    }
                }

                return null;
            };

            for ($i = 0; $i < $missingPast; $i++) {
                $customer = $nextCustomer();
                $product = $nextProduct(true);
                if (!$customer || !$product) {
                    break;
                }

                $date = Carbon::create(2026, 2, 6)->addDays($i * 6);
                $this->createOrderIfMissing(
                    customer: $customer,
                    guestName: null,
                    product: $product,
                    quantity: 1,
                    date: $date,
                    paymentStatus: 'paid',
                    preparationStatus: 'ready',
                    deliveryStatus: 'delivered',
                    cancellationNote: null,
                    decrementStock: true,
                );
            }

            for ($i = 0; $i < $missingCancelled; $i++) {
                $customer = $nextCustomer();
                $product = $nextProduct(false);
                if (!$customer || !$product) {
                    break;
                }

                $date = Carbon::create(2026, 3, 5)->addDays($i * 11);
                $cancelNotes = [
                    'Müşteri plan değişikliği nedeniyle siparişi iptal etti.',
                    'Ürün teslim tarihi ertelendiği için sipariş kapatıldı.',
                    'Araç kabulü gecikince sipariş müşterinin talebiyle durduruldu.',
                ];

                $this->createOrderIfMissing(
                    customer: $customer,
                    guestName: null,
                    product: $product,
                    quantity: 1,
                    date: $date,
                    paymentStatus: 'cancelled',
                    preparationStatus: 'pending',
                    deliveryStatus: 'pending',
                    cancellationNote: $cancelNotes[$i % count($cancelNotes)],
                    decrementStock: false,
                );
            }

            $guestNames = [
                'Kayıtsız Müşteri - Hızlı Satış A',
                'Kayıtsız Müşteri - Hızlı Satış B',
            ];

            for ($i = 0; $i < $missingGuestActive; $i++) {
                $product = $nextProduct(true);
                if (!$product) {
                    break;
                }

                $date = Carbon::create(2026, 4, 26)->addDays($i * 4);

                $this->createOrderIfMissing(
                    customer: null,
                    guestName: $guestNames[$i % count($guestNames)],
                    product: $product,
                    quantity: 1,
                    date: $date,
                    paymentStatus: $i % 2 === 0 ? 'paid' : 'pending',
                    preparationStatus: $i % 2 === 0 ? 'ready' : 'preparing',
                    deliveryStatus: 'shipped',
                    cancellationNote: null,
                    decrementStock: true,
                );
            }

            $remainingCustomerActive = max(0, $missingActive - $missingGuestActive);

            for ($i = 0; $i < $remainingCustomerActive; $i++) {
                $customer = $nextCustomer();
                $product = $nextProduct(true);
                if (!$customer || !$product) {
                    break;
                }

                $date = Carbon::create(2026, 4, 18)->addDays($i * 3);

                $this->createOrderIfMissing(
                    customer: $customer,
                    guestName: null,
                    product: $product,
                    quantity: 1,
                    date: $date,
                    paymentStatus: $i % 2 === 0 ? 'pending' : 'paid',
                    preparationStatus: $i % 2 === 0 ? 'preparing' : 'ready',
                    deliveryStatus: $i % 2 === 0 ? 'pending' : 'shipped',
                    cancellationNote: null,
                    decrementStock: true,
                );
            }

            $this->refreshCustomerLastPurchaseDates();
        });

        Cache::forget('products_list');
    }

    private function createOrderIfMissing(
        ?Customer $customer,
        ?string $guestName,
        Product $product,
        int $quantity,
        Carbon $date,
        string $paymentStatus,
        string $preparationStatus,
        string $deliveryStatus,
        ?string $cancellationNote,
        bool $decrementStock,
    ): void {
        $totalAmount = round((float) $product->sale_price * $quantity, 2);

        $existingOrder = CustomerOrder::query()
            ->where('customer_id', $customer?->id)
            ->where('guest_name', $guestName)
            ->whereDate('order_date', $date->toDateString())
            ->where('payment_status', $paymentStatus)
            ->where('total_amount', $totalAmount)
            ->first();

        if ($existingOrder) {
            return;
        }

        if ($decrementStock && (int) $product->fresh()->store_stock < $quantity) {
            return;
        }

        $order = CustomerOrder::create([
            'customer_id' => $customer?->id,
            'guest_name' => $guestName,
            'total_amount' => $totalAmount,
            'order_date' => $date->copy()->setTime(10, 0),
            'payment_status' => $paymentStatus,
            'preparation_status' => $preparationStatus,
            'delivery_status' => $deliveryStatus,
            'cancellation_note' => $cancellationNote,
        ]);

        CustomerOrderItem::create([
            'customer_order_id' => $order->id,
            'product_id' => $product->id,
            'quantity' => $quantity,
            'unit_price' => (float) $product->sale_price,
        ]);

        if ($decrementStock) {
            $product->decrement('store_stock', $quantity);
        }
    }

    private function refreshCustomerLastPurchaseDates(): void
    {
        Customer::query()->select('id')->each(function (Customer $customer) {
            $lastOrderDate = CustomerOrder::query()
                ->where('customer_id', $customer->id)
                ->max('order_date');

            if ($lastOrderDate) {
                $customer->update([
                    'last_purchase_date' => Carbon::parse($lastOrderDate)->toDateString(),
                ]);
            }
        });
    }
}
