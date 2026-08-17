import { useState, useEffect } from "react";
import { Link, usePage, router, Head } from "@inertiajs/react";
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

const ChevronDown = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

// ─── Shared card shell ─────────────────────────────────────────────────────

const Card = ({ children, style }) => (
  <div
    className="checkout-card"
    style={{
      overflow: "hidden",
      border: "1px solid hsl(40 20% 88%)",
      borderRadius: "0.875rem",
      backgroundColor: "white",
      boxShadow: "0 2px 8px -2px hsl(200 25% 15% / 0.1), 0 1px 3px -1px hsl(200 25% 15% / 0.06)",
      ...style,
    }}
  >
    <div style={{ padding: "clamp(1.125rem, 3.5vw, 2rem)" }}>{children}</div>
  </div>
);

// ─── Provider Badge ───────────────────────────────────────────────────────────

const ProviderBadge = ({ provider }) => {
  const config = provider === "paystack"
    ? { bg: "hsl(220 80% 96%)", border: "hsl(220 80% 88%)", dot: "hsl(220 80% 52%)", text: "hsl(220 80% 40%)", label: "Powered by Paystack" }
    : { bg: "hsl(28 100% 96%)",  border: "hsl(28 100% 85%)",  dot: "hsl(28 100% 52%)",  text: "hsl(28 100% 35%)",  label: "Powered by Flutterwave" };

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.2rem 0.6rem", borderRadius: "999px", backgroundColor: config.bg, border: `1px solid ${config.border}`, whiteSpace: "nowrap" }}>
      <div style={{ width: "0.5rem", height: "0.5rem", borderRadius: "50%", backgroundColor: config.dot, flexShrink: 0 }} />
      <span style={{ fontSize: "0.7rem", fontWeight: "600", color: config.text, letterSpacing: "0.03em" }}>{config.label}</span>
    </div>
  );
};

// ─── Order Summary (mobile: collapsible; desktop: always open) ───────────────

const OrderSummary = ({ plan, provider }) => {
  const [expanded, setExpanded] = useState(false);

  const planColor = {
    free:     "hsl(200 15% 45%)",
    verified: "hsl(174 62% 32%)",
    pro:      "hsl(38 92% 45%)",
  }[plan.slug] ?? "hsl(174 62% 32%)";

  const features = plan.features ?? [];

  return (
    <Card>
      {/* Header row — the toggle only does anything on mobile via CSS */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="order-summary-toggle checkout-header-row"
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%", background: "none", border: "none", padding: 0, cursor: "default",
          marginBottom: "clamp(1.125rem, 3vw, 1.75rem)", textAlign: "left",
        }}
      >
        <h2 className="font-bold tracking-tight" style={{ color: "hsl(200 25% 15%)", fontSize: "clamp(1.125rem, 3vw, 1.5rem)", lineHeight: "1.2", margin: 0 }}>
          Order Summary
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <ProviderBadge provider={provider} />
          <span
            className="order-summary-price-pill"
            style={{ display: "none", fontWeight: 700, color: planColor, fontSize: "0.9375rem", whiteSpace: "nowrap" }}
          >
            GHS {plan.price.toFixed(2)}
          </span>
          <ChevronDown
            className="order-summary-chevron"
            style={{ height: "1.125rem", width: "1.125rem", color: "hsl(200 15% 45%)", flexShrink: 0, transition: "transform 0.2s ease", transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </div>
      </button>

      <div className={`order-summary-body ${expanded ? "is-expanded" : ""}`}>
        {/* Plan details card */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem", padding: "clamp(0.875rem, 3vw, 1.25rem)", backgroundColor: "hsl(40 33% 98%)", borderRadius: "0.75rem", marginBottom: "clamp(1.125rem, 3vw, 1.75rem)" }}>
          <div style={{ width: "clamp(2.25rem, 7vw, 3rem)", height: "clamp(2.25rem, 7vw, 3rem)", borderRadius: "0.75rem", backgroundColor: `${planColor}18`, color: planColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Shield style={{ height: "1.375rem", width: "1.375rem" }} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 className="font-semibold" style={{ color: "hsl(200 25% 15%)", fontSize: "clamp(0.9375rem, 2.5vw, 1.0625rem)", marginBottom: "0.2rem", lineHeight: "1.3", wordBreak: "break-word" }}>
              RentTrustGh {plan.name} Plan
            </h3>
            <p style={{ color: "hsl(200 15% 45%)", fontSize: "clamp(0.8125rem, 2vw, 0.875rem)", lineHeight: "1.5", marginBottom: "0.75rem" }}>
              {plan.description} · Monthly subscription · Renews automatically
            </p>

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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ color: "hsl(200 15% 45%)", fontSize: "clamp(0.875rem, 2vw, 0.9375rem)" }}>Subtotal</span>
            <span className="font-semibold" style={{ color: "hsl(200 25% 15%)", fontSize: "clamp(0.875rem, 2vw, 0.9375rem)" }}>
              GHS {plan.price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Total */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "clamp(0.875rem, 3vw, 1.25rem)", backgroundColor: `${planColor}0d`, borderRadius: "0.75rem", gap: "0.75rem", flexWrap: "wrap" }}>
          <span className="font-bold" style={{ color: "hsl(200 25% 15%)", fontSize: "clamp(0.9375rem, 2.5vw, 1.125rem)" }}>Total</span>
          <span className="font-bold tracking-tight" style={{ color: planColor, fontSize: "clamp(1.375rem, 4vw, 1.75rem)", lineHeight: "1" }}>
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
    </Card>
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
      logo: <div style={{ width: "2.25rem", height: "2.25rem", borderRadius: "0.5rem", backgroundColor: "hsl(220 80% 52%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ color: "white", fontWeight: "900", fontSize: "0.7rem" }}>PS</span></div>
    },
    // {
    //   id: "flutterwave",
    //   name: "Flutterwave",
    //   subtitle: "Card · Mobile Money · Bank Transfer",
    //   color: "hsl(28 100% 52%)",
    //   bg: "hsl(28 100% 96%)",
    //   logo: <div style={{ width: "2.25rem", height: "2.25rem", borderRadius: "0.5rem", backgroundColor: "hsl(28 100% 52%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ color: "white", fontWeight: "900", fontSize: "0.7rem" }}>FW</span></div>
    // },
  ];

  return (
    <Card>
      <h2 className="font-bold tracking-tight" style={{ color: "hsl(200 25% 15%)", fontSize: "clamp(1.125rem, 3vw, 1.5rem)", marginBottom: "clamp(1.125rem, 3vw, 1.75rem)", lineHeight: "1.2" }}>
        Payment Gateway
      </h2>

      <div style={{ display: "grid", gap: "0.75rem", marginBottom: "1.5rem" }}>
        {providers.map((p) => (
          <label
            key={p.id}
            className="provider-label"
            style={{ display: "flex", alignItems: "center", padding: "clamp(0.875rem, 3vw, 1.25rem)", border: selectedProvider === p.id ? `2px solid ${p.color}` : "1px solid hsl(40 20% 88%)", borderRadius: "0.75rem", backgroundColor: selectedProvider === p.id ? p.bg : "white", cursor: "pointer", transition: "all 0.2s ease", gap: "0.875rem", WebkitTapHighlightColor: "transparent" }}
          >
            <input type="radio" name="payment_provider" value={p.id} checked={selectedProvider === p.id} onChange={() => onProviderChange(p.id)}
              style={{ width: "1.25rem", height: "1.25rem", accentColor: p.color, cursor: "pointer", flexShrink: 0 }} />
            {p.logo}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="font-semibold" style={{ color: "hsl(200 25% 15%)", fontSize: "clamp(0.9375rem, 2.5vw, 1rem)", marginBottom: "0.125rem" }}>{p.name}</p>
              <p style={{ color: "hsl(200 15% 45%)", fontSize: "clamp(0.75rem, 1.8vw, 0.875rem)", margin: 0, lineHeight: "1.4" }}>{p.subtitle}</p>
            </div>
            {selectedProvider === p.id && <CheckCircle2 className="provider-check" style={{ height: "1.25rem", width: "1.25rem", color: p.color, flexShrink: 0 }} />}
          </label>
        ))}
      </div>

      <div style={{ padding: "1rem", backgroundColor: "hsl(40 33% 98%)", borderRadius: "0.5rem", display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
        <Lock style={{ height: "1.25rem", width: "1.25rem", color: "hsl(200 15% 45%)", flexShrink: 0, marginTop: "0.0625rem" }} />
        <p style={{ color: "hsl(200 15% 45%)", fontSize: "clamp(0.75rem, 1.8vw, 0.8125rem)", lineHeight: "1.5", margin: 0 }}>
          You will be redirected to {selectedProvider === "paystack" ? "Paystack" : "Flutterwave"} to complete payment securely. Your card or MoMo details are never stored on RentTrustGh.
        </p>
      </div>
    </Card>
  );
};

// ─── Plan selector for switching plans ────────────────────────────────────────

const PlansComparison = ({ plans, current, onSelect }) => {
  const filteredPlans = plans.filter((p) => !p.is_free);

  return (
    <Card>
      <h2 className="font-bold tracking-tight" style={{ color: "hsl(200 25% 15%)", fontSize: "clamp(1.125rem, 3vw, 1.5rem)", marginBottom: "clamp(1.125rem, 3vw, 1.75rem)", lineHeight: "1.2" }}>
        Select Your Plan
      </h2>

      <div className="plans-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.875rem" }}>
        {filteredPlans.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p)}
            className="plan-option"
            style={{
              padding: "clamp(1rem, 3vw, 1.5rem)",
              border: current.id === p.id ? "2px solid hsl(174 62% 32%)" : "1px solid hsl(40 20% 88%)",
              borderRadius: "0.75rem",
              backgroundColor: current.id === p.id ? "hsl(174 62% 32% / 0.05)" : "white",
              cursor: "pointer",
              transition: "border-color 0.2s ease",
              textAlign: "left",
              position: "relative",
              minWidth: 0,
            }}
          >
            {current.id === p.id && (
              <div style={{ position: "absolute", top: "0.75rem", right: "0.75rem" }}>
                <CheckCircle2 style={{ height: "1rem", width: "1rem", color: "hsl(174 62% 32%)" }} />
              </div>
            )}
            <h3 className="font-semibold" style={{ color: "hsl(200 25% 15%)", fontSize: "clamp(0.9375rem, 2.5vw, 1.0625rem)", marginBottom: "0.5rem", paddingRight: "1.5rem" }}>
              {p.name}
            </h3>
            <p style={{ color: "hsl(38 92% 50%)", fontSize: "clamp(1rem, 2.5vw, 1.25rem)", fontWeight: "700", margin: 0 }}>
              GHS {p.price.toFixed(2)}<span style={{ fontSize: "0.75rem", fontWeight: "400", color: "hsl(200 15% 45%)" }}>/month</span>
            </p>
            <p style={{ color: "hsl(200 15% 45%)", fontSize: "clamp(0.75rem, 1.8vw, 0.8125rem)", margin: "0.5rem 0 0", lineHeight: "1.4" }}>
              {p.description}
            </p>
          </button>
        ))}
      </div>
    </Card>
  );
};

// ─── Confirm & pay card ────────────────────────────────────────────────────

const PayActionCard = ({ plan, provider, onPay }) => (
  <Card>
    <button
      onClick={onPay}
      className="pay-button font-bold rounded-lg transition-all duration-200 active:scale-95"
      style={{
        width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: "0.15rem", padding: "clamp(0.9375rem, 3vw, 1.25rem)", backgroundColor: "hsl(174 62% 32%)",
        color: "white", border: "none", borderRadius: "0.65rem", cursor: "pointer",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "clamp(0.9375rem, 2.5vw, 1.0625rem)" }}>
        <Shield style={{ height: "1.125rem", width: "1.125rem", flexShrink: 0 }} />
        Pay GHS {plan.price.toFixed(2)}/month
      </span>
      <span style={{ fontSize: "clamp(0.6875rem, 2vw, 0.75rem)", fontWeight: "500", opacity: 0.85 }}>
        via {provider === "paystack" ? "Paystack" : "Flutterwave"}
      </span>
    </button>

    <p style={{ color: "hsl(200 15% 45%)", fontSize: "clamp(0.75rem, 1.8vw, 0.8125rem)", textAlign: "center", marginTop: "1rem", lineHeight: "1.5" }}>
      By confirming, you agree to our{" "}
      <Link href="/terms" style={{ color: "hsl(174 62% 32%)", textDecoration: "none", fontWeight: "500" }}>Terms of Service</Link>
      {" "}and{" "}
      <Link href="/privacy" style={{ color: "hsl(174 62% 32%)", textDecoration: "none", fontWeight: "500" }}>Privacy Policy</Link>.
      {" "}Subscriptions renew monthly — cancel anytime.
    </p>
  </Card>
);

// ─── States ───────────────────────────────────────────────────────────────────

const LoadingState = () => (
  <div style={{ textAlign: "center", padding: "clamp(3rem, 10vw, 5rem) clamp(1rem, 4vw, 2rem)" }}>
    <div style={{ width: "clamp(3.5rem, 15vw, 5rem)", height: "clamp(3.5rem, 15vw, 5rem)", margin: "0 auto 2rem", color: "hsl(174 62% 32%)" }}>
      <Loader style={{ width: "100%", height: "100%", animation: "spin 1s linear infinite" }} />
    </div>
    <h3 className="font-bold" style={{ color: "hsl(200 25% 15%)", fontSize: "clamp(1.25rem, 4vw, 1.5rem)", marginBottom: "0.75rem" }}>Redirecting to Payment...</h3>
    <p style={{ color: "hsl(200 15% 45%)", fontSize: "clamp(0.9375rem, 2.5vw, 1rem)", maxWidth: "400px", margin: "0 auto" }}>Please wait while we prepare your secure payment session.</p>
    <p style={{ color: "hsl(38 92% 50%)", fontSize: "0.875rem", marginTop: "1rem", fontWeight: "500" }}>Do not close or refresh this page</p>
  </div>
);

const SuccessState = ({ plan }) => (
  <div style={{ textAlign: "center", padding: "clamp(3rem, 10vw, 5rem) clamp(1rem, 4vw, 2rem)" }}>
    <div style={{ width: "clamp(3.5rem, 15vw, 5rem)", height: "clamp(3.5rem, 15vw, 5rem)", borderRadius: "50%", background: "hsl(152 60% 40% / 0.1)", color: "hsl(152 60% 40%)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem" }}>
      <CheckCircle2 style={{ height: "2.25rem", width: "2.25rem" }} />
    </div>
    <h3 className="font-bold" style={{ color: "hsl(200 25% 15%)", fontSize: "clamp(1.375rem, 5vw, 2rem)", marginBottom: "0.75rem" }}>Payment Successful!</h3>
    <p style={{ color: "hsl(200 15% 45%)", fontSize: "clamp(0.9375rem, 2.5vw, 1.0625rem)", lineHeight: "1.6", maxWidth: "500px", margin: "0 auto 2rem" }}>
      Your RentTrustGh {plan?.name} subscription is now active. Enjoy all your new features!
    </p>
    <Link href="/agent-dashboard" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "clamp(0.75rem, 3vw, 1rem) clamp(1.5rem, 5vw, 2rem)", backgroundColor: "hsl(174 62% 32%)", color: "white", borderRadius: "0.5rem", fontWeight: "600", textDecoration: "none", fontSize: "clamp(0.9375rem, 2vw, 1rem)" }}>
      Go to Dashboard <ArrowRight style={{ height: "1rem", width: "1rem" }} />
    </Link>
    <p style={{ color: "hsl(200 15% 45%)", fontSize: "0.8125rem", marginTop: "2rem" }}>A confirmation email has been sent to your registered email address.</p>
  </div>
);

const FailureState = ({ error, onRetry, onCancel }) => (
  <div style={{ textAlign: "center", padding: "clamp(3rem, 10vw, 5rem) clamp(1rem, 4vw, 2rem)" }}>
    <div style={{ width: "clamp(3.5rem, 15vw, 5rem)", height: "clamp(3.5rem, 15vw, 5rem)", borderRadius: "50%", background: "hsl(0 65% 51% / 0.1)", color: "hsl(0 65% 51%)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem" }}>
      <XCircle style={{ height: "2.25rem", width: "2.25rem" }} />
    </div>
    <h3 className="font-bold" style={{ color: "hsl(200 25% 15%)", fontSize: "clamp(1.375rem, 5vw, 2rem)", marginBottom: "0.75rem" }}>Payment Failed</h3>
    <p style={{ color: "hsl(200 15% 45%)", fontSize: "clamp(0.9375rem, 2.5vw, 1.0625rem)", maxWidth: "500px", margin: "0 auto 1rem", lineHeight: "1.6" }}>
      We couldn't start your payment session. Please try again or choose a different gateway.
    </p>
    {error && (
      <div style={{ display: "inline-block", padding: "1rem 1.5rem", backgroundColor: "hsl(0 65% 51% / 0.05)", border: "1px solid hsl(0 65% 51% / 0.2)", borderRadius: "0.75rem", marginBottom: "2rem", maxWidth: "500px" }}>
        <p style={{ color: "hsl(0 65% 51%)", fontSize: "0.9375rem", margin: 0, fontWeight: "500" }}>{error}</p>
      </div>
    )}
    <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
      <button onClick={onRetry} style={{ display: "inline-flex", alignItems: "center", padding: "clamp(0.75rem, 3vw, 1rem) clamp(1.5rem, 5vw, 2rem)", backgroundColor: "hsl(174 62% 32%)", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600", fontSize: "clamp(0.9375rem, 2vw, 1rem)" }}>Try Again</button>
      <button onClick={onCancel} style={{ display: "inline-flex", alignItems: "center", padding: "clamp(0.75rem, 3vw, 1rem) clamp(1.5rem, 5vw, 2rem)", backgroundColor: "white", color: "hsl(200 25% 15%)", border: "1px solid hsl(40 20% 88%)", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600", fontSize: "clamp(0.9375rem, 2vw, 1rem)" }}>Cancel</button>
    </div>
    <p style={{ color: "hsl(200 15% 45%)", fontSize: "0.8125rem", marginTop: "2rem" }}>
      Need help? <Link href='/contact' style={{ color: "hsl(174 62% 32%)", fontWeight: "500", textDecoration: "none" }}>Contact Support</Link>
    </p>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const CheckoutPage = ({ plan, allPlans = [] }) => {
  const { flash } = usePage().props;

  const [paymentState, setPaymentState] = useState("form");
  const [selectedProvider, setSelectedProvider] = useState("paystack");
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(plan);

  useEffect(() => {
    if (flash?.success) setPaymentState("success");
    if (flash?.error) { setError(flash.error); setPaymentState("failure"); }
  }, [flash]);

  const handleSwitchPlan = (newPlan) => {
    setSelectedPlan(newPlan);
    router.get(`/checkout/${newPlan.id}`, {}, { preserveState: true });
  };

  const handlePayment = () => {
    setPaymentState("loading");
    setError(null);

    router.post(
      "/checkout/start",
      { plan_id: selectedPlan.id, provider: selectedProvider },
      {
        onError: (errors) => {
          setError(
            errors?.message ||
            (typeof errors === "object" ? Object.values(errors)[0] : null) ||
            "Payment initialization failed. Please try again."
          );
          setPaymentState("failure");
        },
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
      <Head>
        <title>RentTrustGh | Ghana's Trusted Property Marketplace</title>
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html, body { overflow-x: hidden; }
        * { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
        h1,h2,h3,h4,h5,h6 { font-weight: 600; }
        img, svg { max-width: 100%; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) { button { -webkit-tap-highlight-color: transparent; min-height: 44px; } }
        @media print { header, footer { display: none !important; } }

        .checkout-shell {
          padding-left: clamp(0.875rem, 4vw, 2rem);
          padding-right: clamp(0.875rem, 4vw, 2rem);
        }

        /* ── Layout: mobile-first single column ── */
        .checkout-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(1rem, 3vw, 1.5rem);
          align-items: start;
        }
        .checkout-main,
        .checkout-sidebar {
          display: grid;
          gap: clamp(1rem, 3vw, 1.5rem);
          min-width: 0;
        }

        /* Collapsible order summary — closed by default on small screens */
        .order-summary-toggle { cursor: default; }
        .order-summary-chevron { display: none; }
        .order-summary-price-pill { display: none; }
        .order-summary-body { display: grid; }

        /* ── Tablet and up ── */
        @media (min-width: 640px) {
          .plans-grid { grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)) !important; }
        }

        /* ── Desktop: two columns, sticky sidebar ── */
        @media (min-width: 1024px) {
          .checkout-layout {
            grid-template-columns: minmax(0, 1fr) 380px;
            gap: 2rem;
          }
          .checkout-sidebar {
            position: sticky;
            top: 1.5rem;
            align-self: start;
          }
        }

        @media (min-width: 1280px) {
          .checkout-sidebar { top: 2rem; }
        }

        /* ── Small phones: collapse order summary behind a tap target ── */
        @media (max-width: 639px) {
          .order-summary-toggle { cursor: pointer; }
          .order-summary-chevron { display: block; }
          .order-summary-price-pill { display: inline; }
          .order-summary-body {
            grid-template-rows: 0fr;
            overflow: hidden;
            transition: grid-template-rows 0.25s ease;
          }
          .order-summary-body > * { overflow: hidden; }
          .order-summary-body.is-expanded { grid-template-rows: 1fr; }
        }

        @media (max-width: 480px) {
          .checkout-header-row { flex-wrap: wrap; row-gap: 0.5rem; }
          .plans-grid { grid-template-columns: 1fr !important; }
          .provider-label { flex-wrap: wrap; row-gap: 0.5rem; }
          .provider-check { display: none; }
          .pay-button { border-radius: 0.5rem; }
        }

        @media (max-width: 359px) {
          .checkout-card > div { padding: 1rem !important; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "hsl(40 33% 98%)" }}>
        <Header />

        <main style={{ flex: 1, width: "100%" }}>
          {/* Page header — only shown on form state */}
          {paymentState === "form" && (
            <div style={{ backgroundColor: "hsl(0 0% 100%)", borderBottom: "1px solid hsl(40 20% 88%)", padding: "clamp(1.25rem, 4vw, 2rem) 0" }}>
              <div className="checkout-shell" style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <h1 style={{ color: "hsl(200 25% 15%)", fontSize: "clamp(1.375rem, 5vw, 2rem)", fontWeight: "700", marginBottom: "clamp(0.4rem, 2vw, 0.75rem)", lineHeight: "1.2" }}>
                  Checkout
                </h1>
                <p style={{ color: "hsl(200 15% 45%)", fontSize: "clamp(0.875rem, 2.5vw, 1rem)", margin: 0, lineHeight: "1.5" }}>
                  Subscribe to the{" "}
                  <strong style={{ color: "hsl(174 62% 32%)" }}>RentTrustGh {selectedPlan.name} Plan</strong>
                  {" "}— GHS {selectedPlan.price.toFixed(2)}/month
                </p>
              </div>
            </div>
          )}

          {/* Content */}
          <div
            className="checkout-shell"
            style={{
              maxWidth: paymentState === "form" ? "1200px" : "640px",
              margin: "0 auto",
              paddingTop: paymentState === "form" ? "clamp(1.5rem, 5vw, 2.5rem)" : 0,
              paddingBottom: "clamp(2rem, 6vw, 3rem)",
              width: "100%",
            }}
          >
            {paymentState === "loading" && <LoadingState />}
            {paymentState === "success" && <SuccessState plan={selectedPlan} />}
            {paymentState === "failure" && (
              <FailureState
                error={error}
                onRetry={() => { setPaymentState("form"); setError(null); }}
                onCancel={() => router.visit("/pricing")}
              />
            )}

            {paymentState === "form" && (
              <div className="checkout-layout">
                <div className="checkout-main">
                  {allPlans.length > 0 && (
                    <PlansComparison plans={allPlans} current={selectedPlan} onSelect={handleSwitchPlan} />
                  )}
                  <PaymentProviderSelector
                    selectedProvider={selectedProvider}
                    onProviderChange={setSelectedProvider}
                  />
                </div>

                <div className="checkout-sidebar">
                  <OrderSummary plan={selectedPlan} provider={selectedProvider} />
                  <PayActionCard plan={selectedPlan} provider={selectedProvider} onPay={handlePayment} />
                  <div style={{ textAlign: "center" }}>
                    <Link href="/pricing" style={{ color: "hsl(200 15% 45%)", fontSize: "0.875rem", textDecoration: "none", fontWeight: "500" }}>
                      ← Change plan
                    </Link>
                  </div>
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