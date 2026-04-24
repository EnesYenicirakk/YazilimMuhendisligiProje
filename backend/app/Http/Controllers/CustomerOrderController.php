<?php

namespace App\Http\Controllers;

use App\Models\CustomerOrder;
use App\Models\CustomerOrderItem;
use App\Http\Resources\CustomerOrderResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CustomerOrderController extends Controller
{
    // 1. READ: Tüm siparişleri, müşterileri ve içindeki ürünlerle birlikte getir
    public function index()
    {
        // 'with' kullanarak siparişin müşterisini VE sepetindeki ürünleri tek seferde çekiyoruz
        $orders = CustomerOrder::with(['customer', 'items.product'])->get();
        return CustomerOrderResource::collection($orders);
    }

    // 2. CREATE: Yeni bir sipariş ve içindeki ürünleri kaydet (Sepeti onayla)
    public function store(Request $request)
    {
        // Gelen verileri doğrula (React bize 'items' adında bir dizi göndermeli)
        $validatedData = $request->validate([
            'customer_id'        => 'required|exists:customers,id',
            'total_amount'       => 'required|numeric',
            'order_date'         => 'nullable|date',
            'payment_status'     => 'nullable|string',
            'preparation_status' => 'nullable|string',
            'delivery_status'    => 'nullable|string',
            'items'              => 'nullable|array',
            'items.*.product_id' => 'required_with:items|exists:products,id',
            'items.*.quantity'   => 'required_with:items|integer|min:1',
            'items.*.unit_price' => 'required_with:items|numeric',
        ]);

        // DB Transaction: İşlemlerden biri bile hata verirse tümünü iptal et!
        DB::beginTransaction();

        try {
            // A. Önce ana sipariş fişini oluştur
            $order = CustomerOrder::create([
                'customer_id'        => $validatedData['customer_id'],
                'total_amount'       => $validatedData['total_amount'],
                'order_date'         => $validatedData['order_date'] ?? now(),
                'payment_status'     => $validatedData['payment_status'] ?? 'pending',
                'preparation_status' => $validatedData['preparation_status'] ?? 'pending',
                'delivery_status'    => $validatedData['delivery_status'] ?? 'pending',
            ]);

            // B. Sepetteki her bir ürünü döngüyle sipariş kalemlerine (items) ekle
            foreach (($validatedData['items'] ?? []) as $item) {
                CustomerOrderItem::create([
                    'customer_order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price']
                ]);
            }

            // Her şey sorunsuz çalıştıysa, veritabanına kalıcı olarak kaydet
            DB::commit();

            // Eklenen siparişi ilişkileriyle birlikte React'e geri gönder
            $order->load(['customer', 'items.product']);
            return new CustomerOrderResource($order);

        } catch (\Exception $e) {
            // Eğer üstteki işlemlerde hata çıkarsa, veritabanında hiçbir şeyi değiştirme
            DB::rollBack();
            return response()->json(['error' => 'Sipariş oluşturulamadı.', 'details' => $e->getMessage()], 500);
        }
    }

    // 3. READ (Tekil): Sadece bir siparişin detaylarını gör
    public function show(string $id)
    {
        $order = CustomerOrder::with(['customer', 'items.product'])->findOrFail($id);
        return new CustomerOrderResource($order);
    }

    // 4. UPDATE: Siparişin durumunu güncelle (Ör: Kargo durumu, ödeme durumu)
    public function update(Request $request, string $id)
    {
        $order = CustomerOrder::findOrFail($id);

        $validatedData = $request->validate([
            'payment_status'     => 'sometimes|string',
            'preparation_status' => 'sometimes|string',
            'delivery_status'    => 'sometimes|string',
            'total_amount'       => 'sometimes|numeric',
        ]);

        $order->update($validatedData);
        $order->load(['customer', 'items.product']);

        return new CustomerOrderResource($order);
    }

    // 5. DELETE: Siparişi sil
    public function destroy(string $id)
    {
        $order = CustomerOrder::findOrFail($id);
        $order->delete();

        return response()->json(null, 204);
    }
}