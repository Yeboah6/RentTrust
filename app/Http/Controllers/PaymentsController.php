<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Plan;
use App\Models\AdminAuditLog;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentsController extends Controller
{
    /**
     * Admin: mark a successful payment as refunded and cancel its subscription.
     */
    public function refundPayment(int $id)
    {
        $payment = Payment::findOrFail($id);

        if ($payment->status !== 'success') {
            return back()->with('error', 'Only successful payments can be refunded.');
        }

        DB::transaction(function () use ($payment) {
            $payment->update(['status' => 'refunded']);

            if ($payment->subscription_id) {
                Subscription::where('id', $payment->subscription_id)
                    ->update(['status' => 'cancelled']);

                // Downgrade user package to free
                User::where('id', $payment->user_id)->update(['package' => 'free']);
            }
        });

        Log::info('Admin refunded payment', ['payment_id' => $id, 'admin' => auth()->id()]);

        return back()->with('success', "Payment refunded successfully.");
    }

    /**
     * Admin: force-cancel an active subscription.
     */
    public function cancelSubscription(int $id)
    {
        $sub = Subscription::with('plan')->findOrFail($id);

        $sub->update(['status' => 'cancelled']);

        // Downgrade user package
        User::where('id', $sub->user_id)->update(['package' => 'free']);

        Log::info('Admin cancelled subscription', ['subscription_id' => $id, 'admin' => auth()->id()]);

        return back()->with('success', "Subscription cancelled.");
    }

    
    /**
     * Ajax-compatible filter for the payments table.
     * Returns JSON for client-side filtering.
     */
    public function filterPayments(Request $request)
    {
        $query = Payment::with(['user:id,name,email'])->orderByDesc('created_at');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('provider')) {
            $query->where('provider', $request->provider);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('reference', 'like', "%{$search}%")
                  ->orWhereHas('user', fn ($u) =>
                      $u->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                  );
            });
        }

        if ($request->filled('from')) {
            $query->whereDate('created_at', '>=', $request->from);
        }

        if ($request->filled('to')) {
            $query->whereDate('created_at', '<=', $request->to);
        }

        return response()->json(
            $query->limit(200)->get()->map(fn ($p) => [
                'id'             => $p->id,
                'reference'      => $p->reference,
                'user'           => $p->user ? ['name' => $p->user->name, 'email' => $p->user->email] : null,
                'amount'         => (float) $p->amount,
                'currency'       => $p->currency,
                'provider'       => $p->provider,
                'status'         => $p->status,
                'failure_reason' => $p->failure_reason,
                'created_at'     => $p->created_at->format('M d, Y H:i'),
            ])
        );
    }
}