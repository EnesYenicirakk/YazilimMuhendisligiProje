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
            return [
                'uid' => $supplier->id,
                'firmaAdi' => $supplier->company_name,
                'yetkiliKisi' => $supplier->contact_person,
                'telefon' => $supplier->phone,
                'email' => $supplier->email,
                'adres' => $supplier->address,
                'vergiNumarasi' => $supplier->tax_number,
                'urunGrubu' => $supplier->product_group,
                'not' => '', // Default
                'toplamAlisSayisi' => 0,
                'ortalamaTeslimSuresi' => '3 iş günü',
                'toplamHarcama' => 0,
                'alinanUrunler' => [],
                'siparisler' => [],
                'fiyatGecmisi' => [],
                'favori' => false,
            ];
        });
        return response()->json($suppliers);
    }
}
