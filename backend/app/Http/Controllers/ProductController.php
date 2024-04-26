<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Notification;
use App\Models\OrderItem;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\StockMovement;
use App\Models\User;
use App\Models\Image;
use Illuminate\Support\Facades\DB;
use PDF;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::where('delete', '=', 'false')->get();

        return response()->json(['products' => $products], 200);
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
            'name' => 'required|string',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'MinimumNumberAllowedInstock' => 'required|numeric',
            'quantity' => 'required|integer',
        ]);

        $product = Product::create($request->all());

        return response()->json(['message' => 'Product created successfully', 'product' => $product], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $product = Product::findOrFail($id);
        $images = Image::where('product_id', $id)->get();
        $orders = OrderItem::where('productId', $id)->get();
        $notifications = Notification::where('productId', $id)
            ->join('users', 'notifications.userId', '=', 'users.id')
            ->select('notifications.*', 'users.name as userName')
            ->get();

        return response()->json(['product' => $product, 'images' => $images, 'notifications' => $notifications, 'orders' => $orders], 200);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'MinimumNumberAllowedInstock' => 'required|numeric',
            'quantity' => 'required|integer',
        ]);

        $product->update($request->all());

        return response()->json(['message' => 'Product updated successfully', 'product' => $product], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        $product->delete = "true";
        $product->update();
        return response()->json(['message' => 'Product deleted successfully', 'product' => $product], 200);
    }













    public function makeOrderReport()
    {
        $reports = OrderItem::with(['product', 'order'])
            ->selectRaw('products.id AS product_id,
                 products.name AS product_name,
                 price_for_unit AS product_price,
                 sum(order_items.quantity) AS ordered_quantity,
                 sum(case when orders.status = "pending" then order_items.quantity else 0 end) as pending_quantity,
                 sum(case when orders.status = "in progress" then order_items.quantity else 0 end) as in_progress_quantity,
                 sum(case when orders.status = "fulfilled" then order_items.quantity else 0 end) as fulfilled_quantity,
                 sum(case when orders.status = "rejected" then order_items.quantity else 0 end) as rejected_quantity,
                 sum(case when orders.status = "fulfilled" then order_items.quantity * price_for_unit else 0 end) AS total_sales')
            ->join('products', 'order_items.productId', '=', 'products.id')
            ->join('orders', 'order_items.orderId', '=', 'orders.id')
            ->groupBy('products.id', 'products.name', 'price_for_unit')
            ->get();
        $products = count(Product::all());
        $pendingOrder = count(Order::where('status', '=', 'pending')->get());
        $progressOrder = count(Order::where('status', '=', 'in progress')->get());
        $fulfilledOrder = count(Order::where('status', '=', 'fulfilled')->get());
        $rejectedOrder = count(Order::where('status', '=', 'rejected')->get());
        $RecentOrders = Order::latest()->limit(5)->get();

        $Orders = count(Order::all());
        $totalPrice = Order::sum('total_price');

        $notification = count(Notification::all());
        $usersCount = User::where('role', '=', 'regular')->count();
        $EmployCount = User::where('role', '!=', 'regular')->count();

        $StockMovement = count(StockMovement::all());
        $data = [
            'reports' => $reports,
            'rejectedOrder' => $rejectedOrder,
            'Orders' => $Orders,
            'RecentOrders' => $RecentOrders,
            'notification' => $notification,
            'StockMovement' => $StockMovement,
            'fulfilledOrder' => $fulfilledOrder,
            'progressOrder' => $progressOrder,
            'pendingOrder' => $pendingOrder,
            'products' => $products,
            'usersCount' => $usersCount,
            'EmployCount' => $EmployCount,
            'totalPrice' => $totalPrice,
        ];
        $pdf = PDF::loadView('ProductsReport', $data);
        $pdf->getDomPDF()->setHttpContext(
            stream_context_create([
                'ssl' => [
                    'allow_self_signed' => TRUE,
                    'verify_peer' => FALSE,
                    'verify_peer_name' => FALSE,
                ]
            ])
        );

        return $pdf;
        return $pdf->download('Users.pdf');
    }
    public function callOrderReport()
    {
        $pdf = $this->makeOrderReport();

        return response()->streamDownload(function () use ($pdf) {
            echo $pdf->output();
        }, 'ProductsReport.pdf');
    }
}
