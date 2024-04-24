<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {


        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();
            $table->string('productId');
            $table->string('userId');
            // $table->foreignId('productId')->constrained('products')->onDelete('cascade');
            $table->integer('quantity');
            $table->string('movNo')->default('');
            $table->enum('movement_type', ['addition', 'deduction']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
    }
};
