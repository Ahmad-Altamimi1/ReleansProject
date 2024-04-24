<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {


            $table->id();
            $table->unsignedBigInteger('productId')->nullable();
            $table->foreign('productId')->references('id')->on('products')->onDelete('set null');
            $table->foreignId('userId')->constrained('users')->onDelete('cascade');
            $table->string('message');
            $table->enum('status', ['reed', 'notreed'])->default('notreed');
            $table->enum('open', ['true', 'false'])->default('false');
            $table->enum('delete', ['true', 'false'])->default('false');
            $table->enum('receiver', ['admin', 'manager', 'regular'])->default('admin');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
