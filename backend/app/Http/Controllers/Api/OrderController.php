<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CustomerOrder;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        $orders = CustomerOrder::with(['customer', 'items.product'])->get()->map(function ($order) {
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
                'odemeDurumu' => $this->mapPaymentStatus($order->payment_status),
                'hazirlikDurumu' => $this->mapPrepStatus($order->preparation_status),
                'teslimatDurumu' => $this->mapDeliveryStatus($order->delivery_status),
            ];
        });

        return response()->json($orders);
    }

    private function mapPaymentStatus($status) {
        $map = ['paid' => 'Ödendi', 'pending' => 'Beklemede', 'cancelled' => 'İptal'];
        return $map[$status] ?? 'Beklemede';
    }

    private function mapPrepStatus($status) {
        $map = ['ready' => 'Hazır', 'preparing' => 'Hazırlanıyor', 'pending' => 'Hazırlanıyor'];
        return $map[$status] ?? 'Hazırlanıyor';
    }

    private function mapDeliveryStatus($status) {
        $map = ['delivered' => 'Teslim Edildi', 'shipped' => 'Yolda', 'pending' => 'Hazırlanıyor'];
        return $map[$status] ?? 'Hazırlanıyor';
    }
}
