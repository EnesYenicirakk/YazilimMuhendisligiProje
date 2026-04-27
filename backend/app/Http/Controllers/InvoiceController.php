<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Http\Resources\InvoiceResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    // 1. READ: Tüm faturaları ilişkileriyle beraber listele
    public function index()
    {
        // Müşteri, tedarikçi, fatura kalemleri ve bu faturaya yapılmış ödemeleri tek seferde çekiyoruz
        $invoices = Invoice::with(['customer', 'supplier', 'items.product', 'payments'])->get();
        return InvoiceResource::collection($invoices);
    }

    // 2. CREATE: Yeni fatura ve kalemlerini oluştur (Örn: Sipariş tamamlandığında)
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'invoice_number' => 'required|string|unique:invoices,invoice_number',
            'type' => 'required|string|in:sales,purchase', // Sadece bu iki kelime kabul edilir
            'customer_id' => 'nullable|exists:customers,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'issue_date' => 'required|date',
            'due_date' => 'nullable|date',
            'sub_total' => 'required|numeric',
            'tax_total' => 'required|numeric',
            'grand_total' => 'required|numeric',
            'items' => 'required|array', // Fatura kalemleri listesi
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric',
            'items.*.tax_rate' => 'required|numeric' // KDV oranı
        ]);

        DB::beginTransaction();

        try {
            // A. Ana Fatura Başlığını Oluştur
            $invoice = Invoice::create([
                'invoice_number' => $validatedData['invoice_number'],
                'type' => $validatedData['type'],
                'customer_id' => $validatedData['customer_id'] ?? null,
                'supplier_id' => $validatedData['supplier_id'] ?? null,
                'issue_date' => $validatedData['issue_date'],
                'due_date' => $validatedData['due_date'] ?? null,
                'sub_total' => $validatedData['sub_total'],
                'tax_total' => $validatedData['tax_total'],
                'grand_total' => $validatedData['grand_total'],
                'status' => 'pending' // Fatura kesildi ama henüz ödenmedi
            ]);

            // B. Fatura Kalemlerini (İçindeki ürünleri) ekle
            foreach ($validatedData['items'] as $item) {
                InvoiceItem::create([
                    'invoice_id' => $invoice->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'tax_rate' => $item['tax_rate']
                ]);
            }

            DB::commit();

            $invoice->load(['customer', 'supplier', 'items.product']);
            return new InvoiceResource($invoice);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Fatura oluşturulamadı.', 'details' => $e->getMessage()], 500);
        }
    }

    // 3. READ (Tekil): Sadece tek bir faturanın tüm detayları
    public function show(string $id)
    {
        $invoice = Invoice::with(['customer', 'supplier', 'items.product', 'payments'])->findOrFail($id);
        return new InvoiceResource($invoice);
    }

    // 4. UPDATE: Fatura durumunu veya notlarını güncelle
    public function update(Request $request, string $id)
    {
        $invoice = Invoice::findOrFail($id);

        $validatedData = $request->validate([
            'status'   => 'sometimes|string',
            'due_date' => 'sometimes|nullable|date',
            'notes'    => 'sometimes|nullable|string',
        ]);

        $invoice->update($validatedData);
        $invoice->load(['customer', 'supplier', 'items.product', 'payments']);

        return new InvoiceResource($invoice);
    }

    // 5. DELETE: Faturayı sil
    public function destroy(string $id)
    {
        $invoice = Invoice::findOrFail($id);
        $invoice->delete();

        return response()->json(null, 204);
    }
}