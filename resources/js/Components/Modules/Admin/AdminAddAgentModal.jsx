import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';

const getInputStyle = (hasError) => ({
  width: '100%', padding: '0.8rem 1rem', borderRadius: '0.65rem',
  border: `1px solid ${hasError ? 'rgba(255,107,107,0.55)' : 'rgba(255,255,255,0.09)'}`,
  backgroundColor: hasError ? 'rgba(255,107,107,0.04)' : '#161512',
  color: '#f5f0e8', outline: 'none', fontSize: '0.9rem', boxSizing: 'border-box',
  transition: 'border-color 0.15s, background-color 0.15s',
});

const labelStyle = { display: 'grid', gap: '0.4rem', fontSize: '0.82rem', color: '#a09a93' };

const ErrorMsg = ({ msg }) =>
  msg ? (
    <span style={{ color: '#ff6b6b', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
      <span style={{ fontSize: '0.7rem' }}>✕</span> {msg}
    </span>
  ) : null;

const getStrength = (pw) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
};

const STRENGTH_LABELS = ['Too short', 'Weak', 'Fair', 'Strong', 'Very strong'];
const STRENGTH_COLORS = ['#ff6b6b', '#e8a020', '#e8a020', '#4caf7d', '#4caf7d'];

const AdminAddAgentModal = ({ isOpen, onClose, onSuccess }) => {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '', email: '', phone: '', company: '',
    bio: '', fee: '', role: '', location: '',
  });

  const [emailStatus, setEmailStatus] = useState('idle'); // 'idle' | 'invalid' | 'checking' | 'taken' | 'valid'

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/admin/agents', {
      preserveScroll: true,
      onSuccess: () => { onSuccess?.('Agent created successfully.'); reset(); setEmailStatus('idle'); },
    });
  };

  if (!isOpen) return null;

  // const strength = data.password.length > 0 ? getStrength(data.password) : -1;
  // const confirmFilled = data.password_confirmation.length > 0;
  // const passwordsMatch = data.password === data.password_confirmation;

  // const confirmBorderColor = errors.password_confirmation
  //   ? 'rgba(255,107,107,0.55)'
  //   : !confirmFilled
  //   ? 'rgba(255,255,255,0.09)'
  //   : passwordsMatch
  //   ? 'rgba(76,175,125,0.45)'
  //   : 'rgba(255,107,107,0.45)';

  // const confirmBg = errors.password_confirmation
  //   ? 'rgba(255,107,107,0.04)'
  //   : !confirmFilled
  //   ? '#161512'
  //   : passwordsMatch
  //   ? 'rgba(76,175,125,0.03)'
  //   : 'rgba(255,107,107,0.04)';

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.58)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '560px', borderRadius: '1rem', backgroundColor: '#0f0e0c', color: '#f5f0e8', boxShadow: '0 25px 80px rgba(0,0,0,0.35)', overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ padding: '1.5rem 1.5rem 0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, backgroundColor: '#0f0e0c', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Add Agent</h2>
              <p style={{ margin: '0.5rem 0 0', color: 'rgba(245,240,232,0.6)', fontSize: '0.875rem' }}>
                Create a new agent account from the admin dashboard.
              </p>
            </div>
            <button type="button" onClick={onClose} style={{ border: 'none', background: 'rgba(255,255,255,0.06)', color: 'rgba(245,240,232,0.7)', fontSize: '1.1rem', cursor: 'pointer', width: 32, height: 32, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }}>

          {/* Top-level error summary — shown when server returns errors */}
          {Object.keys(errors).length > 0 && (
            <div style={{ padding: '0.75rem 1rem', borderRadius: '0.65rem', border: '1px solid rgba(255,107,107,0.3)', backgroundColor: 'rgba(255,107,107,0.06)', display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
              <span style={{ color: '#ff6b6b', fontSize: '1rem', lineHeight: 1.4 }}>⚠</span>
              <div>
                <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600, color: '#ff6b6b' }}>Please fix the errors below before continuing.</p>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: 'rgba(255,107,107,0.75)' }}>
                  {Object.keys(errors).length} field{Object.keys(errors).length > 1 ? 's need' : ' needs'} your attention.
                </p>
              </div>
            </div>
          )}

          <label style={labelStyle}>
            Name
            <input
              type="text" value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              placeholder="Agent name"
              style={getInputStyle(!!errors.name)}
            />
            <ErrorMsg msg={errors.name} />
          </label>

          <label style={labelStyle}>
            Email
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                value={data.email}
                onChange={(e) => {
                  const val = e.target.value;
                  setData('email', val);
                
                  // Reset on empty
                  if (!val) { setEmailStatus('idle'); return; }
                
                  // Client-side format check
                  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
                  if (!valid) { setEmailStatus('invalid'); return; }
                
                  // Debounced server-side uniqueness check
                  setEmailStatus('checking');
                  clearTimeout(window._emailTimer);
                  window._emailTimer = setTimeout(async () => {
                    try {
                      const res = await fetch(`/admin/agents/check-email?email=${encodeURIComponent(val)}`);
                      const json = await res.json();
                      setEmailStatus(json.taken ? 'taken' : 'valid');
                    } catch {
                      setEmailStatus('valid'); // fail open — Laravel will catch it on submit
                    }
                  }, 600);
                }}
                placeholder="agent@example.com"
                style={{
                  ...getInputStyle(!!errors.email || emailStatus === 'invalid' || emailStatus === 'taken'),
                  paddingRight: '2.4rem',
                }}
              />

              {/* Status icon */}
              <span style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.85rem', pointerEvents: 'none' }}>
                {emailStatus === 'checking' && <span style={{ color: 'rgba(245,240,232,0.35)', fontSize: '0.75rem' }}>…</span>}
                {emailStatus === 'valid'    && <span style={{ color: '#4caf7d' }}>✓</span>}
                {(emailStatus === 'invalid' || emailStatus === 'taken') && <span style={{ color: '#ff6b6b' }}>✕</span>}
              </span>
            </div>
              
            {/* Inline feedback — priority: server error > taken > invalid format */}
            {errors.email && <ErrorMsg msg={errors.email} />}
            {!errors.email && emailStatus === 'taken'   && <ErrorMsg msg="This email is already registered." />}
            {!errors.email && emailStatus === 'invalid' && <ErrorMsg msg="Please enter a valid email address." />}
            {!errors.email && emailStatus === 'valid'   && (
              <span style={{ color: '#4caf7d', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ fontSize: '0.7rem' }}>✓</span> Email is available.
              </span>
            )}
          </label>

          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
            <label style={labelStyle}>
              Phone
              <input
                type="text" value={data.phone}
                onChange={(e) => setData('phone', e.target.value)}
                placeholder="+1 555 000 0000"
                style={getInputStyle(!!errors.phone)}
              />
              <ErrorMsg msg={errors.phone} />
            </label>
            <label style={labelStyle}>
              Company
              <input
                type="text" value={data.company}
                onChange={(e) => setData('company', e.target.value)}
                placeholder="Company name"
                style={getInputStyle(!!errors.company)}
              />
              <ErrorMsg msg={errors.company} />
            </label>
          </div>

          <label style={labelStyle}>
            Bio
            <textarea
              value={data.bio}
              onChange={(e) => setData('bio', e.target.value)}
              placeholder="Brief agent bio"
              rows={3}
              style={{ ...getInputStyle(!!errors.bio), resize: 'vertical' }}
            />
            <ErrorMsg msg={errors.bio} />
          </label>

          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
            <label style={labelStyle}>
              Fee %
              <input
                type="text" value={data.fee}
                onChange={(e) => setData('fee', e.target.value)}
                placeholder="e.g. 10" min="0"
                style={getInputStyle(!!errors.fee)}
              />
              <ErrorMsg msg={errors.fee} />
            </label>
            <label style={labelStyle}>
              Role
              <select
                value={data.role}
                onChange={(e) => setData('role', e.target.value)}
                style={getInputStyle(!!errors.role)}
              >
                <option value="">Select a role</option>
                <option value="agent">Agent</option>
                <option value="landlord">Landlord</option>
              </select>
              <ErrorMsg msg={errors.role} />
              <ErrorMsg msg={errors.company} />
            </label>
          </div>

          <label style={labelStyle}>
            Location
            <input
              type="text" value={data.location}
              onChange={(e) => setData('location', e.target.value)}
              placeholder="City, State"
              style={getInputStyle(!!errors.location)}
            />
            <ErrorMsg msg={errors.location} />
          </label>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
            <button type="button" onClick={onClose} style={{ padding: '0.8rem 1.2rem', borderRadius: '0.65rem', border: '1px solid rgba(255,255,255,0.12)', backgroundColor: 'transparent', color: '#f5f0e8', cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" disabled={processing} style={{ padding: '0.8rem 1.4rem', borderRadius: '0.65rem', border: 'none', backgroundColor: '#e8a020', color: '#0f0e0c', fontWeight: 700, cursor: processing ? 'not-allowed' : 'pointer', opacity: processing ? 0.7 : 1 }}>
              {processing ? 'Saving…' : 'Create Agent'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddAgentModal;