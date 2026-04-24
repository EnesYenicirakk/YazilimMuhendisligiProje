<?php

namespace App\Http\Controllers;

use App\Models\SupplierOrder;
use App\Models\SupplierOrderItem;
use App\Http\Resources\SupplierOrderResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SupplierOrderController extends Controller
{
    // 1. READ: Tüm alış siparişlerini, toptancıları ve içindeki ürünlerle birlikte getir
    public function index()
    {
        $orders = SupplierOrder::with(['supplier', 'items.product'])->get();
        return SupplierOrderResource::collection($orders);
    }

    // 2. CREATE: Yeni bir toptan alım siparişi ve içindeki ürünleri kaydet
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'order_number' => 'required|string|unique:supplier_orders,order_number', // Fatura no benzersiz olmalı
            'total_amount' => 'required|numeric',
            'order_date' => 'required|date',
            'items' => 'required|array', // Alınan ürünler listesi
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric'
        ]);

        // DB Transaction: İşlemlerden biri bile hata verirse tümünü iptal et!
        DB::beginTransaction();

        try {
            // A. Önce ana alış faturası/siparişi fişini oluştur
            $order = SupplierOrder::create([
                'supplier_id' => $validatedData['supplier_id'],
                'order_number' => $validatedData['order_number'],
                'total_amount' => $validatedData['total_amount'],
                'order_date' => $validatedData['order_date'],
                'status' => 'pending', // Beklemede
            ]);

            // B. Alınan her bir ürünü döngüyle kalemlere (items) ekle
            foreach ($validatedData['items'] as $item) {
                SupplierOrderItem::create([
                    'supplier_order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price']
                ]);
            }

            // Sorun yoksa veritabanına kalıcı olarak kaydet
            DB::commit();

            // Eklenen siparişi ilişkileriyle birlikte React'e geri gönder
            $order->load(['supplier', 'items.product']);
            return new SupplierOrderResource($order);

        } catch (\Exception $e) {
            DB::rollBack(); // Hata çıkarsa işlemi geri al
            return response()->json(['error' => 'Tedarikçi siparişi oluşturulamadı.', 'details' => $e->getMessage()], 500);
        }
    }

    // 3. READ (Tekil): Sadece bir alış siparişinin detaylarını gör
    public function show(string $id)
    {
        $order = SupplierOrder::with(['supplier', 'items.product'])->findOrFail($id);
        return new SupplierOrderResource($order);
    }

    // 4. UPDATE: Tedarikçi siparişinin durumunu güncelle (Ör: Bekliyor → Teslim alındı)
    public function update(Request $request, string $id)
    {
        $order = SupplierOrder::findOrFail($id);

        $validatedData = $request->validate([
            'status'       => 'sometimes|string',
            'total_amount' => 'sometimes|numeric',
            'order_date'   => 'sometimes|date',
        ]);

        $order->update($validatedData);
        $order->load(['supplier', 'items.product']);

        return new SupplierOrderResource($order);
    }

    // 5. DELETE: Tedarikçi siparişini sil
    public function destroy(string $id)
    {
        $order = SupplierOrder::findOrFail($id);
        $order->delete();

        return response()->json(null, 204);
    }
}