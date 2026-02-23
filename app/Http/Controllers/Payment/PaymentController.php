<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Http\Requests\InitializePaymentRequest;
use App\Models\Payment;
use App\Models\Subscription;
use App\Services\Payment\PaymentService;
use App\Services\Payment\GatewayResolver;
use App\Services\Analytics\PaymentAnalytics;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class PaymentController extends Controller
{
    use AuthorizesRequests;

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
        
        // For MVP, just return plan details from config or hardcoded values
        $plans = [
            'basic' => [
                'type' => 'subscription',
                'productName' => 'Basic Plan',
                'description' => 'Perfect for individual landlords',
                'price' => 49.00,
                'features' => [
                    'List up to 3 properties',
                    'Basic analytics',
                    'Email support'
                ],
                'property_limit' => 3,
                'isRecurring' => true,
                'billingCycle' => 'monthly'
            ],
            'professional' => [
                'type' => 'subscription',
                'productName' => 'Professional Plan',
                'description' => 'For serious property managers',
                'price' => 99.00,
                'features' => [
                    'List up to 10 properties',
                    'Advanced analytics',
                    'Priority support',
                    'Verified badge'
                ],
                'property_limit' => 10,
                'isRecurring' => true,
                'billingCycle' => 'monthly'
            ],
            'business' => [
                'type' => 'subscription',
                'productName' => 'Business Plan',
                'description' => 'For agencies and teams',
                'price' => 199.00,
                'features' => [
                    'Unlimited properties',
                    'Team accounts',
                    'API access',
                    '24/7 phone support'
                ],
                'property_limit' => -1, // -1 means unlimited
                'isRecurring' => true,
                'billingCycle' => 'monthly'
            ]
        ];

        $selectedPlan = $plans[$type] ?? null;

        if (!$selectedPlan) {
            return redirect()->route('dashboard')
                ->with('error', 'Invalid plan selected');
        }

        return inertia('Payment/Checkout', [
            'orderType' => 'subscription',
            'plan' => $type,
            'product' => $selectedPlan,
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

    try {
        // Handle different payable types
        if ($validated['payable_type'] === 'subscription') {
            // Get plan details from request or config
            $planName = $validated['plan_name'] ?? 'Basic';
            $planPrice = $validated['amount'];
            $propertyLimit = $this->getPropertyLimit($planName);
            
            // Create pending subscription - WITH PLAN_TYPE
            $subscription = Subscription::create([
                'user_id' => $user->id,
                'plan_type' => strtolower($planName), // CRITICAL: This was missing!
                'plan_name' => $planName,
                'price' => $planPrice,
                'billing_cycle' => $validated['billing_cycle'] ?? 'monthly',
                'property_limit' => $propertyLimit,
                'features' => json_encode($this->getPlanFeatures($planName)), // Encode as JSON
                'status' => 'pending'
            ]);

            $payableType = 'App\\Models\\Subscription';
            $payableId = $subscription->id;
            $description = "Subscription to {$planName} Plan";
            
        } else {
            // Handle other types (boosts, leads) if needed
            return response()->json([
                'success' => false,
                'message' => 'Unsupported payable type'
            ], 422);
        }

            // Initialize payment
            $result = $this->paymentService->initialize([
                'user_id' => $user->id,
                'email' => $user->email,
                'fullname' => $user->name,
                'payable_type' => $payableType,
                'payable_id' => $payableId,
                'provider' => $validated['provider'] ?? $this->gatewayResolver->getPrimaryProvider(),
                'payment_method' => $validated['payment_method'],
                'phone' => $validated['phone_number'],
                'amount' => $validated['amount'],
                'currency' => 'GHS',
                'description' => $description
            ]);

            if (!$result['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $result['message']
                ], 422);
            }

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

        } catch (\Exception $e) {
        Log::error('Payment initialization failed', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(), // Add trace for debugging
            'user_id' => $user->id,
            'data' => $validated
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Failed to initialize payment: ' . $e->getMessage()
        ], 500);
    }
    }

    /**
     * Get property limit based on plan name
     */
    protected function getPropertyLimit(string $planName): int
    {
        return match(strtolower($planName)) {
            'basic' => 3,
            'professional' => 10,
            'business' => -1, // unlimited
            default => 3
        };
    }

    /**
     * Get plan features
     */
    protected function getPlanFeatures(string $planName): array
    {
        return match(strtolower($planName)) {
            'basic' => ['List up to 3 properties', 'Basic analytics', 'Email support'],
            'professional' => ['List up to 10 properties', 'Advanced analytics', 'Priority support', 'Verified badge'],
            'business' => ['Unlimited properties', 'Team accounts', 'API access', '24/7 phone support'],
            default => ['List properties', 'Basic support']
        };
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

        if ($payment->isExpired() && $payment->status === 'pending') {
            return response()->json([
                'success' => false,
                'status' => 'expired',
                'message' => 'Payment session expired. Please try again.'
            ]);
        }

        if ($payment->status === 'success') {
            return response()->json([
                'success' => true,
                'status' => 'success',
                'payment' => $payment
            ]);
        }

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

        $gateway = $this->gatewayResolver->resolve('paystack');
        $result = $gateway->validatePhoneNumber($request->phone, $request->provider);

        return response()->json($result);
    }
}