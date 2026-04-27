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
            return [
                'uid' => $customer->id,
                'ad' => $customer->full_name, // Mapping to frontend field name
                'telefon' => $customer->phone,
                'email' => $customer->email,
                'adres' => $customer->address,
                'vergiNumarasi' => $customer->tax_number,
                'sonAlim' => $customer->last_purchase_date ? $customer->last_purchase_date->format('Y-m-d') : null,
                'not' => $customer->notes,
                'favori' => false, // Default
            ];
        });
        return response()->json($customers);
    }
}
