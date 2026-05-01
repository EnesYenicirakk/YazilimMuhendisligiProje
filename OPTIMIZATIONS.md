# Optimization Summary

* **Current Optimization Health:** Moderate. The application functions but suffers from classical N+1 database querying issues and memory bloat on index endpoints due to missing pagination.
* **Top 3 highest-impact improvements:**
  1. Implement pagination on `ProductController@index` and `OrderController@index` to prevent memory exhaustion and latency spikes as data grows.
  2. Fix N+1 queries in `ProductController@bulkStockUpdate` to eliminate excessive DB roundtrips.
  3. Wrap multi-step data modifications (e.g., `OrderController@cancel`) in database transactions to prevent partial updates and data corruption.
* **Biggest risk if no changes are made:** As the number of products and orders increases, the `/api/products` and `/api/orders` endpoints will experience significant latency and eventually crash due to PHP memory limits being exceeded.

# Findings (Prioritized)

## 1. Missing Pagination on Index Endpoints
* **Category:** Database / Memory / Network
* **Severity:** Critical
* **Impact:** High latency, potential Out of Memory (OOM) errors, wasted network bandwidth.
* **Evidence:** 
  - `ProductController.php`, line 14: `$products = Product::with('category')->get()->map(...)`
  - `OrderController.php`, line 18: `CustomerOrder::with(['customer', 'items.product'])->get()->map(...)`
* **Why it’s inefficient:** `get()` retrieves the entire table into memory at once. For thousands of records, this consumes massive memory, forces the DB to return full datasets, and forces the server to serialize huge JSON payloads.
* **Recommended fix:** Replace `get()` with `paginate(50)` or `cursorPaginate()`. Adjust the frontend to consume paginated data.
* **Tradeoffs / Risks:** Requires frontend refactoring to support pagination controls or infinite scrolling.
* **Expected impact estimate:** Drastic reduction in TTFB (Time to First Byte) and 90%+ reduction in memory usage for large datasets.
* **Removal Safety:** Needs Verification (depends on frontend capability).
* **Reuse Scope:** Service-wide.

## 2. N+1 Queries in Bulk Stock Update
* **Category:** Database
* **Severity:** High
* **Impact:** Database Latency, Connection Pool Exhaustion.
* **Evidence:** `ProductController.php`, lines 94-102 (`bulkStockUpdate` method).
* **Why it’s inefficient:** Iterating over `$request->items` and calling `Product::find()` followed by `increment()` or `decrement()` triggers 2 separate queries per item. A payload of 100 items will execute 200 distinct queries.
* **Recommended fix:** Use batch updates via SQL `CASE` statements or the `upsert` method. Alternatively, retrieve all products at once `Product::whereIn('id', $ids)->get()`, update them in memory, and use a mass update package or transaction.
* **Tradeoffs / Risks:** Complex query generation if doing manual batch updates.
* **Expected impact estimate:** 80% faster execution for bulk updates involving many items.
* **Removal Safety:** Safe.
* **Reuse Scope:** Local module.

## 3. N+1 Queries and Missing Transaction in Order Cancellation
* **Category:** Database / Reliability
* **Severity:** High
* **Impact:** DB Latency, Data Inconsistency.
* **Evidence:** `OrderController.php`, lines 141-147 (`cancel` method).
* **Why it’s inefficient:** Iterates over `$order->items` and runs an `increment()` query per item. Furthermore, this logic is *not* wrapped in a `DB::transaction()`. If the script fails halfway through, some stock is returned and some is not, leading to inventory desync.
* **Recommended fix:** Wrap the `cancel` method in a `DB::transaction()`. Preload product IDs and use a batch update mechanism if items list is large.
* **Tradeoffs / Risks:** None. Transactions are standard for this operation.
* **Expected impact estimate:** Guarantees data consistency, slightly reduces query overhead if batched.
* **Removal Safety:** Safe.
* **Reuse Scope:** Local module.

# Quick Wins (Do First)
1. Add `DB::transaction()` around the logic in `OrderController@cancel` to ensure atomic stock restoration.
2. Use `$request->validate(...)` in `ProductController@update` before modifying data to prevent saving corrupted records or malicious payloads.

# Deeper Optimizations (Do Next)
* **Architectural Refactor:** Extract the stock increment/decrement logic into a dedicated `InventoryService`. Right now, stock math is scattered across `OrderController` and `ProductController`, which leads to duplicated logic and increases the risk of inconsistencies.
* **API Resources:** Replace manual `mapProductToFrontend` and `mapOrderToFrontend` methods with Laravel API Resources (`JsonResource`). This standardizes transformations and naturally handles pagination metadata.

# Validation Plan
* **Benchmarks:** Run load tests (e.g., using `k6` or `Artillery`) against `/api/products` with 10,000 seeded database records before and after adding pagination.
* **Profiling strategy:** Use Laravel Telescope or Clockwork to monitor the number of executed SQL queries during a `bulkStockUpdate` operation. Ensure it drops from `2N` to a constant number.
* **Metrics:** Monitor PHP memory usage (`memory_get_peak_usage()`) on the index endpoints.
* **Test cases:** Write feature tests asserting that `OrderController@cancel` rolls back stock changes if an exception occurs mid-execution.
