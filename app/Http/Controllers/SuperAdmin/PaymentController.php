<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\AdminAuditLog;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified', 'role:super_admin']);
    }

    public function index()
    {
        $payments = Payment::with(['user', 'subscription.plan'])
            ->latest()
            ->get()
            ->map(fn ($p) => $this->formatPayment($p));
 
        return Inertia::render('SuperAdmin/Payments/Index', [
            'payments' => $payments,
        ]);
    }

    // ─── Show ─────────────────────────────────────────────────────────────────
 
    public function show(int $id)
    {
        $payment = Payment::with(['user', 'subscription.plan'])->findOrFail($id);
 
        // Fetch refund history for this payment
        $refunds = Payment::where('parent_payment_id', $id)
            ->orWhere(fn ($q) => $q->where('reference', 'like', "REFUND-{$payment->reference}%"))
            ->where('type', 'refund')
            ->latest()
            ->get()
            ->map(fn ($r) => [
                'id'         => $r->id,
                'reference'  => $r->reference,
                'amount'     => (float) $r->amount,
                'currency'   => $r->currency ?? 'GHS',
                'status'     => $r->status,
                'reason'     => $r->notes ?? $r->reason ?? '—',
                'created_at' => $r->created_at->format('M d, Y · H:i'),
            ]);
 
        // Total already refunded
        $totalRefunded = $refunds->where('status', 'success')->sum('amount');
        $refundable    = max(0, (float) $payment->amount - $totalRefunded);
 
        return Inertia::render('SuperAdmin/Payments/PaymentShow', [
            'payment'        => $this->formatPayment($payment, detail: true),
            'refunds'        => $refunds,
            'total_refunded' => $totalRefunded,
            'refundable'     => $refundable,
        ]);
    }
    
    // ─── Refund ───────────────────────────────────────────────────────────────
 
    public function refund(Request $request, int $id)
    {
        $payment = Payment::with(['user', 'subscription.plan'])->findOrFail($id);
 
        // Guard: only successful payments can be refunded
        abort_if(
            $payment->status !== 'success' && $payment->status !== 'paid',
            422,
            'Only successful payments can be refunded.'
        );
 
        // Calculate how much has already been refunded
        $alreadyRefunded = Payment::where('parent_payment_id', $id)
            ->where('type', 'refund')
            ->where('status', 'success')
            ->sum('amount');
 
        $maxRefundable = (float) $payment->amount - (float) $alreadyRefunded;
 
        abort_if($maxRefundable <= 0, 422, 'This payment has already been fully refunded.');
 
        $request->validate([
            'amount' => [
                'required',
                'numeric',
                'min:0.01',
                "max:{$maxRefundable}",
            ],
            'reason' => 'required|string|max:500',
        ]);
 
        $refundAmount = (float) $request->amount;
        $isPartial    = $refundAmount < $maxRefundable;
 
        DB::transaction(function () use ($payment, $refundAmount, $request, $isPartial, $maxRefundable) {
            // 1. Create a refund payment record
            $refund = Payment::create([
                'payment_id'        => Payment::generateUUID(),
                'user_id'           => $payment->user_id,
                'subscription_id'   => $payment->subscription_id,
                'parent_payment_id' => $payment->id,
                'reference'         => 'REFUND-' . $payment->reference . '-' . now()->format('YmdHis'),
                'amount'            => $refundAmount,
                'currency'          => $payment->currency ?? 'GHS',
                'provider'          => $payment->provider,
                'type'              => 'refund',
                'status'            => 'success',
                'notes'             => $request->reason,
            ]);
 
            // 2. Mark the original payment as refunded (partial or full)
            $payment->update([
                'status' => $isPartial ? 'partially_refunded' : 'refunded',
            ]);
 
            // 3. If fully refunded and there's a linked active subscription, cancel it
            if (!$isPartial && $payment->subscription_id) {
                $sub = Subscription::find($payment->subscription_id);
                if ($sub && in_array($sub->status, ['active', 'trial'])) {
                    $sub->update(['status' => 'cancelled']);
                    User::where('id', $payment->user_id)->update(['package' => 'free']);
                }
            }
 
            // 4. Audit log
            AdminAuditLog::record('payment', $isPartial ? 'Partial refund issued' : 'Full refund issued', [
                'affected_user' => $payment->user?->name ?? '—',
                'affected_id'   => $payment->user_id,
                'notes'         => "Refunded GH₵{$refundAmount} of GH₵{$payment->amount}. Reason: {$request->reason}",
                'properties'    => [
                    'payment_id'     => $payment->id,
                    'refund_id'      => $refund->id,
                    'refund_amount'  => $refundAmount,
                    'original_amount'=> (float) $payment->amount,
                    'is_partial'     => $isPartial,
                    'reason'         => $request->reason,
                ],
            ]);
 
            Log::info('SuperAdmin issued refund', [
                'payment_id'      => $payment->id,
                'refund_id'       => $refund->id,
                'user_id'         => $payment->user_id,
                'refund_amount'   => $refundAmount,
                'original_amount' => (float) $payment->amount,
                'is_partial'      => $isPartial,
                'reason'          => $request->reason,
                'admin_id'        => Auth::id(),
            ]);
        });
 
        try {
            $agent = $payment->user;
            $adminEmails = User::where('role', 'super_admin')
                ->whereNotNull('email')
                ->pluck('email')
                ->filter()
                ->unique()
                ->values()
                ->all();
 
            $agentSubject = "Refund issued for payment {$payment->reference}";
            $agentMessage = "Hello {$agent?->name},\n\n" .
                "A refund of GH₵" . number_format($refundAmount, 2) . " has been processed for payment reference {$payment->reference}.\n\n" .
                "Amount: GH₵" . number_format($refundAmount, 2) . "\n" .
                "Reason: {$request->reason}\n" .
                "Status: " . ($isPartial ? 'Partial refund' : 'Full refund') . "\n\n" .
                "If you have any questions, please contact support.\n\n" .
                "Thank you.\n";
 
            if ($agent?->email) {
                Mail::raw($agentMessage, function ($message) use ($agentSubject, $agent) {
                    $message->to($agent->email, $agent->name)
                        ->subject($agentSubject);
                });
            }
 
            $adminSubject = "[Admin] Refund issued for payment {$payment->reference}";

            if (!empty($adminEmails)) {
                $adminMessage = "A refund was issued by admin " . Auth::user()->name . " (" . Auth::user()->email . ") for payment {$payment->reference}.\n\n" .
                    "Refund amount: GH₵" . number_format($refundAmount, 2) . "\n" .
                    "Original payment amount: GH₵" . number_format($payment->amount, 2) . "\n" .
                    "Reason: {$request->reason}\n" .
                    "Refund type: " . ($isPartial ? 'Partial refund' : 'Full refund') . "\n\n" .
                    "Agent: " . ($agent?->name ?? 'N/A') . " <" . ($agent?->email ?? 'N/A') . ">\n" .
                    "Payment reference: {$payment->reference}\n";
 
                Mail::raw($adminMessage, function ($message) use ($adminSubject, $adminEmails) {
                    $message->to($adminEmails)
                        ->subject($adminSubject);
                });
            }
        } catch (\Throwable $exception) {
            Log::warning('Refund notification delivery failed', [
                'payment_id' => $payment->id,
                'admin_id'   => Auth::id(),
                'message'    => $exception->getMessage(),
            ]);
        }
 
        return back()->with('success', 'Refund of GH₵' . number_format($refundAmount, 2) . ' processed successfully.');
    }
 
    // ─── Helper ───────────────────────────────────────────────────────────────
 
    private function formatPayment(Payment $p, bool $detail = false): array
    {
        $base = [
            'id'          => $p->id,
            'reference'   => $p->reference,
            'amount'      => (float) $p->amount,
            'currency'    => $p->currency   ?? 'GHS',
            'provider'    => $p->provider   ?? '—',
            'type'        => $p->type       ?? 'payment',
            'status'      => $p->status,
            'user_id'     => $p->user_id,
            'user_name'   => $p->user?->name  ?? '—',
            'user_email'  => $p->user?->email ?? '',
            'plan_name'   => $p->subscription?->plan?->name  ?? '—',
            'plan_slug'   => $p->subscription?->plan?->slug  ?? '',
            'created_at'  => $p->created_at->format('M d, Y'),
        ];
 
        if ($detail) {
            $base += [
                'notes'           => $p->notes          ?? '',
                'subscription_id' => $p->subscription_id ?? null,
                'created_at_full' => $p->created_at->format('M d, Y · H:i'),
                'updated_at'      => $p->updated_at?->format('M d, Y · H:i'),
                'metadata'        => $p->metadata        ?? [],
            ];
        }
 
        return $base;
    }
}
