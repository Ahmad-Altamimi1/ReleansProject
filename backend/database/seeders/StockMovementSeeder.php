<?php

namespace Database\Seeders;

use App\Models\StockMovement;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StockMovementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \Illuminate\Database\Eloquent\Factories\Factory::factoryForModel(StockMovement::class)->count(10)->create();
    }
}
