<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use App\Models\SupplierOrder;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function index()
    {
        $suppliers = Supplier::with('orders')->get()->map(function ($supplier) {
            return $this->mapSupplierToFrontend($supplier);
        });

        return response()->json($suppliers);
    }

    public function store(Request $request)
    {
        $request->validate([
            'firmaAdi' => 'required|string',
            'yetkiliKisi' => 'required|string',
            'telefon' => 'required|string',
        ]);

        $supplier = Supplier::create([
            'company_name' => $request->firmaAdi,
            'contact_person' => $request->yetkiliKisi,
            'phone' => $request->telefon,
            'email' => $request->email ?? '',
            'address' => $request->adres ?? '',
            'tax_number' => $request->vergiNumarasi ?? '',
            'product_group' => $request->urunGrubu ?? '',
            'total_purchase_count' => $request->toplamAlisSayisi ?? 0,
            'average_delivery_time' => $request->ortalamaTeslimSuresi ?? '',
            'total_spent' => $request->toplamHarcama ?? 0,
            'notes' => $request->not ?? '',
            'is_favorite' => $request->favori ?? false,
        ]);

        return response()->json($this->mapSupplierToFrontend($supplier->load('orders')), 201);
    }

    public function update(Request $request, $id)
    {
        $supplier = Supplier::findOrFail($id);

        $supplier->update([
            'company_name' => $request->firmaAdi,
            'contact_person' => $request->yetkiliKisi,
            'phone' => $request->telefon,
            'email' => $request->email,
            'address' => $request->adres,
            'tax_number' => $request->vergiNumarasi,
            'product_group' => $request->urunGrubu,
            'total_purchase_count' => $request->toplamAlisSayisi ?? $supplier->total_purchase_count,
            'average_delivery_time' => $request->ortalamaTeslimSuresi ?? $supplier->average_delivery_time,
            'total_spent' => $request->toplamHarcama ?? $supplier->total_spent,
            'notes' => $request->not,
            'is_favorite' => $request->favori ?? $supplier->is_favorite,
        ]);

        return response()->json($this->mapSupplierToFrontend($supplier->load('orders')));
    }

    public function destroy($id)
    {
        $supplier = Supplier::findOrFail($id);
        $supplier->delete();

        return response()->json(['message' => 'Tedarikci silindi']);
    }

    /**
     * POST /suppliers/{id}/orders
     * Tedarikçiye yeni sipariş ekler (otomatik veya manuel)
     */
    public function storeOrder(Request $request, $id)
    {
        $supplier = Supplier::findOrFail($id);

        $request->validate([
            'siparisNo'   => 'required|string|unique:supplier_orders,order_number',
            'tarih'       => 'required|string',
            'tutar'       => 'required|numeric|min:0',
            'durum'       => 'required|string',
            'urun'        => 'nullable|string',
            'urunId'      => 'nullable|string',
            'miktar'      => 'nullable|integer|min:0',
            'birimFiyat'  => 'nullable|numeric|min:0',
            'otomatik'    => 'nullable|boolean',
            'kaynak'      => 'nullable|string',
            'oncekiStok'  => 'nullable|integer',
            'hedefStok'   => 'nullable|integer',
            'beklenenStok' => 'nullable|integer',
        ]);

        $order = SupplierOrder::create([
            'supplier_id'    => $supplier->id,
            'order_number'   => $request->siparisNo,
            'total_amount'   => $request->tutar,
            'order_date'     => $request->tarih,
            'status'         => $request->durum,
            'product_name'   => $request->urun,
            'product_sku'    => $request->urunId,
            'quantity'       => $request->miktar ?? 0,
            'unit_price'     => $request->birimFiyat ?? 0,
            'is_automatic'   => $request->otomatik ?? false,
            'source'         => $request->kaynak,
            'previous_stock' => $request->oncekiStok,
            'target_stock'   => $request->hedefStok,
            'expected_stock' => $request->beklenenStok,
        ]);

        // Tedarikçi istatistiklerini güncelle
        $supplier->increment('total_purchase_count');
        $supplier->increment('total_spent', $request->tutar);

        return response()->json($this->mapOrderToFrontend($order), 201);
    }

    private function mapSupplierToFrontend($supplier)
    {
        $orders = $supplier->relationLoaded('orders')
            ? $supplier->orders->sortByDesc('created_at')->values()
            : collect([]);

        return [
            'uid' => $supplier->id,
            'firmaAdi' => $supplier->company_name,
            'yetkiliKisi' => $supplier->contact_person,
            'telefon' => $supplier->phone,
            'email' => $supplier->email,
            'adres' => $supplier->address,
            'vergiNumarasi' => $supplier->tax_number,
            'urunGrubu' => $supplier->product_group,
            'not' => $supplier->notes,
            'toplamAlisSayisi' => (int) ($supplier->total_purchase_count ?? 0),
            'ortalamaTeslimSuresi' => $supplier->average_delivery_time ?? '',
            'toplamHarcama' => (float) ($supplier->total_spent ?? 0),
            'alinanUrunler' => [],
            'siparisler' => $orders->map(fn($o) => $this->mapOrderToFrontend($o))->values(),
            'fiyatGecmisi' => [],
            'favori' => (bool) $supplier->is_favorite,
        ];
    }

    private function mapOrderToFrontend($order)
    {
        return [
            'siparisNo'         => $order->order_number,
            'tarih'             => $order->order_date,
            'olusturulmaZamani' => $order->created_at?->toISOString(),
            'tutar'             => (float) $order->total_amount,
            'durum'             => $order->status,
            'urun'              => $order->product_name ?? '',
            'urunId'            => $order->product_sku ?? '',
            'miktar'            => (int) ($order->quantity ?? 0),
            'birimFiyat'        => (float) ($order->unit_price ?? 0),
            'otomatik'          => (bool) $order->is_automatic,
            'kaynak'            => $order->source ?? '',
            'oncekiStok'        => (int) ($order->previous_stock ?? 0),
            'hedefStok'         => (int) ($order->target_stock ?? 0),
            'beklenenStok'      => (int) ($order->expected_stock ?? 0),
            'id'                => $order->id,
        ];
    }
}
