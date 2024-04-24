<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ColectionData extends Controller
{
    protected function collectionData(): JsonResponse
    {
        $products = count(Product::all());
        $pendingOrder = count(Order::where('status', '=', 'pending')->get());
        $progressOrder = count(Order::where('status', '=', 'in progress')->get());
        $fulfilledOrder = count(Order::where('status', '=', 'fulfilled')->get());
        $rejectedOrder = count(Order::where('status', '=', 'rejected')->get());
        $popularProducts = OrderItem::select('order_items.productId', 'products.name as productName', DB::raw('COUNT(order_items.productId) as purchase_count'))
            ->join('products', 'order_items.productId', '=', 'products.id')
            ->groupBy('order_items.productId', 'products.name')
            ->orderByDesc('purchase_count')
            ->limit(5)
            ->get();
        if (Auth::user()->role === 'admin') {
            $RecentOrders = Order::latest()->limit(5)->get();
        } else {
            $RecentOrders = Order::where('user_id', Auth::id())->latest()->limit(5)->get();
        }
        $Orders = count(Order::all());
        $OrdersItems = count(OrderItem::all());
        $totalPrice = Order::sum('total_price');
        $notification = count(Notification::all());
        $usersCount = User::where('role', '=', 'regular')->count();
        $EmployCount = User::where('role', '!=', 'regular')->count();
        $Admins = User::where('role', '=', 'admin')->count();

        $StockMovement = count(StockMovement::all());
        return response()->json(
            $responseData = [
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
                'Admins' => $Admins,
                'OrdersItems' => $OrdersItems,
                'popularProducts' => $popularProducts,
                200,
            ]
        );
    }
    protected function collectionDatapdf()
    {
        $products = Product::count();
        $pendingOrder = Order::where('status', 'pending')->count();
        $progressOrder = Order::where('status', 'in progress')->count();
        $fulfilledOrder = Order::where('status', 'fulfilled')->count();
        $rejectedOrder = Order::where('status', 'rejected')->count();
        $RecentOrders = Order::latest()->limit(5)->get();

        $Orders = Order::count();
        $totalPrice = Order::sum('total_price');

        $notification = Notification::count();
        $usersCount = User::where('role', 'regular')->count();
        $EmployCount = User::where('role', '!=', 'regular')->count();
        $reports  = User::where('role', '!=', 'regular')->count();

        $StockMovement = StockMovement::count();

        // Pass data to the view
        return view('dashboard', compact(
            'rejectedOrder',
            'Orders',
            'RecentOrders',
            'notification',
            'StockMovement',
            'fulfilledOrder',
            'progressOrder',
            'pendingOrder',
            'products',
            'usersCount',
            'EmployCount',
            "reports",
            'totalPrice'
        ));
    }
}
