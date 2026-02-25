import { useState, useEffect } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import Header from "../Components/Layouts/Header";
import Footer from "../Components/Layouts/Footer";

// ─── Icons ───────────────────────────────────────────────────────────────────

const CheckCircle2 = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircle = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Loader = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }} />
    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" style={{ opacity: 0.75 }} />
  </svg>
);

const ArrowRight = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const Lock = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const Shield = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

// ─── Provider Badge ───────────────────────────────────────────────────────────

const ProviderBadge = ({ provider }) => {
  const config = provider === "paystack"
    ? { bg: "hsl(220 80% 96%)", border: "hsl(220 80% 88%)", dot: "hsl(220 80% 52%)", text: "hsl(220 80% 40%)", label: "Powered by Paystack" }
    : { bg: "hsl(28 100% 96%)",  border: "hsl(28 100% 85%)",  dot: "hsl(28 100% 52%)",  text: "hsl(28 100% 35%)",  label: "Powered by Flutterwave" };

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.2rem 0.6rem", borderRadius: "999px", backgroundColor: config.bg, border: `1px solid ${config.border}` }}>
      <div style={{ width: "0.5rem", height: "0.5rem", borderRadius: "50%", backgroundColor: config.dot }} />
      <span style={{ fontSize: "0.7rem", fontWeight: "600", color: config.text, letterSpacing: "0.03em" }}>{config.label}</span>
    </div>
  );
};

// ─── Order Summary ────────────────────────────────────────────────────────────
/**
 * Receives `plan` from CheckoutController::show() which includes:
 *   id, name, slug, price, features[], description,
 *   listing_limit, boost_limit, lead_limit,
 *   verified_badge, priority_ranking, analytics_access
 */
const OrderSummary = ({ plan, provider }) => {
  const planColor = {
    free:     "hsl(200 15% 45%)",
    verified: "hsl(174 62% 32%)",
    pro:      "hsl(38 92% 45%)",
  }[plan.slug] ?? "hsl(174 62% 32%)";

  // Use the pre-built features list from the controller — matches PricingModal exactly
  const features = plan.features ?? [];

  return (
    <div className="overflow-hidden border rounded-xl bg-white" style={{ borderColor: "hsl(40 20% 88%)", boxShadow: "0 2px 8px -2px hsl(200 25% 15% / 0.1), 0 1px 3px -1px hsl(200 25% 15% / 0.06)" }}>
      <div style={{ padding: "clamp(1.5rem, 4vw, 2rem)" }}>

        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "clamp(1.25rem, 3vw, 1.75rem)" }}>
          <h2 className="font-bold tracking-tight" style={{ color: "hsl(200 25% 15%)", fontSize: "clamp(1.25rem, 3vw, 1.5rem)", lineHeight: "1.2", margin: 0 }}>
            Order Summary
          </h2>
          <ProviderBadge provider={provider} />
        </div>

        {/* Plan details card */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", padding: "clamp(1rem, 3vw, 1.25rem)", backgroundColor: "hsl(40 33% 98%)", borderRadius: "0.75rem", marginBottom: "clamp(1.25rem, 3vw, 1.75rem)" }}>
          {/* Plan icon */}
          <div style={{ width: "clamp(2.5rem, 8vw, 3rem)", height: "clamp(2.5rem, 8vw, 3rem)", borderRadius: "0.75rem", backgroundColor: `${planColor}18`, color: planColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Shield style={{ height: "1.5rem", width: "1.5rem" }} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 className="font-semibold" style={{ color: "hsl(200 25% 15%)", fontSize: "clamp(0.9375rem, 2.5vw, 1.0625rem)", marginBottom: "0.2rem", lineHeight: "1.3" }}>
              RentTrust {plan.name} Plan
            </h3>
            <p style={{ color: "hsl(200 15% 45%)", fontSize: "clamp(0.8125rem, 2vw, 0.875rem)", lineHeight: "1.5", marginBottom: "0.75rem" }}>
              {plan.description} · Monthly subscription · Renews automatically
            </p>

            {/* Features — sourced from controller, same as PricingModal */}
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.5rem" }}>
              {features.map((f, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "clamp(0.75rem, 1.8vw, 0.8125rem)", color: "hsl(200 15% 45%)", lineHeight: "1.4" }}>
                  <CheckCircle2 style={{ height: "0.875rem", width: "0.875rem", color: "hsl(152 60% 40%)", flexShrink: 0, marginTop: "0.125rem" }} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Price breakdown */}
        <div style={{ display: "grid", gap: "0.65rem", paddingBottom: "1rem", marginBottom: "1rem", borderBottom: "1px solid hsl(40 20% 88%)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "hsl(200 15% 45%)", fontSize: "clamp(0.875rem, 2vw, 0.9375rem)" }}>Subtotal</span>
            <span className="font-semibold" style={{ color: "hsl(200 25% 15%)", fontSize: "clamp(0.875rem, 2vw, 0.9375rem)" }}>
              GHS {plan.price.toFixed(2)}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "hsl(200 15% 45%)", fontSize: "clamp(0.875rem, 2vw, 0.9375rem)" }}>Tax</span>
            <span className="font-semibold" style={{ color: "hsl(200 25% 15%)", fontSize: "clamp(0.875rem, 2vw, 0.9375rem)" }}>GHS 0.00</span>
          </div>
        </div>

        {/* Total */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "clamp(1rem, 3vw, 1.25rem)", backgroundColor: `${planColor}0d`, borderRadius: "0.75rem" }}>
          <span className="font-bold" style={{ color: "hsl(200 25% 15%)", fontSize: "clamp(1rem, 2.5vw, 1.125rem)" }}>Total</span>
          <span className="font-bold tracking-tight" style={{ color: planColor, fontSize: "clamp(1.5rem, 4vw, 1.75rem)", lineHeight: "1" }}>
            GHS {plan.price.toFixed(2)}
          </span>
        </div>

        {/* Recurring note */}
        <div style={{ marginTop: "1rem", padding: "0.75rem", backgroundColor: "hsl(220 60% 50% / 0.05)", border: "1px solid hsl(220 60% 50% / 0.2)", borderRadius: "0.5rem" }}>
          <p style={{ color: "hsl(200 15% 45%)", fontSize: "clamp(0.75rem, 1.8vw, 0.8125rem)", lineHeight: "1.5", margin: 0, display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
            <span style={{ flexShrink: 0 }}>ℹ️</span>
            <span>This is a recurring payment. You will be charged GHS {plan.price.toFixed(2)} monthly until you cancel. Cancel anytime from your dashboard.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── Payment Gateway Selector ─────────────────────────────────────────────────

const PaymentProviderSelector = ({ selectedProvider, onProviderChange }) => {
  const providers = [
    {
      id: "paystack",
      name: "Paystack",
      subtitle: "Card · MTN MoMo · Vodafone Cash · AirtelTigo",
      color: "hsl(220 80% 52%)",
      bg: "hsl(220 80% 96%)",
      logo: <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.5rem", backgroundColor: "hsl(220 80% 52%)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "white", fontWeight: "900", fontSize: "0.7rem" }}>PS</span></div>
    },
    {
      id: "flutterwave",
      name: "Flutterwave",
      subtitle: "Card · Mobile Money · Bank Transfer",
      color: "hsl(28 100% 52%)",
      bg: "hsl(28 100% 96%)",
      logo: <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.5rem", backgroundColor: "hsl(28 100% 52%)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "white", fontWeight: "900", fontSize: "0.7rem" }}>FW</span></div>
    },
  ];

  return (
    <div className="overflow-hidden border rounded-xl bg-white" style={{ borderColor: "hsl(40 20% 88%)", boxShadow: "0 2px 8px -2px hsl(200 25% 15% / 0.1), 0 1px 3px -1px hsl(200 25% 15% / 0.06)" }}>
      <div style={{ padding: "clamp(1.5rem, 4vw, 2rem)" }}>
        <h2 className="font-bold tracking-tight" style={{ color: "hsl(200 25% 15%)", fontSize: "clamp(1.25rem, 3vw, 1.5rem)", marginBottom: "clamp(1.25rem, 3vw, 1.75rem)", lineHeight: "1.2" }}>
          Payment Gateway
        </h2>

        <div style={{ display: "grid", gap: "0.75rem", marginBottom: "1.5rem" }}>
          {providers.map((p) => (
            <label
              key={p.id}
              style={{ display: "flex", alignItems: "center", padding: "clamp(1rem, 3vw, 1.25rem)", border: selectedProvider === p.id ? `2px solid ${p.color}` : "1px solid hsl(40 20% 88%)", borderRadius: "0.75rem", backgroundColor: selectedProvider === p.id ? p.bg : "white", cursor: "pointer", transition: "all 0.2s ease", gap: "1rem" }}
            >
              <input type="radio" name="payment_provider" value={p.id} checked={selectedProvider === p.id} onChange={() => onProviderChange(p.id)}
                style={{ width: "1.25rem", height: "1.25rem", accentColor: p.color, cursor: "pointer", flexShrink: 0 }} />
              {p.logo}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p className="font-semibold" style={{ color: "hsl(200 25% 15%)", fontSize: "clamp(0.9375rem, 2.5vw, 1rem)", marginBottom: "0.125rem" }}>{p.name}</p>
                <p style={{ color: "hsl(200 15% 45%)", fontSize: "clamp(0.8125rem, 2vw, 0.875rem)", margin: 0 }}>{p.subtitle}</p>
              </div>
              {selectedProvider === p.id && <CheckCircle2 style={{ height: "1.25rem", width: "1.25rem", color: p.color, flexShrink: 0 }} />}
            </label>
          ))}
        </div>

        <div style={{ padding: "1rem", backgroundColor: "hsl(40 33% 98%)", borderRadius: "0.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Lock style={{ height: "1.25rem", width: "1.25rem", color: "hsl(200 15% 45%)", flexShrink: 0 }} />
          <p style={{ color: "hsl(200 15% 45%)", fontSize: "clamp(0.75rem, 1.8vw, 0.8125rem)", lineHeight: "1.5", margin: 0 }}>
            You will be redirected to {selectedProvider === "paystack" ? "Paystack" : "Flutterwave"} to complete payment securely. Your card or MoMo details are never stored on RentTrust.
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── States ───────────────────────────────────────────────────────────────────

const LoadingState = () => (
  <div style={{ textAlign: "center", padding: "clamp(3rem, 8vw, 5rem) clamp(1rem, 3vw, 2rem)" }}>
    <div style={{ width: "clamp(4rem, 12vw, 5rem)", height: "clamp(4rem, 12vw, 5rem)", margin: "0 auto 2rem", color: "hsl(174 62% 32%)" }}>
      <Loader style={{ width: "100%", height: "100%", animation: "spin 1s linear infinite" }} />
    </div>
    <h3 className="font-bold" style={{ color: "hsl(200 25% 15%)", fontSize: "clamp(1.25rem, 3vw, 1.5rem)", marginBottom: "0.75rem" }}>Redirecting to Payment...</h3>
    <p style={{ color: "hsl(200 15% 45%)", fontSize: "clamp(0.9375rem, 2.5vw, 1rem)", maxWidth: "400px", margin: "0 auto" }}>Please wait while we prepare your secure payment session.</p>
    <p style={{ color: "hsl(38 92% 50%)", fontSize: "0.875rem", marginTop: "1rem", fontWeight: "500" }}>Do not close or refresh this page</p>
  </div>
);

const SuccessState = ({ plan }) => (
  <div style={{ textAlign: "center", padding: "clamp(3rem, 8vw, 5rem) clamp(1rem, 3vw, 2rem)" }}>
    <div style={{ width: "clamp(4rem, 12vw, 5rem)", height: "clamp(4rem, 12vw, 5rem)", borderRadius: "50%", background: "hsl(152 60% 40% / 0.1)", color: "hsl(152 60% 40%)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem" }}>
      <CheckCircle2 style={{ height: "2.5rem", width: "2.5rem" }} />
    </div>
    <h3 className="font-bold" style={{ color: "hsl(200 25% 15%)", fontSize: "clamp(1.5rem, 4vw, 2rem)", marginBottom: "0.75rem" }}>Payment Successful!</h3>
    <p style={{ color: "hsl(200 15% 45%)", fontSize: "clamp(0.9375rem, 2.5vw, 1.0625rem)", lineHeight: "1.6", maxWidth: "500px", margin: "0 auto 2rem" }}>
      Your RentTrust {plan?.name} subscription is now active. Enjoy all your new features!
    </p>
    <Link href="/agent-dashboard" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "clamp(0.75rem, 2.5vw, 1rem) clamp(1.5rem, 4vw, 2rem)", backgroundColor: "hsl(174 62% 32%)", color: "white", borderRadius: "0.5rem", fontWeight: "600", textDecoration: "none", fontSize: "clamp(0.9375rem, 2vw, 1rem)" }}>
      Go to Dashboard <ArrowRight style={{ height: "1rem", width: "1rem" }} />
    </Link>
    <p style={{ color: "hsl(200 15% 45%)", fontSize: "0.8125rem", marginTop: "2rem" }}>A confirmation email has been sent to your registered email address.</p>
  </div>
);

const FailureState = ({ error, onRetry, onCancel }) => (
  <div style={{ textAlign: "center", padding: "clamp(3rem, 8vw, 5rem) clamp(1rem, 3vw, 2rem)" }}>
    <div style={{ width: "clamp(4rem, 12vw, 5rem)", height: "clamp(4rem, 12vw, 5rem)", borderRadius: "50%", background: "hsl(0 65% 51% / 0.1)", color: "hsl(0 65% 51%)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem" }}>
      <XCircle style={{ height: "2.5rem", width: "2.5rem" }} />
    </div>
    <h3 className="font-bold" style={{ color: "hsl(200 25% 15%)", fontSize: "clamp(1.5rem, 4vw, 2rem)", marginBottom: "0.75rem" }}>Payment Failed</h3>
    <p style={{ color: "hsl(200 15% 45%)", fontSize: "clamp(0.9375rem, 2.5vw, 1.0625rem)", maxWidth: "500px", margin: "0 auto 1rem", lineHeight: "1.6" }}>
      We couldn't start your payment session. Please try again or choose a different gateway.
    </p>
    {error && (
      <div style={{ display: "inline-block", padding: "1rem 1.5rem", backgroundColor: "hsl(0 65% 51% / 0.05)", border: "1px solid hsl(0 65% 51% / 0.2)", borderRadius: "0.75rem", marginBottom: "2rem", maxWidth: "500px" }}>
        <p style={{ color: "hsl(0 65% 51%)", fontSize: "0.9375rem", margin: 0, fontWeight: "500" }}>{error}</p>
      </div>
    )}
    <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
      <button onClick={onRetry} style={{ display: "inline-flex", alignItems: "center", padding: "clamp(0.75rem, 2.5vw, 1rem) clamp(1.5rem, 4vw, 2rem)", backgroundColor: "hsl(174 62% 32%)", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600", fontSize: "clamp(0.9375rem, 2vw, 1rem)" }}>Try Again</button>
      <button onClick={onCancel} style={{ display: "inline-flex", alignItems: "center", padding: "clamp(0.75rem, 2.5vw, 1rem) clamp(1.5rem, 4vw, 2rem)", backgroundColor: "white", color: "hsl(200 25% 15%)", border: "1px solid hsl(40 20% 88%)", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600", fontSize: "clamp(0.9375rem, 2vw, 1rem)" }}>Cancel</button>
    </div>
    <p style={{ color: "hsl(200 15% 45%)", fontSize: "0.8125rem", marginTop: "2rem" }}>
      Need help? <Link href="/contact" style={{ color: "hsl(174 62% 32%)", fontWeight: "500", textDecoration: "none" }}>Contact Support</Link>
    </p>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
/**
 * Props from CheckoutController::show():
 *   plan: {
 *     id, name, slug, price, description,
 *     features[],                ← pre-built, matches PricingModal
 *     listing_limit, listing_limit_display,
 *     boost_limit, lead_limit,
 *     verified_badge, priority_ranking, analytics_access
 *   }
 *
 * Reached via:
 *   router.visit('/checkout/plan=' + encodeURIComponent(pkg))   ← PricingModal
 *   router.visit('/checkout/' + plan.id)                        ← any other caller
 */
const CheckoutPage = ({ plan }) => {
  const { flash, auth, subscription } = usePage().props;

  // Redirect to login if not authenticated (belt-and-suspenders — middleware should catch this)
  const currentUser = auth?.agent ?? auth?.super ?? auth?.tenant;

  const [paymentState, setPaymentState] = useState("form");
  const [selectedProvider, setSelectedProvider] = useState("paystack");
  const [error, setError] = useState(null);

  // Handle flash from callback redirect
  useEffect(() => {
    if (flash?.success) setPaymentState("success");
    if (flash?.error) { setError(flash.error); setPaymentState("failure"); }
  }, [flash]);

  const handlePayment = () => {
    setPaymentState("loading");
    setError(null);

    router.post(
      "/checkout/start",
      { plan_id: plan.id, provider: selectedProvider },
      {
        onError: (errors) => {
          setError(
            errors?.message ||
            (typeof errors === "object" ? Object.values(errors)[0] : null) ||
            "Payment initialization failed. Please try again."
          );
          setPaymentState("failure");
        },
        // For paid plans: controller calls Inertia::location() → full browser redirect to gateway.
        // onSuccess only fires for free plans (redirect to dashboard).
        onSuccess: () => {},
      }
    );
  };

  if (!plan) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LoadingState />
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
        h1,h2,h3,h4,h5,h6 { font-weight: 600; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) { button { -webkit-tap-highlight-color: transparent; min-height: 44px; } }
        @media print { header, footer { display: none !important; } }
      `}</style>

      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "hsl(40 33% 98%)" }}>
        <Header />

        <main style={{ flex: 1 }}>
          {/* Page header — only shown on form state */}
          {paymentState === "form" && (
            <div style={{ backgroundColor: "hsl(0 0% 100%)", borderBottom: "1px solid hsl(40 20% 88%)", padding: "clamp(1.5rem, 4vw, 2rem) 0" }}>
              <div style={{ maxWidth: "1000px", margin: "0 auto", paddingLeft: "clamp(0.75rem, 3vw, 1rem)", paddingRight: "clamp(0.75rem, 3vw, 1rem)" }}>
                <h1 style={{ color: "hsl(200 25% 15%)", fontSize: "clamp(1.5rem, 5vw, 2rem)", fontWeight: "700", marginBottom: "clamp(0.5rem, 2vw, 0.75rem)", lineHeight: "1.2" }}>
                  Checkout
                </h1>
                <p style={{ color: "hsl(200 15% 45%)", fontSize: "clamp(0.875rem, 2.5vw, 1rem)", margin: 0 }}>
                  Subscribe to the{" "}
                  <strong style={{ color: "hsl(174 62% 32%)" }}>RentTrust {plan.name} Plan</strong>
                  {" "}— GHS {plan.price.toFixed(2)}/month
                </p>
              </div>
            </div>
          )}

          {/* Content */}
          <div style={{ maxWidth: "1000px", margin: "0 auto", paddingLeft: "clamp(0.75rem, 3vw, 1rem)", paddingRight: "clamp(0.75rem, 3vw, 1rem)", paddingTop: paymentState === "form" ? "clamp(2rem, 5vw, 3rem)" : 0, paddingBottom: "clamp(2rem, 5vw, 3rem)" }}>

            {paymentState === "loading" && <LoadingState />}
            {paymentState === "success" && <SuccessState plan={plan} />}
            {paymentState === "failure" && (
              <FailureState
                error={error}
                onRetry={() => { setPaymentState("form"); setError(null); }}
                onCancel={() => router.visit("/pricing")}
              />
            )}

            {paymentState === "form" && (
              <div style={{ display: "grid", gap: "clamp(1.5rem, 4vw, 2rem)", maxWidth: "900px", margin: "0 auto" }}>

                {/* 1. Order Summary — receives full plan from controller */}
                <OrderSummary plan={plan} provider={selectedProvider} />

                {/* 2. Gateway selector */}
                <PaymentProviderSelector
                  selectedProvider={selectedProvider}
                  onProviderChange={setSelectedProvider}
                />

                {/* 3. Confirm button */}
                <div className="overflow-hidden border rounded-xl bg-white" style={{ borderColor: "hsl(40 20% 88%)", boxShadow: "0 2px 8px -2px hsl(200 25% 15% / 0.1), 0 1px 3px -1px hsl(200 25% 15% / 0.06)" }}>
                  <div style={{ padding: "clamp(1.5rem, 4vw, 2rem)" }}>
                    <button
                      onClick={handlePayment}
                      className="font-bold rounded-lg transition-all duration-200 active:scale-95"
                      style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", padding: "clamp(1rem, 3vw, 1.25rem)", fontSize: "clamp(1rem, 2.5vw, 1.125rem)", backgroundColor: "hsl(174 62% 32%)", color: "white", border: "none", cursor: "pointer" }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = "hsl(174 55% 28%)"}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = "hsl(174 62% 32%)"}
                    >
                      <Shield style={{ height: "1.25rem", width: "1.25rem" }} />
                      Pay GHS {plan.price.toFixed(2)}/month via {selectedProvider === "paystack" ? "Paystack" : "Flutterwave"}
                    </button>

                    <p style={{ color: "hsl(200 15% 45%)", fontSize: "clamp(0.75rem, 1.8vw, 0.8125rem)", textAlign: "center", marginTop: "1rem", lineHeight: "1.5" }}>
                      By confirming, you agree to our{" "}
                      <Link href="/terms" style={{ color: "hsl(174 62% 32%)", textDecoration: "none", fontWeight: "500" }}>Terms of Service</Link>
                      {" "}and{" "}
                      <Link href="/privacy" style={{ color: "hsl(174 62% 32%)", textDecoration: "none", fontWeight: "500" }}>Privacy Policy</Link>.
                      {" "}Subscriptions renew monthly — cancel anytime.
                    </p>
                  </div>
                </div>

                {/* Back to pricing */}
                <div style={{ textAlign: "center" }}>
                  <Link href="/pricing" style={{ color: "hsl(200 15% 45%)", fontSize: "0.875rem", textDecoration: "none", fontWeight: "500" }}>
                    ← Change plan
                  </Link>
                </div>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default CheckoutPage;