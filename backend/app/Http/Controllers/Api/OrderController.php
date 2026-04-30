<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CustomerOrder;
use App\Models\CustomerOrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function index()
    {
        $orders = CustomerOrder::with(['customer', 'items.product'])
            ->get()
            ->map(fn (CustomerOrder $order) => $this->mapOrderToFrontend($order));

        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $validated = $this->validateOrderRequest($request);

        $order = DB::transaction(function () use ($validated) {
            $product = Product::query()->lockForUpdate()->findOrFail($validated['urunUid']);
            $quantity = (int) $validated['urunAdedi'];

            $this->ensureSufficientStock($product, $quantity);

            $order = CustomerOrder::create([
                'customer_id' => $validated['musteriUid'],
                'total_amount' => $validated['toplamTutar'],
                'order_date' => $validated['siparisTarihi'],
                'payment_status' => $this->mapPaymentStatusToBackend($validated['odemeDurumu'] ?? 'Beklemede'),
                'preparation_status' => $this->mapPrepStatusToBackend($validated['urunHazirlik'] ?? 'Hazirlaniyor'),
                'delivery_status' => $this->mapDeliveryStatusToBackend($validated['teslimatDurumu'] ?? 'Hazirlaniyor'),
            ]);

            CustomerOrderItem::create([
                'customer_order_id' => $order->id,
                'product_id' => $product->id,
                'quantity' => $quantity,
                'unit_price' => $quantity > 0 ? round(((float) $validated['toplamTutar']) / $quantity, 2) : 0,
            ]);

            $product->decrement('store_stock', $quantity);

            return $order->load(['customer', 'items.product']);
        });

        return response()->json($this->mapOrderToFrontend($order), 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $this->validateOrderRequest($request);

        $order = DB::transaction(function () use ($validated, $id) {
            $order = CustomerOrder::with(['items.product', 'customer'])->findOrFail($id);
            $currentItem = $order->items->first();
            $newProduct = Product::query()->lockForUpdate()->findOrFail($validated['urunUid']);
            $newQuantity = (int) $validated['urunAdedi'];

            if ($currentItem?->product) {
                $oldProduct = Product::query()->lockForUpdate()->findOrFail($currentItem->product_id);
                $oldProduct->increment('store_stock', (int) $currentItem->quantity);
            }

            $this->ensureSufficientStock($newProduct, $newQuantity);
            $newProduct->decrement('store_stock', $newQuantity);

            $order->update([
                'customer_id' => $validated['musteriUid'],
                'total_amount' => $validated['toplamTutar'],
                'order_date' => $validated['siparisTarihi'],
                'payment_status' => $this->mapPaymentStatusToBackend($validated['odemeDurumu'] ?? 'Beklemede'),
                'preparation_status' => $this->mapPrepStatusToBackend($validated['urunHazirlik'] ?? 'Hazirlaniyor'),
                'delivery_status' => $this->mapDeliveryStatusToBackend($validated['teslimatDurumu'] ?? 'Hazirlaniyor'),
            ]);

            if ($currentItem) {
                $currentItem->update([
                    'product_id' => $newProduct->id,
                    'quantity' => $newQuantity,
                    'unit_price' => $newQuantity > 0 ? round(((float) $validated['toplamTutar']) / $newQuantity, 2) : 0,
                ]);
            } else {
                CustomerOrderItem::create([
                    'customer_order_id' => $order->id,
                    'product_id' => $newProduct->id,
                    'quantity' => $newQuantity,
                    'unit_price' => $newQuantity > 0 ? round(((float) $validated['toplamTutar']) / $newQuantity, 2) : 0,
                ]);
            }

            return $order->load(['customer', 'items.product']);
        });

        return response()->json($this->mapOrderToFrontend($order));
    }

    public function destroy($id)
    {
        $order = CustomerOrder::findOrFail($id);
        $order->delete();

        return response()->json(['message' => 'Siparis silindi']);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'odemeDurumu'   => 'required|string',
            'urunHazirlik'  => 'required|string',
            'teslimatDurumu' => 'required|string',
        ]);

        $order = CustomerOrder::with(['customer', 'items.product'])->findOrFail($id);

        $order->update([
            'payment_status'      => $this->mapPaymentStatusToBackend($validated['odemeDurumu']),
            'preparation_status'  => $this->mapPrepStatusToBackend($validated['urunHazirlik']),
            'delivery_status'     => $this->mapDeliveryStatusToBackend($validated['teslimatDurumu']),
        ]);

        return response()->json($this->mapOrderToFrontend($order->fresh(['customer', 'items.product'])));
    }

    public function cancel(Request $request, $id)
    {
        $request->validate([
            'iptalNotu' => 'required|string|max:1000',
        ]);

        $order = CustomerOrder::with(['items.product', 'customer'])->findOrFail($id);

        // Stoku geri iade et
        foreach ($order->items as $item) {
            if ($item->product) {
                $item->product->increment('store_stock', (int) $item->quantity);
            }
        }

        $order->update([
            'payment_status'    => 'cancelled',
            'cancellation_note' => $request->iptalNotu,
        ]);

        return response()->json($this->mapOrderToFrontend($order->fresh(['customer', 'items.product'])));
    }

    private function validateOrderRequest(Request $request): array
    {
        return $request->validate([
            'musteriUid' => 'required|exists:customers,id',
            'urunUid' => 'required|exists:products,id',
            'urun' => 'required|string',
            'urunAdedi' => 'required|integer|min:1',
            'toplamTutar' => 'required|numeric|min:0',
            'siparisTarihi' => 'required|date',
            'odemeDurumu' => 'nullable|string',
            'urunHazirlik' => 'nullable|string',
            'teslimatDurumu' => 'nullable|string',
        ]);
    }

    private function ensureSufficientStock(Product $product, int $quantity): void
    {
        if ((int) $product->store_stock < $quantity) {
            throw ValidationException::withMessages([
                'urunAdedi' => 'Secilen urun icin yeterli stok bulunmuyor.',
            ]);
        }
    }

    private function mapOrderToFrontend(CustomerOrder $order): array
    {
        $firstItem = $order->items->first();
        $productName = $firstItem && $firstItem->product ? $firstItem->product->name : 'Bilinmeyen Urun';
        $productId = $firstItem?->product?->id;
        $quantity = (int) ($firstItem?->quantity ?? 1);

        if ($order->items->count() > 1) {
            $productName .= ' (+' . ($order->items->count() - 1) . ')';
        }

        return [
            'id' => $order->id,
            'siparisNo' => (string) $order->id,
            'musteri' => $order->customer ? $order->customer->full_name : 'Bilinmeyen Musteri',
            'musteriUid' => $order->customer_id,
            'urunUid' => $productId,
            'urun' => $productName,
            'urunAdedi' => $quantity,
            'miktar' => $quantity,
            'toplamTutar' => (float) $order->total_amount,
            'siparisTarihi' => $order->order_date ? $order->order_date->format('Y-m-d') : null,
            'odemeDurumu' => $this->mapPaymentStatusToFrontend($order->payment_status),
            'urunHazirlik' => $this->mapPrepStatusToFrontend($order->preparation_status),
            'teslimatDurumu' => $this->mapDeliveryStatusToFrontend($order->delivery_status),
            'teslimatSuresi' => '',
            'iptalNotu' => $order->cancellation_note ?? '',
        ];
    }

    private function mapPaymentStatusToFrontend(?string $status): string
    {
        $map = ['paid' => 'Ödendi', 'pending' => 'Beklemede', 'cancelled' => 'İptal'];
        return $map[$status] ?? 'Beklemede';
    }

    private function mapPrepStatusToFrontend(?string $status): string
    {
        $map = ['ready' => 'Hazır', 'preparing' => 'Hazırlanıyor', 'pending' => 'Tedarik Bekleniyor'];
        return $map[$status] ?? 'Hazırlanıyor';
    }

    private function mapDeliveryStatusToFrontend(?string $status): string
    {
        $map = ['delivered' => 'Teslim Edildi', 'shipped' => 'Yolda', 'pending' => 'Hazırlanıyor'];
        return $map[$status] ?? 'Hazırlanıyor';
    }

    private function mapPaymentStatusToBackend(?string $status): string
    {
        $map = ['Ödendi' => 'paid', 'Beklemede' => 'pending', 'İptal' => 'cancelled'];
        return $map[$status] ?? 'pending';
    }

    private function mapPrepStatusToBackend(?string $status): string
    {
        $map = ['Hazır' => 'ready', 'Hazırlanıyor' => 'preparing', 'Tedarik Bekleniyor' => 'pending'];
        return $map[$status] ?? 'pending';
    }

    private function mapDeliveryStatusToBackend(?string $status): string
    {
        $map = ['Teslim Edildi' => 'delivered', 'Yolda' => 'shipped', 'Hazırlanıyor' => 'pending'];
        return $map[$status] ?? 'pending';
    }
}
