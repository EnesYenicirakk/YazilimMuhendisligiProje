<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use App\Http\Resources\SupplierResource;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function index()
    {
        return SupplierResource::collection(Supplier::all());
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'company_name'   => 'required|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'phone'          => 'nullable|string|max:20',
            'email'          => 'nullable|email|max:255',
            'address'        => 'nullable|string',
            'tax_number'     => 'nullable|string|max:50',
            'product_group'  => 'nullable|string|max:255',
        ]);

        return new SupplierResource(Supplier::create($validatedData));
    }

    public function show(string $id)
    {
        return new SupplierResource(Supplier::findOrFail($id));
    }

    public function update(Request $request, string $id)
    {
        $supplier = Supplier::findOrFail($id);

        $validatedData = $request->validate([
            'company_name'   => 'sometimes|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'phone'          => 'nullable|string|max:20',
            'email'          => 'nullable|email|max:255',
            'address'        => 'nullable|string',
            'tax_number'     => 'nullable|string|max:50',
            'product_group'  => 'nullable|string|max:255',
        ]);

        $supplier->update($validatedData);
        return new SupplierResource($supplier);
    }

    public function destroy(string $id)
    {
        Supplier::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}