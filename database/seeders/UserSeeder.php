<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\User::factory()->create([
            'name' => 'Arfi Afianto',
            'email' => 'kasir@rsdeltasurya.com',
            'password' => bcrypt('password'),
            'role' => 'kasir',
        ]);

        \App\Models\User::factory()->create([
            'name' => 'Siti Nurhaliza',
            'email' => 'marketing@rsdeltasurya.com',
            'password' => bcrypt('password'),
            'role' => 'marketing',
        ]);
    }
}
