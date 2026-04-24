<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Http\Resources\CustomerResource;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index()
    {
        return CustomerResource::collection(Customer::all());
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'full_name'          => 'required|string|max:255',
            'phone'              => 'nullable|string|max:20',
            'email'              => 'nullable|email|max:255',
            'address'            => 'nullable|string',
            'tax_number'         => 'nullable|string|max:50',
            'last_purchase_date' => 'nullable|date',
            'notes'              => 'nullable|string',
        ]);

        return new CustomerResource(Customer::create($validatedData));
    }

    public function show(string $id)
    {
        return new CustomerResource(Customer::findOrFail($id));
    }

    public function update(Request $request, string $id)
    {
        $customer = Customer::findOrFail($id);

        $validatedData = $request->validate([
            'full_name'          => 'sometimes|string|max:255',
            'phone'              => 'nullable|string|max:20',
            'email'              => 'nullable|email|max:255',
            'address'            => 'nullable|string',
            'tax_number'         => 'nullable|string|max:50',
            'last_purchase_date' => 'nullable|date',
            'notes'              => 'nullable|string',
        ]);

        $customer->update($validatedData);
        return new CustomerResource($customer);
    }

    public function destroy(string $id)
    {
        Customer::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}