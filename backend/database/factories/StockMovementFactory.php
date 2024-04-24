<?php

namespace Database\Factories;

use Carbon\Carbon;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StockMovement>
 */
class StockMovementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $yearMonth = Carbon::now()->format('Ym');
        $movementNumber = 'PRO' . $yearMonth;
        return [
            'movement_type' => "addition",
            'productId' => 1,
            'userId' => 1,
            'movNo' => $movementNumber . $this->faker->randomNumber(2),
            'quantity' => $this->faker->randomNumber(2),
        ];
    }
}
