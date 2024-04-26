<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Order;
use App\Models\Notification;
use App\Models\OrderItem;
use App\Http\Controllers\Controller;
use App\Http\Controllers\NotificationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class OrderController extends Controller
{

    public function index()
    {
        $orders = Order::join('users', 'orders.user_id', '=', 'users.id')
            ->select('orders.*', 'users.name as userName')
            ->get();
        $allProducts = Product::where('delete', '=', 'false')->get();
        return response()->json(['orders' => $orders, 'allProducts' => $allProducts], 200);
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
        $validatedData = $request->validate([
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);
        $order = Order::create([
            'user_id' => Auth::user()->id,
            'total_price' => 0,
        ]);
        $totalPrice = 0;
        foreach ($request->request as $item) {
            $product = Product::findOrFail($item['productId']);
            if ($product) {
                $priceForUnit = $product->price;
                $totalPrice += $priceForUnit * $item['quantity'];
                OrderItem::create([
                    'orderId' => $order->id,
                    'productId' => $item['productId'],
                    'quantity' => $item['quantity'],
                    'price_for_unit' => $priceForUnit,
                ]);
            }
        }
        $order->total_price = $totalPrice;
        $order->save();

        return response()->json(['message' => 'Order created successfully', 'productId' => $product->id], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $order = Order::with('user')->findOrFail($id);
        $orderItems = OrderItem::with('product')->where('orderId', $id)->get();
        $allProducts = Product::all();

        return response()->json(['order' => $order, 'orderItem' => $orderItems, "allProducts" => $allProducts], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        $orderItems = OrderItem::with('product')->where('orderId', $order->id)->get();
        $lowQuantityProducts = [];
        $productAvailability = true;

        if ($order->status == 'pending') {
            if ($request[0] == 'fulfilled' || $request[0] == 'in progress') {
                foreach ($orderItems as $item) {
                    if ($item->product->quantity < $item->quantity) {
                        $productAvailability = false;
                    }
                }
                if ($productAvailability) {
                    foreach ($orderItems as $item) {
                        $product = $item->product;
                        $product->quantity -= $item->quantity;
                        $product->update();

                        if ($product->quantity < $product->MinimumNumberAllowedInstock) {
                            $lowQuantityProducts[] = $product->id;
                        }
                    }
                    $order->status = $request[0];
                    $order->update();
                    if (count($lowQuantityProducts)) {
                        $this->sendNotification($lowQuantityProducts);
                    }

                    return response()->json(['message' => 'Order status updated successfully', 'lowQuantityProducts' => $lowQuantityProducts, 'productId' => $product->id], 201);
                } else {

                    return response()->json(['message' => 'Order itme  quantity is more than the stock'], 205);
                }
            } elseif ($request[0] == 'rejected') {
                $order->status = $request[0];
                $order->update();
                return response()->json(['message' => 'Order status updated successfully', 'lowQuantityProducts' => $lowQuantityProducts], 201);
            } else {
                return response()->json(['message' => 'Nothing to Change'], 207);
            }
        }
        if ($order->status == 'rejected') {
            if ($request[0] == 'fulfilled' || $request[0] == 'in progress') {
                foreach ($orderItems as $item) {

                    if ($item->product->quantity < $item->quantity) {
                        $productAvailability = false;
                    }
                }
                if ($productAvailability) {
                    foreach ($orderItems as $item) {
                        $product = $item->product;
                        $product->quantity -= $item->quantity;
                        $product->update();

                        if ($item->product->quantity < $item->product->MinimumNumberAllowedInstock) {
                            $lowQuantityProducts[] = $item->product->id;
                        }
                    }

                    $order->status = $request[0];
                    $order->update();
                    if (count($lowQuantityProducts)) {
                        $this->sendNotification($lowQuantityProducts);
                    }
                    return response()->json(['message' => 'Order status updated successfully', 'lowQuantityProducts' => $lowQuantityProducts], 201);
                } else {
                    return response()->json(['message' => 'Order itames   quantity is more than the stock'], 205);
                }
            } elseif ($request[0] == 'pending') {
                $order->status = $request[0];
                $order->update();
                return response()->json(['message' => 'Order status updated successfully', 'lowQuantityProducts' => $lowQuantityProducts], 201);
            } else {
                return response()->json(['message' => 'Nothing to Change'], 207);
            }
        }
        if ($order->status == 'in progress') {
            if ($request[0] == 'pending' || $request[0] == 'rejected') {
                foreach ($orderItems as $item) {
                    $product = $item->product;
                    $product->quantity += $item->quantity;
                    $product->update();
                    if ($item->product->quantity < $item->product->MinimumNumberAllowedInstock) {
                        $lowQuantityProducts[] = $item->product->id;
                    }
                }
                $order->status = $request[0];
                $order->update();
                if (count($lowQuantityProducts)) {
                    $this->sendNotification($lowQuantityProducts);
                }
                return response()->json(['message' => 'Order status updated successfully', 'lowQuantityProducts' => $lowQuantityProducts], 201);
            } elseif ($request[0] == 'fulfilled') {
                $order->status = $request[0];
                $order->update();
                return response()->json(['message' => 'Order status updated successfully', 'lowQuantityProducts' => $lowQuantityProducts], 201);
            } else {
                return response()->json(['message' => 'Nothing to Change'], 207);
            }
        }
        if ($order->status == 'fulfilled') {
            if ($request[0] == 'pending' || $request[0] == 'rejected') {
                foreach ($orderItems as $item) {
                    $product = $item->product;
                    $product->quantity += $item->quantity;
                    $product->update();
                    if ($item->product->quantity < $item->product->MinimumNumberAllowedInstock) {
                        $lowQuantityProducts[] = $item->id;
                    }
                }
                $order->status = $request[0];
                $order->update();
                if (count($lowQuantityProducts)) {
                    $this->sendNotification($lowQuantityProducts);
                }

                return response()->json(['message' => 'Order status updated successfully', 'lowQuantityProducts' => $lowQuantityProducts], 201);
            } elseif ($request[0] == 'in progress') {
                $order->status = $request[0];
                $order->update();
                return response()->json(['message' => 'Order status updated successfully', 'lowQuantityProducts' => $lowQuantityProducts], 201);
            } else {
                return response()->json(['message' => 'Nothing to Change'], 207);
            }
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
    }
    public function sendNotification($Productsid)
    {

        foreach ($Productsid as  $Productid) {
            $Product = Product::findOrfail($Productid);
            $notification = new Notification();
            $notification->productId = $Product->id;
            $notification->userId = auth()->id();
            $notification->message = `The` . $Product->name . ' Low Stock';

            $notification->save();
        };
    }
}
