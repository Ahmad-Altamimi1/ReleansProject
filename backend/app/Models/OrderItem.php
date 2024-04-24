<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'orderId', 'productId', 'quantity', 'price_for_unit'
    ];
    protected $table = 'order_items';
    public function product()
    {
        return $this->belongsTo(Product::class, 'productId');
    }


    public function order()
    {
        return $this->belongsTo(Order::class, 'orderId');
    }
}
