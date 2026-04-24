<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Http\Resources\CategoryResource;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        return CategoryResource::collection(Category::all());
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
        ]);

        $category = Category::create($validatedData);
        return new CategoryResource($category);
    }

    public function show(string $id)
    {
        return new CategoryResource(Category::findOrFail($id));
    }

    public function update(Request $request, string $id)
    {
        $category = Category::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
        ]);

        $category->update($validatedData);
        return new CategoryResource($category);
    }

    public function destroy(string $id)
    {
        Category::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}