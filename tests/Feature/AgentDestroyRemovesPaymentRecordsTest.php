<?php

namespace Tests\Feature;

use App\Http\Controllers\SuperAdmin\AgentController;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AgentDestroyRemovesPaymentRecordsTest extends TestCase
{
    use RefreshDatabase;

    public function test_destroy_removes_related_payment_rows_before_user_delete(): void
    {
        $agent = User::factory()->create([
            'role' => 'agent',
            'status' => 'active',
        ]);

        Payment::create([
            'user_id' => $agent->id,
            'reference' => 'pay_' . uniqid(),
            'provider' => 'paystack',
            'amount' => 100.00,
            'currency' => 'GHS',
            'status' => 'success',
        ]);

        $controller = app(AgentController::class);

        $response = $controller->destroy($agent);

        $this->assertDatabaseMissing('users', ['id' => $agent->id]);
        $this->assertDatabaseMissing('payments', ['user_id' => $agent->id]);
        $this->assertNotNull($response);
    }
}
