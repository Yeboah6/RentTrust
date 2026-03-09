<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payment;

class PaymentController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified', 'role:super_admin']);
    }

    public function index()
    {
        $payments = Payment::with('user', 'plan')->orderByDesc('created_at')->get();
        return inertia('SuperAdmin/Payments/Index', ['payments' => $payments]);
    }

    public function refund(Payment $payment)
    {
        // refund logic
        $payment->status = 'refunded';
        $payment->save();
        return back()->with('success', 'Payment refunded');
    }
}
