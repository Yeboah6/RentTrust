import React from 'react';
import { X, Shield, Star, Mail, Phone, MapPin } from 'lucide-react';

const AgentProfileModal = ({ agent, isOpen, onClose, auth, rentalId = null }) => {
  const trackInquiry = (type) => {
    if (!rentalId) {
      return;
    }
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    fetch(`/api/listings/${rentalId}/track-inquiry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': token,
      },
      body: JSON.stringify({ type }),
    }).catch(() => {
      // silently ignore
    });
  };

  if (!isOpen || !agent) return null;

  const renderStars = (rating) => {
    const ratingValue = Math.floor(rating || 0);
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={14}
        style={{
          color: i < ratingValue ? '#e8a020' : 'rgba(245,240,232,0.15)',
          fill: i < ratingValue ? '#e8a020' : 'none'
        }}
      />
    ));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap');
        
        .agent-wrap * { box-sizing: border-box; margin: 0; padding: 0; }
        .agent-wrap { font-family: 'DM Sans', sans-serif; }
        
        .agent-overlay {
          position: fixed; inset: 0;
          background: rgba(10,8,5,0.72);
          backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          z-index: 50; padding: 1rem;
        }
        
        .agent-modal {
          background: #0f0e0c;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 2px;
          width: 100%; max-width: 480px;
          max-height: 90vh; overflow-y: auto;
          scrollbar-width: none;
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        }
        
        .agent-modal::-webkit-scrollbar { display: none; }
        
        .agent-stripe {
          height: 3px;
          background: linear-gradient(90deg, #e8a020 0%, #f0c060 50%, #e8a020 100%);
        }
        
        .agent-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem;
        }
        
        .agent-header-content {
          flex: 1;
        }
        
        .agent-close {
          background: rgba(255,255,255,0.06); border: none; border-radius: 2px;
          width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: rgba(245,240,232,0.5); flex-shrink: 0;
          transition: background 0.15s, color 0.15s;
        }
        
        .agent-close:hover { background: rgba(255,255,255,0.12); color: #f5f0e8; }
        
        .agent-avatar-section {
          display: flex; gap: 1rem; align-items: flex-start;
        }
        
        .agent-avatar {
          width: 64px; height: 64px; border-radius: 2px;
          background: linear-gradient(135deg, #e8a020 0%, #d48010 100%);
          display: flex; align-items: center; justify-content: center;
          color: #0f0e0c; font-size: 1.75rem; font-weight: 700;
          flex-shrink: 0;
        }
        
        .agent-title-group {
          flex: 1;
        }
        
        .agent-name {
          font-family: 'DM Serif Display', serif;
          font-size: 1.375rem; color: #f5f0e8; line-height: 1.2;
          display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;
        }
        
        .agent-badge {
          width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;
        }
        
        .agent-company {
          font-size: 0.75rem; color: rgba(245,240,232,0.4); letter-spacing: 0.04em; text-transform: uppercase;
        }
        
        .agent-verification {
          margin: 1.25rem 1.5rem 0;
          padding: 0.75rem 1rem;
          background: rgba(232,160,32,0.08);
          border: 1px solid rgba(232,160,32,0.2);
          border-radius: 2px;
          display: flex; align-items: center; gap: 0.75rem;
        }
        
        .agent-verification-icon {
          color: #e8a020; flex-shrink: 0;
        }
        
        .agent-verification-text {
          font-size: 0.75rem; font-weight: 500;
          color: rgba(232,160,32,0.85); letter-spacing: 0.03em; text-transform: uppercase;
        }
        
        .agent-body { padding: 1.25rem 1.5rem 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
        
        .agent-section {
          display: flex; flex-direction: column; gap: 0.5rem;
        }
        
        .agent-section-label {
          font-size: 0.6875rem; font-weight: 600; color: rgba(245,240,232,0.35);
          letter-spacing: 0.08em; text-transform: uppercase;
        }
        
        .agent-rating-box {
          background: rgba(232,160,32,0.06);
          border: 1px solid rgba(232,160,32,0.15);
          border-radius: 2px;
          padding: 1rem;
          display: flex; align-items: center; gap: 1rem;
        }
        
        .agent-stars {
          display: flex; gap: 0.375rem; align-items: center;
        }
        
        .agent-rating-value {
          display: flex; align-items: baseline; gap: 0.375rem;
        }
        
        .agent-rating-number {
          font-size: 1rem; font-weight: 600; color: #f5f0e8;
        }
        
        .agent-rating-count {
          font-size: 0.75rem; color: rgba(245,240,232,0.4);
        }
        
        .agent-fee-box {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 2px;
          padding: 1rem;
        }
        
        .agent-fee-value {
          font-size: 1.375rem; font-weight: 600; color: #e8a020;
        }
        
        .agent-contact-items {
          display: flex; flex-direction: column; gap: 0.75rem;
        }
        
        .agent-contact-item {
          display: flex; align-items: center; gap: 0.875rem;
        }
        
        .agent-contact-icon {
          color: rgba(232,160,32,0.6); flex-shrink: 0;
        }
        
        .agent-contact-value {
          font-size: 0.875rem; color: #f5f0e8; word-break: break-all;
        }
        
        .agent-bio {
          font-size: 0.8125rem; color: rgba(245,240,232,0.6);
          line-height: 1.6; font-weight: 300;
        }
        
        .agent-divider { height: 1px; background: rgba(255,255,255,0.06); }
        
        .agent-actions {
          display: flex; gap: 0.625rem;
        }
        
        .agent-btn-primary {
          flex: 2; padding: 0.875rem; background: #e8a020;
          border: none; border-radius: 2px;
          font-family: 'DM Sans', sans-serif; font-size: 0.8125rem; font-weight: 600;
          color: #0f0e0c; letter-spacing: 0.05em; text-transform: uppercase;
          cursor: pointer; transition: background 0.15s, opacity 0.15s;
          text-decoration: none; display: flex; align-items: center; justify-content: center;
        }
        
        .agent-btn-primary:hover {
          background: #f0b030;
        }
        
        .agent-btn-secondary {
          flex: 1; padding: 0.875rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 2px;
          font-family: 'DM Sans', sans-serif; font-size: 0.8125rem; font-weight: 500;
          color: rgba(245,240,232,0.55); cursor: pointer;
          transition: background 0.15s, color 0.15s;
          border: none;
        }
        
        .agent-btn-secondary:hover {
          background: rgba(255,255,255,0.08); color: #f5f0e8;
        }
      `}</style>

      <div className="agent-wrap">
        <div className="agent-overlay" onClick={onClose}>
          <div className="agent-modal" onClick={e => e.stopPropagation()}>
            <div className="agent-stripe" />

            {/* Header */}
            <div className="agent-header">
              <div className="agent-header-content">
                <div className="agent-avatar-section">
                  <div className="agent-avatar">
                    {agent.name?.[0] || 'A'}
                  </div>
                  <div className="agent-title-group">
                    <div className="agent-name">
                      {agent.name}
                      {agent.status === 'verified' && (
                        <div className="agent-badge">
                          <Shield size={18} style={{ color: '#e8a020' }} />
                        </div>
                      )}
                    </div>
                    <div className="agent-company">
                      {agent.company || 'Independent Agent'}
                    </div>
                  </div>
                </div>
              </div>
              <button className="agent-close" onClick={onClose}>
                <X size={14} />
              </button>
            </div>

            {/* Verification Badge */}
            {agent.status === 'verified' && (
              <div className="agent-verification">
                <Shield size={16} className="agent-verification-icon" />
                <span className="agent-verification-text">Verified Agent</span>
              </div>
            )}

            {/* Body */}
            <div className="agent-body">
              {/* Rating */}
              {agent.average_rating && (
                <div className="agent-section">
                  <label className="agent-section-label">Agent Rating</label>
                  <div className="agent-rating-box">
                    <div className="agent-stars">
                      {renderStars(agent.average_rating)}
                    </div>
                    <div className="agent-rating-value">
                      <span className="agent-rating-number">
                        {agent.average_rating.toFixed(1)}
                      </span>
                      <span className="agent-rating-count">
                        ({agent.total_reviews || 0} {agent.total_reviews === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Fee */}
              <div className="agent-section">
                <label className="agent-section-label">Service Fee</label>
                <div className="agent-fee-box">
                  <div className="agent-fee-value">
                    {agent.fee_percentage || agent.fee || 0}%
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="agent-section">
                <label className="agent-section-label">Contact Information</label>
                <div className="agent-contact-items">
                  {agent.email && (
                    <div className="agent-contact-item">
                      <Mail size={16} className="agent-contact-icon" />
                      <span className="agent-contact-value">{agent.email}</span>
                    </div>
                  )}
                  {agent.phone && (
                    <div className="agent-contact-item">
                      <Phone size={16} className="agent-contact-icon" />
                      <span className="agent-contact-value">{agent.phone}</span>
                    </div>
                  )}
                  {agent.location && (
                    <div className="agent-contact-item">
                      <MapPin size={16} className="agent-contact-icon" />
                      <span className="agent-contact-value">{agent.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio */}
              {agent.bio && (
                <div className="agent-section">
                  <label className="agent-section-label">About</label>
                  <p className="agent-bio">
                    {agent.bio}
                  </p>
                </div>
              )}

              <div className="agent-divider" />

              {/* Actions */}
              <div className="agent-actions">
                <a
                  href={`tel:${auth?.phone || agent.phone}`}
                  onClick={() => trackInquiry('phone')}
                  className="agent-btn-primary"
                >
                  Call Agent
                </a>
                <button
                  type="button"
                  className="agent-btn-secondary"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AgentProfileModal;