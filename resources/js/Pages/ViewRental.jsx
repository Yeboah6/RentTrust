import React from 'react';
import { Home, MapPin, DollarSign, Calendar, User, Phone, Mail, Bed, Bath, CheckCircle2, X } from 'lucide-react';
import { usePage } from '@inertiajs/react';

const ViewRentals = ({ rental, setShowViewModal }) => {
  const { auth } = usePage().props;
  // Parse amenities if they're stored as JSON string
  let parsedAmenities = [];
  try {
    if (rental.amenities) {
      parsedAmenities = typeof rental.amenities === 'string' 
        ? JSON.parse(rental.amenities) 
        : rental.amenities;
    }
  } catch (e) {
    console.error('Error parsing amenities:', e);
    parsedAmenities = [];
  }

  // Handle images
  const images = rental.images || [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* Modal Overlay */}
      <div 
        className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={() => setShowViewModal && setShowViewModal(false)}
        style={{ animation: 'fadeIn 0.2s ease-out' }}
      >
        <div 
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10" style={{ borderColor: 'hsl(40 20% 88%)' }}>
            <div>
              <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'hsl(200 25% 15%)' }}>
                {rental.title}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-4 w-4" style={{ color: 'hsl(200 15% 45%)' }} />
                <span className="text-sm" style={{ color: 'hsl(200 15% 45%)' }}>
                  {rental.area}, {rental.city}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowViewModal && setShowViewModal(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-6 w-6" style={{ color: 'hsl(200 15% 45%)' }} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Images Gallery */}
            {images.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold" style={{ color: 'hsl(200 25% 15%)' }}>
                  Property Images
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {images.map((image, index) => (
                    <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                      <img 
                        src={`/storage/rental_images/${image}`} 
                        alt={`Property ${index + 1}`} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Property Details Section */}
            <div className="p-5 rounded-lg" style={{ backgroundColor: 'hsl(40 30% 94%)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Home className="h-5 w-5" style={{ color: 'hsl(174 62% 32%)' }} />
                <h3 className="text-lg font-semibold" style={{ color: 'hsl(200 25% 15%)' }}>
                  Property Details
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium block mb-1" style={{ color: 'hsl(200 15% 45%)' }}>
                      Property Type
                    </span>
                    <span className="text-base" style={{ color: 'hsl(200 25% 15%)' }}>
                      {rental.property_type || rental.propertyType}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium block mb-1" style={{ color: 'hsl(200 15% 45%)' }}>
                      Location
                    </span>
                    <span className="text-base" style={{ color: 'hsl(200 25% 15%)' }}>
                      {rental.area}, {rental.city}
                    </span>
                  </div>

                  {rental.address && (
                    <div>
                      <span className="text-sm font-medium block mb-1" style={{ color: 'hsl(200 15% 45%)' }}>
                        Full Address
                      </span>
                      <span className="text-base" style={{ color: 'hsl(200 25% 15%)' }}>
                        {rental.address}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5" style={{ color: 'hsl(174 62% 32%)' }} />
                    <div>
                      <span className="text-sm font-medium block" style={{ color: 'hsl(200 15% 45%)' }}>
                        Bedrooms
                      </span>
                      <span className="text-base font-semibold" style={{ color: 'hsl(200 25% 15%)' }}>
                        {rental.bedrooms}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5" style={{ color: 'hsl(174 62% 32%)' }} />
                    <div>
                      <span className="text-sm font-medium block" style={{ color: 'hsl(200 15% 45%)' }}>
                        Bathrooms
                      </span>
                      <span className="text-base font-semibold" style={{ color: 'hsl(200 25% 15%)' }}>
                        {rental.bathrooms || '0'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="p-5 rounded-lg" style={{ backgroundColor: 'hsl(174 62% 32% / 0.1)', border: '2px solid hsl(174 62% 32% / 0.3)' }}>
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-5 w-5" style={{ color: 'hsl(174 62% 32%)' }} />
                <h3 className="text-lg font-semibold" style={{ color: 'hsl(200 25% 15%)' }}>
                  Pricing Information
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium block mb-1" style={{ color: 'hsl(200 15% 45%)' }}>
                    Monthly Rent Range
                  </span>
                  <span className="text-2xl font-bold" style={{ color: 'hsl(174 62% 32%)' }}>
                    GH₵{Number(rental.rent_min || rental.rentMin || 0).toLocaleString()} - 
                    GH₵{Number(rental.rent_max || rental.rentMax || 0).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" style={{ color: 'hsl(174 62% 32%)' }} />
                  <div>
                    <span className="text-sm font-medium block" style={{ color: 'hsl(200 15% 45%)' }}>
                      Advance Payment
                    </span>
                    <span className="text-base font-semibold" style={{ color: 'hsl(200 25% 15%)' }}>
                      {rental.advance_duration || rental.advanceDuration} {(rental.advance_duration || rental.advanceDuration) === '1' ? 'Year' : 'Years'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities Section */}
            {parsedAmenities.length > 0 && (
              <div className="p-5 rounded-lg" style={{ backgroundColor: 'hsl(40 30% 94%)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="h-5 w-5" style={{ color: 'hsl(174 62% 32%)' }} />
                  <h3 className="text-lg font-semibold" style={{ color: 'hsl(200 25% 15%)' }}>
                    Amenities
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {parsedAmenities.map((amenity, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium"
                      style={{ 
                        backgroundColor: 'hsl(174 62% 32% / 0.1)',
                        color: 'hsl(174 62% 32%)',
                        border: '1px solid hsl(174 62% 32% / 0.2)'
                      }}
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description Section */}
            {rental.description && (
              <div className="p-5 rounded-lg" style={{ backgroundColor: 'hsl(40 30% 94%)' }}>
                <h3 className="text-lg font-semibold mb-3" style={{ color: 'hsl(200 25% 15%)' }}>
                  Description
                </h3>
                <p className="text-base leading-relaxed whitespace-pre-line" style={{ color: 'hsl(200 15% 45%)' }}>
                  {rental.description}
                </p>
              </div>
            )}

            {/* Contact Information Section */}
            <div className="p-5 rounded-lg" style={{ backgroundColor: 'hsl(152 60% 40% / 0.1)', border: '2px solid hsl(152 60% 40% / 0.2)' }}>
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5" style={{ color: 'hsl(152 60% 40%)' }} />
                <h3 className="text-lg font-semibold" style={{ color: 'hsl(200 25% 15%)' }}>
                  Contact Agent
                </h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5" style={{ color: 'hsl(200 15% 45%)' }} />
                  <div>
                    <span className="text-sm font-medium block" style={{ color: 'hsl(200 15% 45%)' }}>
                      Agent Name
                    </span>
                    <span className="text-base font-semibold" style={{ color: 'hsl(200 25% 15%)' }}>
                      {rental.agent_name || rental.agentName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5" style={{ color: 'hsl(200 15% 45%)' }} />
                  <div>
                    <span className="text-sm font-medium block" style={{ color: 'hsl(200 15% 45%)' }}>
                      Phone Number
                    </span>
                    <a 
                      href={`tel:${rental.agent_phone || rental.agentPhone}`}
                      className="text-base font-semibold hover:underline"
                      style={{ color: 'hsl(174 62% 32%)' }}
                    >
                      {rental.agent_phone || rental.agentPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5" style={{ color: 'hsl(200 15% 45%)' }} />
                  <div>
                    <span className="text-sm font-medium block" style={{ color: 'hsl(200 15% 45%)' }}>
                      Email Address
                    </span>
                    <a 
                      href={`mailto:${rental.agent_email || rental.agentEmail}`}
                      className="text-base font-semibold hover:underline"
                      style={{ color: 'hsl(174 62% 32%)' }}
                    >
                      {rental.agent_email || rental.agentEmail}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex gap-3 pt-4 border-t" style={{ borderColor: 'hsl(40 20% 88%)' }}>
              <button
                onClick={() => setShowViewModal && setShowViewModal(false)}
                className="flex-1 px-6 py-3 rounded-lg font-semibold transition-colors border"
                style={{ 
                  borderColor: 'hsl(40 20% 88%)',
                  color: 'hsl(200 25% 15%)',
                  backgroundColor: 'white'
                }}
              >
                Close
              </button>
              { auth?.super && (
                <a
                href={`tel:${rental.agent_phone || rental.agentPhone}`}
                className="flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 active:scale-95 text-center"
                style={{ backgroundColor: 'hsl(174 62% 32%)' }}
              >
                Call Agent
              </a>
              ) }
              
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewRentals;