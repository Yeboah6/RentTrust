import React from 'react';
import { X, Shield, Star, Mail, Phone, MapPin } from 'lucide-react';

const AgentProfileModal = ({ agent, isOpen, onClose, auth }) => {
  if (!isOpen || !agent) return null;

  const renderStars = (rating) => {
    const ratingValue = Math.floor(rating || 0);
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        style={{
          height: '1rem',
          width: '1rem',
          color: i < ratingValue ? 'hsl(38 92% 50%)' : 'hsl(200 15% 45%)',
          fill: i < ratingValue ? 'hsl(38 92% 50%)' : 'none'
        }}
      />
    ));
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }
        .hide-scrollbar {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>

      <div className='hide-scrollbar'
        style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          maxHeight: '90vh',
          overflow: 'auto',
          maxWidth: '500px',
          width: '100%',
          position: 'relative',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            backgroundColor: 'hsl(40 30% 94%)',
            border: 'none',
            borderRadius: '50%',
            width: '2rem',
            height: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'hsl(40 20% 88%)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'hsl(40 30% 94%)';
          }}
        >
          <X style={{ height: '1.25rem', width: '1.25rem', color: 'hsl(200 25% 15%)' }} />
        </button>

        {/* Header Background */}
        <div
          style={{
            height: '4rem',
            background: 'linear-gradient(135deg, #1f847a 0%, #27a599 100%)',
            position: 'relative'
          }}
        />

        {/* Profile Content */}
        <div style={{ padding: '1.5rem' }}>
          {/* Avatar and Name */}
          <div style={{ marginTop: '-1rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div
              style={{
                width: '5rem',
                height: '5rem',
                borderRadius: '50%',
                backgroundColor: 'hsl(174 62% 32%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: '700',
                marginBottom: '1rem',
                border: '4px solid white',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
            >
              {agent.fullName?.[0] || 'A'}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <h2 className="text-xl font-bold" style={{ color: 'hsl(200 25% 15%)', margin: 0 }}>
                {agent.fullName}
              </h2>
              {agent.status === 'verified' && (
                <Shield style={{ height: '1.25rem', width: '1.25rem', color: 'hsl(152 60% 40%)' }} />
              )}
            </div>

            <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)', margin: 0 }}>
              {agent.company || 'Independent Agent'}
            </p>
          </div>

          {/* Verification Badge */}
          {agent.status === 'verified' && (
            <div
              style={{
                backgroundColor: 'hsl(152 60% 40% / 0.1)',
                border: '1px solid hsl(152 60% 40% / 0.3)',
                borderRadius: '0.5rem',
                padding: '0.75rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Shield style={{ height: '1rem', width: '1rem', color: 'hsl(152 60% 40%)' }} />
              <span style={{ fontSize: '0.875rem', color: 'hsl(152 60% 35%)', fontWeight: '500' }}>
                Verified Agent
              </span>
            </div>
          )}

          {/* Rating Section */}
          {agent.average_rating && (
            <div
              style={{
                backgroundColor: 'hsl(40 30% 94%)',
                borderRadius: '0.75rem',
                padding: '1rem',
                marginBottom: '1.5rem'
              }}
            >
              <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)', margin: '0 0 0.5rem 0' }}>
                Agent Rating
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {renderStars(agent.average_rating)}
                </div>
                <div>
                  <span className="font-bold" style={{ color: 'hsl(200 25% 15%)', marginRight: '0.5rem' }}>
                    {agent.average_rating.toFixed(1)}
                  </span>
                  <span style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)' }}>
                    ({agent.total_reviews || 0} reviews)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Agent Fee */}
          <div
            style={{
              backgroundColor: 'white',
              border: '1px solid hsl(40 20% 88%)',
              borderRadius: '0.75rem',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}
          >
            <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)', margin: '0 0 0.5rem 0' }}>
              Agent Service Fee
            </p>
            <p className="text-lg font-bold" style={{ color: 'hsl(174 62% 32%)', margin: 0 }}>
              {agent.fee_percentage || agent.fee || 0}%
            </p>
          </div>

          {/* Contact Information */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'hsl(200 25% 15%)' }}>
              Contact Information
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {agent.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Mail style={{ height: '1rem', width: '1rem', color: 'hsl(200 15% 45%)' }} />
                  <span style={{ fontSize: '0.875rem', color: 'hsl(200 25% 15%)' }}>
                    {agent.email}
                  </span>
                </div>
              )}
              {agent.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Phone style={{ height: '1rem', width: '1rem', color: 'hsl(200 15% 45%)' }} />
                  <span style={{ fontSize: '0.875rem', color: 'hsl(200 25% 15%)' }}>
                    {agent.phone}
                  </span>
                </div>
              )}
              {agent.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <MapPin style={{ height: '1rem', width: '1rem', color: 'hsl(200 15% 45%)' }} />
                  <span style={{ fontSize: '0.875rem', color: 'hsl(200 25% 15%)' }}>
                    {agent.location}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* About Section */}
          {agent.bio && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 className="text-sm font-semibold mb-2" style={{ color: 'hsl(200 25% 15%)' }}>
                Bio
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)', lineHeight: '1.5', margin: 0 }}>
                {agent.bio}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            {/* <button
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: 'hsl(174 62% 32%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.875rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'hsl(174 62% 28%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'hsl(174 62% 32%)';
              }}
            >
              Contact Agent
            </button> */}
            <a
                href={`tel:${auth.phone || agent.phone}`}
                className="flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 active:scale-95 text-center"
                style={{ backgroundColor: '#1f847a' }}
              >
                Call Agent
              </a>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: 'white',
                color: 'hsl(174 62% 32%)',
                border: '1px solid hsl(40 20% 88%)',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.875rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'hsl(40 30% 94%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentProfileModal;
