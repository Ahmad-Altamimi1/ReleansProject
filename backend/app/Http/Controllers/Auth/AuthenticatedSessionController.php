<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\Response;
use Laravel\Passport\Client;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;
use Illuminate\Http\JsonResponse;
use App\Models\User;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\HasApiTokens;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): View
    {
        return view('auth.login');
    }


    public function registration(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'message' => $validator->errors()->first(),
            ], 422);
        }

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('usersAvatars'), $imageName);
            $imagePath = url('usersAvatars/' . $imageName);
        }

        $user = new User;
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->image = $imagePath;
        $user->role = 'regular';
        $user->save();

        event(new Registered($user));

        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {

            $token = $user->createToken('app')->accessToken;


            return response()->json(['token' => $token, 'user' => $user], 200);
        }

        return response()->json(
            [
                'status' => 500,
                'message' => 'Failed to create user. Please try again later.',
            ],
            500
        );
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): JsonResponse
    {



        $credentials = $request->only('email', 'password');
        if (Auth::attempt($credentials)) {
            $request->authenticate();
            $user = Auth::user();

            $token = $user->createToken('app')->accessToken;

            return response()->json(['token' => $token, 'user' => $user], 200);
        } else {

            return response()->json(['message' => 'Email not found or incorrect password'], 401);
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): JsonResponse
    {

        $request->user()->token()->revoke();

        $request->user()->token()->delete();
        Auth::guard('web')->logout();
        return response()->json(['message' => 'Logged out successfully'], 200);
    }
}
