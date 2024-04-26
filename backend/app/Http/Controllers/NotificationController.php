<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class NotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function allnotification()
    {
        $userRole = Auth::user()->role;
        $userID = Auth::user()->id;

        $notifications = Notification::with(['user:id,name', 'product:id,name'])
            ->when($userRole !== 'admin', function ($query) use ($userRole, $userID) {
                return $query->where('receiver', $userRole)->orWhere('userId', $userID);
            })
            ->get()->map(function ($notification) {
                if (isset($notification->product->name)) {
                    $Name = $notification->product->name;
                }
                return [
                    'userName' => $notification->user->name,
                    'productName' => $Name,
                    'notification' => $notification,
                ];
            });

        return response()->json(['notifications' => $notifications], 200);
    }


    public function index()
    {
        $user = Auth::user();
        $UserRole = Auth::user()->role;
        $userID = Auth::user()->id;
        $notifications = Notification::where('receiver', $UserRole)
            ->orWhere('userId', $userID)
            ->with(['user:id,name', 'product:id,name'])
            ->orderBy('id', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($notification) {
                if (isset($notification->user->name) && isset($notification->product->name)) {
                    $Name = $notification->user->name;
                    $Namee = $notification->product->name;
                } else {
                    $Name = 'Ahmad Altamimi';
                    $Namee = 'Ahmad Altamimi';
                }
                return [

                    'userName' => $Name,
                    'productName' => $Namee,
                    'notification' => $notification,
                ];
            });
        return response()->json(['notifications' => $notifications], 200);
    }
    public function notReednotifications()
    {
        $notifications = Notification::where('open', '=', 'false')->get();
        return response()->json(['notReednotifications' => $notifications], 200);
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
        $userId = Auth::user()->id;
        $request['userId'] = $userId;
        $notification = Notification::create($request->all());
        return response()->json([
            'message' => 'Notification created successfully',
            'id' => $notification->id
        ], 201);
    }
    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $notification = Notification::findOrfail($id);
        return response()->json(['notification' => $notification], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Notification $notification)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        // Define validation rules
        $rules = [
            'message' => 'required|string',
            'receiver' => 'required|in:admin,manager,regular',
        ];

        // Validate the incoming request data
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        try {
            // Find the notification by ID
            $notification = Notification::findOrFail($id);

            $notification->update([
                'userId' => Auth::user()->id,
                'message' => $request->input('message'),
                'receiver' => $request->input('receiver'),
            ]);

            return response()->json([
                'message' => 'Notification updated successfully',
                'productId' => $notification->productId,
                'notification' => $notification,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->delete();

        return response()->json(['message' => 'Notification deleted successfully'], 200);
    }
}
