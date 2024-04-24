<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class OrderItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'orderId' => 'required|exists:orders,id',
            'productId' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);
        $order = Order::findOrFail($request->orderId);
        if ($order->status == 'pending') {
            $product = Product::findOrFail($request->productId);
            $order->total_price += $product->price * $request->quantity;
            OrderItem::create([
                'orderId' => $request->orderId,
                'productId' => $request->productId,
                'quantity' => $request->quantity,
                'price_for_unit' => $product->price,
            ]);
            $order->update();
            return response()->json(['message' => 'Order Item added successfully'], 201);
        }
        return response()->json(['message' => 'the order is no longer Pending, please create a new order '], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(OrderItem $orderItem)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(OrderItem $orderItem)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, OrderItem $orderItem)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);
        $order = Order::findOrFail($orderItem->orderId);

        if ($order->status == 'pending') {
            if ($orderItem->quantity != $request->quantity) {
                $order->total_price -= $orderItem->price_for_unit * $orderItem->quantity;
                $order->total_price += $orderItem->price_for_unit * $request->quantity;
                $orderItem->quantity = $request->quantity;
                $orderItem->update();
                $order->update();
                return response()->json(['message' => 'Order Item updated successfully'], 201);
            }
            return response()->json(['message' => 'There is no change in the quantity'], 201);
        }
        return response()->json(['message' => 'the order is no longer Pending, please create a new order '], 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $orderItem = OrderItem::findOrFail($id);
        $order = Order::findOrFail($orderItem->orderId);
        if ($order->status == 'pending') {
            $order->total_price -= $orderItem->price_for_unit * $orderItem->quantity;
            $order->update();
            $orderItem->delete();
            return response()->json(['message' => 'Order Item deleted successfully'], 200);
        }
        return response()->json(['message' => 'the order is no longer Pending, please create a new order '], 201);
    }
}
