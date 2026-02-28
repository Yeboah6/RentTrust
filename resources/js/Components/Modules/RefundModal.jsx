import { useState } from "react";

const X = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const DollarSign = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CreditCard = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const FileText = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const Zap = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const Key = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);

const AlertCircle = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const RefundModal = ({ transaction, onClose, onRefund }) => {
  const [refundAmount, setRefundAmount] = useState(transaction.amount);
  const [refundReason, setRefundReason] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleRefundSubmit = async () => {
    if (!refundReason.trim()) {
      alert("Please provide a reason for the refund");
      return;
    }
    setProcessing(true);
    // Small delay for UX, then call parent handler which hits the real API
    setTimeout(() => {
      onRefund(transaction.id);
      setProcessing(false);
    }, 800);
  };

  const getPaymentTypeIcon = (type) => {
    switch (type) {
      case 'Subscription': return CreditCard;
      case 'Boost':        return Zap;
      case 'Lead Unlock':  return Key;
      default:             return FileText;
    }
  };

  const PaymentIcon = getPaymentTypeIcon(transaction.payment_type);

  return (
    <div
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}
      onClick={onClose}
    >
      <div
        style={{ backgroundColor: 'white', borderRadius: '1rem', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid hsl(40 20% 88%)' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'hsl(200 25% 15%)', marginBottom: '0.25rem' }}>
              Transaction Details
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)' }}>{transaction.id}</p>
          </div>
          <button onClick={onClose} style={{ padding: '0.5rem', border: 'none', backgroundColor: 'hsl(40 30% 94%)', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X style={{ height: '1.25rem', width: '1.25rem', color: 'hsl(200 15% 45%)' }} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          {/* User Information */}
          <div style={{ backgroundColor: 'hsl(40 33% 99%)', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'hsl(200 15% 45%)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)', marginBottom: '0.25rem' }}>Name</p>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)' }}>{transaction.user_name}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)', marginBottom: '0.25rem' }}>Role</p>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)' }}>{transaction.user_role}</p>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)', marginBottom: '0.25rem' }}>Email</p>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)' }}>{transaction.email}</p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div style={{ backgroundColor: 'hsl(40 33% 99%)', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'hsl(200 15% 45%)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Payment Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)', marginBottom: '0.25rem' }}>Payment Type</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <PaymentIcon style={{ height: '1rem', width: '1rem', color: 'hsl(174 62% 32%)' }} />
                  <p style={{ fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)' }}>{transaction.payment_type}</p>
                </div>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)', marginBottom: '0.25rem' }}>Amount</p>
                <p style={{ fontSize: '1.25rem', fontWeight: '700', color: 'hsl(174 62% 32%)' }}>GH₵{Number(transaction.amount).toFixed(2)}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)', marginBottom: '0.25rem' }}>Payment Method</p>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)' }}>{transaction.payment_method}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)', marginBottom: '0.25rem' }}>Date & Time</p>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)' }}>{transaction.date}</p>
              </div>
            </div>

            {transaction.plan && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid hsl(40 20% 88%)' }}>
                <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)', marginBottom: '0.25rem' }}>Subscription Plan</p>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)' }}>{transaction.plan}</p>
              </div>
            )}

            {transaction.failure_reason && (
              <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: 'hsl(0 70% 97%)', border: '1px solid hsl(0 70% 85%)', borderRadius: '0.5rem', display: 'flex', alignItems: 'start', gap: '0.5rem' }}>
                <AlertCircle style={{ height: '1rem', width: '1rem', color: 'hsl(0 70% 50%)', flexShrink: 0, marginTop: '0.125rem' }} />
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'hsl(0 70% 50%)', marginBottom: '0.125rem' }}>Failure Reason</p>
                  <p style={{ fontSize: '0.875rem', color: 'hsl(0 70% 40%)' }}>{transaction.failure_reason}</p>
                </div>
              </div>
            )}
          </div>

          {/* Refund Section */}
          {transaction.status === 'Success' && (
            <>
              <div style={{ backgroundColor: 'hsl(40 33% 99%)', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'hsl(200 15% 45%)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Process Refund</h3>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)', marginBottom: '0.5rem' }}>Refund Amount</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.875rem', color: 'hsl(200 15% 45%)', fontWeight: '500' }}>GH₵</span>
                    <input type="number" value={refundAmount} onChange={(e) => setRefundAmount(parseFloat(e.target.value))} max={transaction.amount} step="0.01" style={{ width: '100%', padding: '0.625rem 0.875rem 0.625rem 2.5rem', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '500', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)', marginTop: '0.25rem' }}>Maximum refundable: GH₵{Number(transaction.amount).toFixed(2)}</p>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)', marginBottom: '0.5rem' }}>
                    Refund Reason <span style={{ color: 'hsl(0 70% 50%)' }}>*</span>
                  </label>
                  <select value={refundReason} onChange={(e) => setRefundReason(e.target.value)} style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.5rem', fontSize: '0.875rem', backgroundColor: 'white', fontFamily: 'inherit', outline: 'none' }}>
                    <option value="">Select a reason</option>
                    <option value="duplicate">Duplicate charge</option>
                    <option value="customer_request">Customer request</option>
                    <option value="service_not_delivered">Service not delivered</option>
                    <option value="technical_issue">Technical issue</option>
                    <option value="fraudulent">Fraudulent transaction</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)', marginBottom: '0.5rem' }}>Admin Notes (Internal)</label>
                  <textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} placeholder="Add any internal notes about this refund..." rows={3} style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.5rem', fontSize: '0.875rem', resize: 'vertical', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>

              {/* Warning */}
              <div style={{ backgroundColor: 'hsl(40 100% 97%)', border: '1px solid hsl(40 92% 85%)', borderRadius: '0.5rem', padding: '0.875rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem' }}>
                <AlertCircle style={{ height: '1.25rem', width: '1.25rem', color: 'hsl(38 92% 50%)', flexShrink: 0 }} />
                <p style={{ fontSize: '0.875rem', color: 'hsl(25 95% 35%)', lineHeight: '1.5' }}>
                  This action cannot be undone. The refund will be processed immediately and the user's subscription will be cancelled.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '1.5rem', borderTop: '1px solid hsl(40 20% 88%)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', backgroundColor: 'hsl(40 33% 99%)' }}>
          <button onClick={onClose} style={{ padding: '0.625rem 1.25rem', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.5rem', backgroundColor: 'white', color: 'hsl(200 25% 15%)', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit' }}>
            Close
          </button>
          {transaction.status === 'Success' && (
            <button
              onClick={handleRefundSubmit}
              disabled={processing || !refundReason}
              style={{ padding: '0.625rem 1.25rem', border: 'none', borderRadius: '0.5rem', background: processing || !refundReason ? 'hsl(0 0% 85%)' : 'linear-gradient(135deg, hsl(0 70% 50%) 0%, hsl(0 70% 45%) 100%)', color: 'white', fontSize: '0.875rem', fontWeight: '500', cursor: processing || !refundReason ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', opacity: processing || !refundReason ? 0.6 : 1, fontFamily: 'inherit' }}
            >
              <DollarSign style={{ height: '1rem', width: '1rem' }} />
              {processing ? 'Processing...' : 'Process Refund'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RefundModal;