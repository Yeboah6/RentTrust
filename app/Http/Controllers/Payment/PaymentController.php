<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Http\Requests\InitializePaymentRequest;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\Plan;
use App\Services\Payment\PaymentService;
use App\Services\Payment\GatewayResolver;
use App\Services\Analytics\PaymentAnalytics;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    protected $paymentService;
    protected $gatewayResolver;
    protected $analytics;

    public function __construct(
        PaymentService $paymentService,
        GatewayResolver $gatewayResolver,
        PaymentAnalytics $analytics
    ) {
        $this->paymentService = $paymentService;
        $this->gatewayResolver = $gatewayResolver;
        $this->analytics = $analytics;
    }

    /**
     * Show checkout page
     */
    public function checkout(Request $request)
    {
        $type = $request->query('type');
        $id = $request->query('id');

        // Get product details
        $product = $this->getProductDetails($type, $id);

        if (!$product) {
            return redirect()->route('dashboard')
                ->with('error', 'Invalid product selected');
        }

        return inertia('Payment/Checkout', [
            'orderType' => $type,
            'productId' => $id,
            'product' => $product,
            'providers' => [
                'primary' => $this->gatewayResolver->getPrimaryProvider(),
                'available' => $this->gatewayResolver->getAvailableProviders()
            ]
        ]);
    }

    /**
     * Initialize payment
     */
    public function initialize(InitializePaymentRequest $request)
    {
        $user = $request->user();
        $validated = $request->validated();

        // Map payable type to model
        $payableType = $this->mapPayableType($validated['payable_type']);

        // Get the payable model to verify it exists and belongs to user
        $payable = $payableType::where('id', $validated['payable_id'])
            ->where('user_id', $user->id)
            ->first();

        if (!$payable) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid payable item'
            ], 404);
        }

        // Initialize payment
        $result = $this->paymentService->initialize([
            'user_id' => $user->id,
            'email' => $user->email,
            'fullname' => $user->name,
            'payable_type' => $payableType,
            'payable_id' => $payable->id,
            'provider' => $validated['provider'] ?? $this->gatewayResolver->getPrimaryProvider(),
            'payment_method' => $validated['payment_method'],
            'phone' => $validated['phone_number'],
            'amount' => $validated['amount'],
            'currency' => 'GHS',
            'plan_id' => $validated['plan_id'] ?? null,
            'description' => $validated['description'] ?? null
        ]);

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message']
            ], 422);
        }

        // Return payment details for frontend
        return response()->json([
            'success' => true,
            'payment' => [
                'id' => $result['payment']->id,
                'reference' => $result['payment']->reference,
                'provider_reference' => $result['provider_reference'],
                'amount' => $result['payment']->amount,
                'phone_number' => $result['payment']->phone_number,
                'expires_at' => $result['payment']->expires_at
            ],
            'message' => 'Payment initialized. Please check your phone for the payment prompt.'
        ]);
    }

    /**
     * Verify payment status
     */
    public function verify(Request $request, $reference)
    {
        $payment = Payment::where('reference', $reference)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$payment) {
            return response()->json([
                'success' => false,
                'message' => 'Payment not found'
            ], 404);
        }

        // Check if payment is expired
        if ($payment->isExpired() && $payment->status === 'pending') {
            return response()->json([
                'success' => false,
                'status' => 'expired',
                'message' => 'Payment session expired. Please try again.'
            ]);
        }

        // If already successful, return success
        if ($payment->status === 'success') {
            return response()->json([
                'success' => true,
                'status' => 'success',
                'payment' => $payment
            ]);
        }

        // Verify with provider
        $result = $this->paymentService->verify($reference);

        return response()->json([
            'success' => $result['success'],
            'status' => $result['payment']->status ?? 'failed',
            'payment' => $result['payment'] ?? null,
            'message' => $result['message'] ?? null
        ]);
    }

    /**
     * Get payment status for polling
     */
    public function status(Request $request, $reference)
    {
        $payment = Payment::where('reference', $reference)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$payment) {
            return response()->json([
                'success' => false,
                'message' => 'Payment not found'
            ], 404);
        }

        // Check expiration
        if ($payment->isExpired() && $payment->status === 'pending') {
            return response()->json([
                'status' => 'expired',
                'message' => 'Payment session expired'
            ]);
        }

        return response()->json([
            'status' => $payment->status,
            'paid_at' => $payment->paid_at,
            'transaction_id' => $payment->transaction_id
        ]);
    }

    /**
     * Validate phone number
     */
    public function validatePhone(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'provider' => 'required|string|in:mtn,vodafone,airteltigo'
        ]);

        $gateway = $this->gatewayResolver->resolve('paystack'); // Use either gateway
        $result = $gateway->validatePhoneNumber($request->phone, $request->provider);

        return response()->json($result);
    }

    /**
     * Get payment metrics (admin only)
     */
    public function metrics(Request $request)
    {
        $this->authorize('view-payment-metrics');

        $period = $request->get('period', 'today');
        $metrics = $this->analytics->getMetrics($period);

        return response()->json($metrics);
    }

    /**
     * Map payable type string to model class
     */
    protected function mapPayableType(string $type): string
    {
        return match($type) {
            'subscription' => 'App\\Models\\Subscription',
            'listing_boost' => 'App\\Models\\ListingBoost',
            'lead_credit' => 'App\\Models\\LeadCredit',
            default => throw new \InvalidArgumentException('Invalid payable type')
        };
    }

    /**
     * Get product details for checkout
     */
    // protected function getProductDetails(string $type, $id)
    // {
    //     return match($type) {
    //         'subscription' => Plan::find($id),
    //         'listing_boost' => ListingBoost::find($id),
    //         'lead_credit' => LeadCreditPackage::find($id),
    //         default => null
    //     };
    // }
}