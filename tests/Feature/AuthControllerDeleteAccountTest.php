<?php

use App\Http\Controllers\AuthController;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

it('deletes the currently authenticated user without trying to use undefined guards', function () {
    $user = User::factory()->create([
        'name' => 'Test User',
        'email' => 'test@example.com',
        'phone' => '08012345678',
        'password' => Hash::make('secret123'),
        'role' => 'tenant',
        'package' => 'free',
        'status' => 'active',
    ]);

    $this->actingAs($user);

    Payment::create([
        'user_id' => $user->id,
        'subscription_id' => null,
        'reference' => 'pay_' . uniqid(),
        'provider' => 'paystack',
        'amount' => 100.00,
        'currency' => 'GHS',
        'status' => 'success',
        'failure_reason' => null,
        'raw_payload' => ['test' => true],
    ]);

    $request = Request::create('/settings/account', 'DELETE', [
        'password' => 'secret123',
    ]);
    $request->setLaravelSession(session());

    $response = app(AuthController::class)->deleteAccount($request);

    expect($response->getStatusCode())->toBe(302)
        ->and($response->headers->get('Location'))->toContain('/');

    expect(User::find($user->id))->toBeNull();
});
