<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = Customer::all()->map(function ($customer) {
            return $this->mapCustomerToFrontend($customer);
        });
        return response()->json($customers);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ad' => 'required|string',
            'telefon' => 'required|string',
        ]);

        $customer = Customer::create([
            'full_name' => $request->ad,
            'phone' => $request->telefon,
            'email' => $request->email ?? '',
            'address' => $request->adres ?? '',
            'tax_number' => $request->vergiNumarasi ?? '',
            'notes' => $request->not ?? '',
            'last_purchase_date' => $request->sonAlim ?? now(),
        ]);

        return response()->json($this->mapCustomerToFrontend($customer), 201);
    }

    public function update(Request $request, $id)
    {
        $customer = Customer::findOrFail($id);

        $customer->update([
            'full_name' => $request->ad,
            'phone' => $request->telefon,
            'email' => $request->email,
            'address' => $request->adres,
            'tax_number' => $request->vergiNumarasi,
            'notes' => $request->not,
            'last_purchase_date' => $request->sonAlim,
        ]);

        return response()->json($this->mapCustomerToFrontend($customer));
    }

    public function destroy($id)
    {
        $customer = Customer::findOrFail($id);
        $customer->delete();
        return response()->json(['message' => 'Müşteri silindi']);
    }

    private function mapCustomerToFrontend($customer) {
        return [
            'uid' => $customer->id,
            'ad' => $customer->full_name,
            'telefon' => $customer->phone,
            'email' => $customer->email,
            'adres' => $customer->address,
            'vergiNumarasi' => $customer->tax_number,
            'sonAlim' => $customer->last_purchase_date ? $customer->last_purchase_date->format('Y-m-d') : null,
            'not' => $customer->notes,
            'favori' => false,
        ];
    }
}
