<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Http\Resources\PaymentResource;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    // 1. READ: Tüm ödeme ve tahsilatları listele (Kasa/Banka Raporu)
    public function index()
    {
        $payments = Payment::with(['customer', 'supplier', 'invoice'])->get();
        return PaymentResource::collection($payments);
    }

    // 2. CREATE: Kasaya giren (Tahsilat) veya çıkan (Ödeme) parayı kaydet
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'type' => 'required|string|in:incoming,outgoing', // Gelir veya Gider
            'amount' => 'required|numeric',
            'payment_date' => 'required|date',
            'customer_id' => 'nullable|exists:customers,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'invoice_id' => 'nullable|exists:invoices,id', // Bu ödeme belirli bir faturaya ait olabilir
            'description' => 'nullable|string'
        ]);

        $payment = Payment::create([
            'type' => $validatedData['type'],
            'amount' => $validatedData['amount'],
            'payment_date' => $validatedData['payment_date'],
            'customer_id' => $validatedData['customer_id'] ?? null,
            'supplier_id' => $validatedData['supplier_id'] ?? null,
            'invoice_id' => $validatedData['invoice_id'] ?? null,
            'status' => 'completed',
            'description' => $validatedData['description'] ?? null
        ]);

        // Bilgileri ilişkileriyle geri döndür
        $payment->load(['customer', 'supplier', 'invoice']);
        return new PaymentResource($payment);
    }

    // 3. READ (Tekil): Tek bir ödeme makbuzunu göster
    public function show(string $id)
    {
        $payment = Payment::with(['customer', 'supplier', 'invoice'])->findOrFail($id);
        return new PaymentResource($payment);
    }

    // 4. UPDATE: Ödeme bilgilerini güncelle
    public function update(Request $request, string $id)
    {
        $payment = Payment::findOrFail($id);

        $validatedData = $request->validate([
            'amount'       => 'sometimes|numeric',
            'payment_date' => 'sometimes|date',
            'status'       => 'sometimes|string',
            'description'  => 'sometimes|nullable|string',
        ]);

        $payment->update($validatedData);
        $payment->load(['customer', 'supplier', 'invoice']);

        return new PaymentResource($payment);
    }

    // 5. DELETE: Ödeme kaydını sil
    public function destroy(string $id)
    {
        $payment = Payment::findOrFail($id);
        $payment->delete();

        return response()->json(null, 204);
    }
}