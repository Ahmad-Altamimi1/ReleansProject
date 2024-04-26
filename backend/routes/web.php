<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ColectionData;
use Illuminate\Support\Facades\Route;
use App\Models\OrderItem;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/


// Route::get('/get-csrf-token', function () {
//     return response()->json(['token' => csrf_token()]);
// });
Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');
Route::get('/r', function () {
    return view('dashboard');
});

Route::get('/', [ColectionData::class, 'collectionDatapdf']);
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
