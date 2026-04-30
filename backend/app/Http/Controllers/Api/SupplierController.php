<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function index()
    {
        $suppliers = Supplier::all()->map(function ($supplier) {
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

        return response()->json($this->mapSupplierToFrontend($supplier), 201);
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

        return response()->json($this->mapSupplierToFrontend($supplier));
    }

    public function destroy($id)
    {
        $supplier = Supplier::findOrFail($id);
        $supplier->delete();

        return response()->json(['message' => 'Tedarikci silindi']);
    }

    private function mapSupplierToFrontend($supplier)
    {
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
            'siparisler' => [],
            'fiyatGecmisi' => [],
            'favori' => (bool) $supplier->is_favorite,
        ];
    }
}
