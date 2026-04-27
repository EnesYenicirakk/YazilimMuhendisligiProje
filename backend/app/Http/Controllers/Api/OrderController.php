<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CustomerOrder;
use App\Models\CustomerOrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index()
    {
        $orders = CustomerOrder::with(['customer', 'items.product'])->get()->map(function ($order) {
            return $this->mapOrderToFrontend($order);
        });

        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'musteriUid' => 'required',
            'urun' => 'required|string',
            'toplamTutar' => 'required|numeric',
            'siparisTarihi' => 'required|date',
        ]);

        return DB::transaction(function () use ($request) {
            $order = CustomerOrder::create([
                'customer_id' => $request->musteriUid,
                'total_amount' => $request->toplamTutar,
                'order_date' => $request->siparisTarihi,
                'payment_status' => $this->mapPaymentStatusToBackend($request->odemeDurumu ?? 'Beklemede'),
                'preparation_status' => $this->mapPrepStatusToBackend($request->urunHazirlik ?? 'Hazırlanıyor'),
                'delivery_status' => $this->mapDeliveryStatusToBackend($request->teslimatDurumu ?? 'Hazırlanıyor'),
            ]);

            // For now, since the frontend sends a single 'urun' string, 
            // we don't know the exact product IDs and quantities in detail.
            // In a real app, the frontend would send an array of items.
            // As a fallback, we'll just store the order without items or with a placeholder if needed.
            // But let's try to find the product if possible.
            $product = Product::where('name', $request->urun)->first();
            if ($product) {
                CustomerOrderItem::create([
                    'customer_order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => 1,
                    'unit_price' => $request->toplamTutar,
                ]);
            }

            return response()->json($this->mapOrderToFrontend($order), 201);
        });
    }

    private function mapOrderToFrontend($order) {
        $firstItem = $order->items->first();
        $productName = $firstItem && $firstItem->product ? $firstItem->product->name : 'Bilinmeyen Ürün';
        if ($order->items->count() > 1) {
            $productName .= ' (+' . ($order->items->count() - 1) . ')';
        }

        return [
            'id' => $order->id,
            'siparisNo' => (string)$order->id,
            'musteri' => $order->customer ? $order->customer->full_name : 'Bilinmeyen Müşteri',
            'musteriUid' => $order->customer_id,
            'urun' => $productName,
            'toplamTutar' => (float)$order->total_amount,
            'siparisTarihi' => $order->order_date ? $order->order_date->format('Y-m-d') : null,
            'odemeDurumu' => $this->mapPaymentStatusToFrontend($order->payment_status),
            'urunHazirlik' => $this->mapPrepStatusToFrontend($order->preparation_status),
            'teslimatDurumu' => $this->mapDeliveryStatusToFrontend($order->delivery_status),
            'teslimatSuresi' => '2 iş günü', // Placeholder
        ];
    }

    private function mapPaymentStatusToFrontend($status) {
        $map = ['paid' => 'Ödendi', 'pending' => 'Beklemede', 'cancelled' => 'İptal'];
        return $map[$status] ?? 'Beklemede';
    }

    private function mapPrepStatusToFrontend($status) {
        $map = ['ready' => 'Hazır', 'preparing' => 'Hazırlanıyor', 'pending' => 'Hazırlanıyor'];
        return $map[$status] ?? 'Hazırlanıyor';
    }

    private function mapDeliveryStatusToFrontend($status) {
        $map = ['delivered' => 'Teslim Edildi', 'shipped' => 'Yolda', 'pending' => 'Hazırlanıyor'];
        return $map[$status] ?? 'Hazırlanıyor';
    }

    private function mapPaymentStatusToBackend($status) {
        $map = ['Ödendi' => 'paid', 'Beklemede' => 'pending', 'İptal' => 'cancelled'];
        return $map[$status] ?? 'pending';
    }

    private function mapPrepStatusToBackend($status) {
        $map = ['Hazır' => 'ready', 'Hazırlanıyor' => 'preparing'];
        return $map[$status] ?? 'pending';
    }

    private function mapDeliveryStatusToBackend($status) {
        $map = ['Teslim Edildi' => 'delivered', 'Yolda' => 'shipped', 'Hazırlanıyor' => 'pending'];
        return $map[$status] ?? 'pending';
    }
}
