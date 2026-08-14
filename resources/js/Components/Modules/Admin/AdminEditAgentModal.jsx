import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';

const AdminEditAgentModal = ({ agent, isOpen, onClose, onSuccess }) => {
  const { data, setData, put, processing, errors, reset } = useForm({
    name: agent?.fullName ?? agent?.name ?? '',
    email: agent?.email ?? '',
    phone: agent?.phone ?? '',
    company: agent?.company ?? '',
    bio: agent?.bio ?? '',
    fee: agent?.fee ?? '',
    role: agent?.role ?? 'agent',
    location: agent?.location ?? '',
  });

  useEffect(() => {
    if (!agent) {
      return;
    }

    setData('name', agent.fullName ?? agent.name ?? '');
    setData('email', agent.email ?? '');
    setData('phone', agent.phone ?? '');
    setData('company', agent.company ?? '');
    setData('bio', agent.bio ?? '');
    setData('fee', agent.fee ?? '');
    setData('role', agent.role ?? 'agent');
    setData('location', agent.location ?? '');
  }, [agent]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!agent) {
      return;
    }

    put(`/admin/agents/${agent.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        onSuccess?.('Agent details updated successfully.');
        reset();
      },
      onError: () => {
        // errors are automatically set by useForm
      },
    });
  };

  if (!isOpen || !agent) {
    return null;
  }
  return (
    <div
      className="modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.58)',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <style>{`
        .modal-overlay {
          align-items: flex-start; /* allow scrolling on mobile */
          overflow-y: auto;
          padding: 0.5rem;
        }

        .modal-container {
          width: 100%;
          max-width: 560px;
          border-radius: 1rem;
          background-color: #0f0e0c;
          color: #f5f0e8;
          box-shadow: 0 25px 80px rgba(0,0,0,0.35);
          overflow: hidden;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          margin: 0 auto;
        }

        .modal-header {
          padding: 1.5rem 1.5rem 0.75rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .modal-form {
          padding: 1.5rem;
          display: grid;
          gap: 1rem;
          overflow-y: auto;
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-actions {
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
          margin-top: 0.5rem;
        }

        @media (max-width: 640px) {
          .modal-header {
            padding: 1rem 1rem 0.5rem;
          }
          .modal-form {
            padding: 1rem;
          }
          .form-grid-2 {
            grid-template-columns: 1fr; /* stack on mobile */
          }
          .form-actions {
            flex-direction: column-reverse;
          }
          .form-actions button {
            width: 100%;
          }
          .modal-close-btn {
            min-height: 44px;
            min-width: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      `}</style>

      <div className="modal-container">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Edit Agent</h2>
              <p style={{ margin: '0.5rem 0 0', color: 'rgba(245,240,232,0.7)', fontSize: '0.9rem' }}>
                Update agent contact details, company, and bio.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="modal-close-btn"
              style={{
                border: 'none',
                background: 'transparent',
                color: 'rgba(245,240,232,0.75)',
                fontSize: '1.5rem',
                cursor: 'pointer',
              }}
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <label style={{ display: 'grid', gap: '0.4rem', fontSize: '0.85rem', color: '#d7d2c9' }}>
            Name
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              placeholder="Agent name"
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(255,255,255,0.08)',
                backgroundColor: '#161512',
                color: '#f5f0e8',
                outline: 'none',
              }}
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
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(255,255,255,0.08)',
                backgroundColor: '#161512',
                color: '#f5f0e8',
                outline: 'none',
              }}
            />
            {errors.email && <span style={{ color: '#ff6b6b', fontSize: '0.78rem' }}>{errors.email}</span>}
          </label>

          <div className="form-grid-2">
            <label style={{ display: 'grid', gap: '0.4rem', fontSize: '0.85rem', color: '#d7d2c9' }}>
              Phone
              <input
                type="text"
                value={data.phone}
                onChange={(e) => setData('phone', e.target.value)}
                placeholder="Agent phone"
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backgroundColor: '#161512',
                  color: '#f5f0e8',
                  outline: 'none',
                }}
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
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backgroundColor: '#161512',
                  color: '#f5f0e8',
                  outline: 'none',
                }}
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
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(255,255,255,0.08)',
                backgroundColor: '#161512',
                color: '#f5f0e8',
                outline: 'none',
                resize: 'vertical',
              }}
            />
            {errors.bio && <span style={{ color: '#ff6b6b', fontSize: '0.78rem' }}>{errors.bio}</span>}
          </label>

          <div className="form-grid-2">
            <label style={{ display: 'grid', gap: '0.4rem', fontSize: '0.85rem', color: '#d7d2c9' }}>
              Fee %
              <input
                type="number"
                value={data.fee}
                onChange={(e) => setData('fee', e.target.value)}
                placeholder="Agent fee percentage"
                min="0"
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backgroundColor: '#161512',
                  color: '#f5f0e8',
                  outline: 'none',
                }}
              />
              {errors.fee && <span style={{ color: '#ff6b6b', fontSize: '0.78rem' }}>{errors.fee}</span>}
            </label>
            <label style={{ display: 'grid', gap: '0.4rem', fontSize: '0.85rem', color: '#d7d2c9' }}>
              Role
              <select
                value={data.role}
                onChange={(e) => setData('role', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backgroundColor: '#161512',
                  color: '#f5f0e8',
                  outline: 'none',
                }}
              >
                <option value="">Select a role</option>
                <option value="agent">Agent</option>
                <option value="landlord">Landlord</option>
              </select>
              {errors.role && <span style={{ color: '#ff6b6b', fontSize: '0.78rem' }}>{errors.role}</span>}
            </label>
          </div>

          <label style={{ display: 'grid', gap: '0.4rem', fontSize: '0.85rem', color: '#d7d2c9' }}>
            Location
            <input
              type="text"
              value={data.location}
              onChange={(e) => setData('location', e.target.value)}
              placeholder="City, State"
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(255,255,255,0.08)',
                backgroundColor: '#161512',
                color: '#f5f0e8',
                outline: 'none',
              }}
            />
            {errors.location && <span style={{ color: '#ff6b6b', fontSize: '0.78rem' }}>{errors.location}</span>}
          </label>

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.85rem 1.2rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(255,255,255,0.12)',
                backgroundColor: 'transparent',
                color: '#f5f0e8',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing}
              style={{
                padding: '0.85rem 1.2rem',
                borderRadius: '0.75rem',
                border: 'none',
                backgroundColor: '#e8a020',
                color: '#0f0e0c',
                fontWeight: '700',
                cursor: processing ? 'not-allowed' : 'pointer',
              }}
            >
              {processing ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditAgentModal;