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
        $validated = $request->validate([
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
        ]);

        return response()->json($this->mapSupplierToFrontend($supplier));
    }

    public function destroy($id)
    {
        $supplier = Supplier::findOrFail($id);
        $supplier->delete();
        return response()->json(['message' => 'Tedarikçi silindi']);
    }

    private function mapSupplierToFrontend($supplier) {
        return [
            'uid' => $supplier->id,
            'firmaAdi' => $supplier->company_name,
            'yetkiliKisi' => $supplier->contact_person,
            'telefon' => $supplier->phone,
            'email' => $supplier->email,
            'adres' => $supplier->address,
            'vergiNumarasi' => $supplier->tax_number,
            'urunGrubu' => $supplier->product_group,
            'not' => '', 
            'toplamAlisSayisi' => 0,
            'ortalamaTeslimSuresi' => '3 iş günü',
            'toplamHarcama' => 0,
            'alinanUrunler' => [],
            'siparisler' => [],
            'fiyatGecmisi' => [],
            'favori' => false,
        ];
    }
}
