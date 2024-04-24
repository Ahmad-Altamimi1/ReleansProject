<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name,
            'quantity' => $this->faker->randomNumber(2),
            'description' => $this->faker->sentence,
            'addby' => 1,
            'MinimumNumberAllowedInstock' => $this->faker->randomNumber(2),
            'price' => $this->faker->randomNumber(2),

        ];
    }
}
