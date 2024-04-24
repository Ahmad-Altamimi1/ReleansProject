<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockMovement extends Model
{
    use HasFactory;
    protected $table = 'stock_movements';
    protected $fillable = [
        'movement_type', "userId", 'productId', 'quantity', 'movNo'
    ];
    // public function user()
    // {
    //     return $this->belongsTo(User::class, 'userId', 'id');
    // }
    // public function product()
    // {
    //     return $this->belongsTo(Product::class, 'productId', 'id');
    // }
}
