import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';

const AdminAddAgentModal = ({ isOpen, onClose, onSuccess }) => {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    phone: '',
    company: '',
    bio: '',
    fee: '',
    password: '',
    password_confirmation: '',
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const handleSubmit = (event) => {
    event.preventDefault();

    post('/admin/agents', {
      preserveScroll: true,
      onSuccess: () => {
        onSuccess?.('Agent created successfully.');
        reset();
      },
      onError: () => {
        // errors are handled by useForm
      },
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.58)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '560px', borderRadius: '1rem', backgroundColor: '#0f0e0c', color: '#f5f0e8', boxShadow: '0 25px 80px rgba(0,0,0,0.35)', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem 1.5rem 0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Add Agent</h2>
              <p style={{ margin: '0.5rem 0 0', color: 'rgba(245,240,232,0.7)', fontSize: '0.9rem' }}>Create a new agent account from the admin dashboard.</p>
            </div>
            <button type="button" onClick={onClose} style={{ border: 'none', background: 'transparent', color: 'rgba(245,240,232,0.75)', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }}>
          <label style={{ display: 'grid', gap: '0.4rem', fontSize: '0.85rem', color: '#d7d2c9' }}>
            Name
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              placeholder="Agent name"
              style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#161512', color: '#f5f0e8', outline: 'none' }}
            />
            {errors.name && <span style={{ color: '#ff6b6b', fontSize: '0.78rem' }}>{errors.name}</span>}
          </label>

          <label style={{ display: 'grid', gap: '0.4rem', fontSize: '0.85rem', color: '#d7d2c9' }}>
            Email
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              placeholder="Agent email"
              style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#161512', color: '#f5f0e8', outline: 'none' }}
            />
            {errors.email && <span style={{ color: '#ff6b6b', fontSize: '0.78rem' }}>{errors.email}</span>}
          </label>

          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
            <label style={{ display: 'grid', gap: '0.4rem', fontSize: '0.85rem', color: '#d7d2c9' }}>
              Phone
              <input
                type="text"
                value={data.phone}
                onChange={(e) => setData('phone', e.target.value)}
                placeholder="Agent phone"
                style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#161512', color: '#f5f0e8', outline: 'none' }}
              />
              {errors.phone && <span style={{ color: '#ff6b6b', fontSize: '0.78rem' }}>{errors.phone}</span>}
            </label>

            <label style={{ display: 'grid', gap: '0.4rem', fontSize: '0.85rem', color: '#d7d2c9' }}>
              Company
              <input
                type="text"
                value={data.company}
                onChange={(e) => setData('company', e.target.value)}
                placeholder="Company name"
                style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#161512', color: '#f5f0e8', outline: 'none' }}
              />
              {errors.company && <span style={{ color: '#ff6b6b', fontSize: '0.78rem' }}>{errors.company}</span>}
            </label>
          </div>

          <label style={{ display: 'grid', gap: '0.4rem', fontSize: '0.85rem', color: '#d7d2c9' }}>
            Bio
            <textarea
              value={data.bio}
              onChange={(e) => setData('bio', e.target.value)}
              placeholder="Brief agent bio"
              rows={4}
              style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#161512', color: '#f5f0e8', outline: 'none', resize: 'vertical' }}
            />
            {errors.bio && <span style={{ color: '#ff6b6b', fontSize: '0.78rem' }}>{errors.bio}</span>}
          </label>

          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
            <label style={{ display: 'grid', gap: '0.4rem', fontSize: '0.85rem', color: '#d7d2c9' }}>
              Fee %
              <input
                type="number"
                value={data.fee}
                onChange={(e) => setData('fee', e.target.value)}
                placeholder="Agent fee percentage"
                min="0"
                style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#161512', color: '#f5f0e8', outline: 'none' }}
              />
              {errors.fee && <span style={{ color: '#ff6b6b', fontSize: '0.78rem' }}>{errors.fee}</span>}
            </label>

            <label style={{ display: 'grid', gap: '0.4rem', fontSize: '0.85rem', color: '#d7d2c9' }}>
              Password
              <input
                type="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                placeholder="Password"
                style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#161512', color: '#f5f0e8', outline: 'none' }}
              />
              {errors.password && <span style={{ color: '#ff6b6b', fontSize: '0.78rem' }}>{errors.password}</span>}
            </label>
          </div>

          <label style={{ display: 'grid', gap: '0.4rem', fontSize: '0.85rem', color: '#d7d2c9' }}>
            Confirm Password
            <input
              type="password"
              value={data.password_confirmation}
              onChange={(e) => setData('password_confirmation', e.target.value)}
              placeholder="Confirm password"
              style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#161512', color: '#f5f0e8', outline: 'none' }}
            />
            {errors.password_confirmation && <span style={{ color: '#ff6b6b', fontSize: '0.78rem' }}>{errors.password_confirmation}</span>}
          </label>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} style={{ padding: '0.85rem 1.2rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.12)', backgroundColor: 'transparent', color: '#f5f0e8', cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" disabled={processing} style={{ padding: '0.85rem 1.2rem', borderRadius: '0.75rem', border: 'none', backgroundColor: '#e8a020', color: '#0f0e0c', fontWeight: '700', cursor: processing ? 'not-allowed' : 'pointer' }}>
              {processing ? 'Saving…' : 'Create Agent'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddAgentModal;
