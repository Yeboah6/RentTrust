import React, { useState, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Home, MapPin, DollarSign, Calendar, Image, FileText, CheckCircle2, AlertCircle, Upload, X } from 'lucide-react';

const AddRentalPage = ({ agentData, setShowAddListingModal, adminData, locations = [], propertyTypes = [], amenities = [] }) => {

  const { data, setData, post, transform, processing, errors, reset } = useForm({
    purpose: 'rent', // rent or sale
    title: '',
    propertyType: '',
    area: '',
    city: '',
    address: '',
    rentMin: '',
    rentMax: '',
    salePrice: '',
    advanceDuration: '1',
    bedrooms: '',
    bathrooms: '',
    amenities: [],
    images: [],
    description: '',
    agentName: agentData?.name || adminData?.name || '',
    agentPhone: agentData?.phone || adminData?.phone || '',
    agentEmail: agentData?.email || adminData?.email || '',
  });

  const { flash } = usePage().props;

  const names = (locations || []).map(l => l?.name)
  const PropertyNames = (propertyTypes || []).map(p => p?.name)
  const AmenityNames = (amenities || []).map(a => a?.name)

  useEffect(() => {
      if (flash?.toast) {
          showToast(flash.toast.type, flash.toast.title, flash.toast.message);
      }
  }, [flash?.toast]);

  const [images, setImages] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [toast, setToast] = useState(null);

  const handleAmenityToggle = (amenity) => {
    const updatedAmenities = data.amenities.includes(amenity)
      ? data.amenities.filter(a => a !== amenity)
      : [...data.amenities, amenity];
    setData('amenities', updatedAmenities);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        showToast("File too large", `${file.name} is larger than 5MB`, "error");
        return false;
      }
      return true;
    });

    // process the validated files into our preview format and update form
    const newImages = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      file: file,
      preview: URL.createObjectURL(file)
    }));
    
    const updatedImages = [...images, ...newImages].slice(0, 6);
    setImages(updatedImages);
    setData('images', updatedImages.map(img => img.file));
  };

  const handlePurposeChange = (value) => {
    setData('purpose', value);
    if (value === 'rent') {
      setData('salePrice', '');
    } else {
      setData('rentMin', '');
      setData('rentMax', '');
      setData('advanceDuration', '1');
    }
  };


  const removeImage = (id) => {
    const updatedImages = images.filter(img => img.id !== id);
    setImages(updatedImages);
    setData('images', updatedImages.map(img => img.file));
  };

  const showToast = (title, description, variant = "success") => {
    setToast({ title, description, variant });
    setTimeout(() => setToast(null), 3000);
  };

  const validateStep = (step) => {
    if (step === 1) {
      return data.title && data.propertyType && data.city && data.area;
    } else if (step === 2) {
      if (data.purpose === 'rent') {
        return data.rentMin && data.rentMax && data.bedrooms && data.advanceDuration;
      }
      // sale
      return data.salePrice && data.bedrooms;
    } else if (step === 3) {
      return data.agentName && data.agentPhone && data.agentEmail;
    }
    return true;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      showToast("Missing Information", "Please fill all required fields before proceeding.", "error");
    }
  };

  const handlePrevious = (e) => {
    e.preventDefault();
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };  

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      showToast("Missing Information", "Please fill all required fields.", "error");
      return;
    }

    // Convert amenities array to JSON string before sending and strip out fields
    // that aren't relevant to the chosen purpose.  In particular we don't want
    // `advanceDuration` to be submitted when the user is creating a sale listing
    // because the backend now enforces it only for rentals (see controller).
    transform((d) => {
      const payload = {
        ...d,
        amenities: JSON.stringify(d.amenities ?? []),
      };

      if (d.purpose === 'rent') {
        payload.rentMin = d.rentMin;
        payload.rentMax = d.rentMax;
        payload.advanceDuration = d.advanceDuration;
        payload.salePrice = null;
      } else {
        // sale
        payload.salePrice = d.salePrice;
        // make sure rental-specific values are omitted entirely
        delete payload.rentMin;
        delete payload.rentMax;
        delete payload.advanceDuration;
      }

      return payload;
    });

    // choose endpoint based on purpose (same for now but kept for clarity)
    const endpoint = "/rent"; // future might become "/sale" when route added
    post(endpoint, {
      forceFormData: true,
      onSuccess: () => {
        showToast("Listing Submitted", "Your rental listing has been submitted for review.", "success");
        reset();
        setImages([]);
        setCurrentStep(1);
        setTimeout(() => {
          if (setShowAddListingModal) setShowAddListingModal(false);
        }, 1500);
      },
      onError: (errors) => {
        console.error('Submission errors:', errors);
        showToast("Submission Failed", "Please correct the errors and try again.", "error");
      },
    });
  };

  const steps = [
    { number: 1, title: 'Property Details', icon: Home },
    { number: 2, title: 'Pricing & Features', icon: DollarSign },
    { number: 3, title: 'Contact Information', icon: FileText },
    { number: 4, title: 'Review & Submit', icon: CheckCircle2 }
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }
        
        input:focus, textarea:focus, select:focus {
          outline: none;
          ring: 2px;
          ring-color: hsl(174 62% 32%);
        }

        @media (max-width: 768px) {
          .modal-content { 
            max-height: 85vh !important; 
            margin: 0.5rem !important; 
            max-width: 95% !important;
          }
          
          .steps-container { 
            padding: clamp(0.75rem, 3vw, 1rem) clamp(0.5rem, 2vw, 1rem) !important;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          
          .step-icon { 
            width: clamp(2.25rem, 10vw, 3rem) !important; 
            height: clamp(2.25rem, 10vw, 3rem) !important;
          }
          
          .step-title { 
            font-size: clamp(0.625rem, 2vw, 0.75rem) !important;
            max-width: 4rem;
            text-align: center;
          }
          
          .step-connector { 
            flex: 1 !important; 
            min-width: clamp(1rem, 5vw, 2rem);
            margin: 0 clamp(0.25rem, 1vw, 0.5rem) !important;
          }
          
          .form-grid { 
            grid-template-columns: 1fr !important;
            gap: clamp(0.75rem, 3vw, 1rem) !important;
          }
          
          .amenities-grid { 
            grid-template-columns: repeat(2, 1fr) !important;
            gap: clamp(0.5rem, 2vw, 0.75rem) !important;
          }
          
          .images-grid { 
            grid-template-columns: repeat(2, 1fr) !important;
            gap: clamp(0.5rem, 2vw, 0.75rem) !important;
          }
          
          .action-button { 
            min-height: 44px; 
            -webkit-tap-highlight-color: transparent;
            padding: clamp(0.625rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem) !important;
            font-size: clamp(0.8125rem, 2.5vw, 0.875rem) !important;
            touch-action: manipulation;
          }
          
          .form-padding { 
            padding: clamp(0.75rem, 3vw, 1rem) !important;
          }

          .button-container {
            flex-direction: row;
            gap: clamp(0.5rem, 2vw, 1rem);
          }

          .button-container > button,
          .button-container > div {
            flex: 1;
          }
        }

        @media (max-width: 480px) {
          .amenities-grid { 
            grid-template-columns: 1fr !important;
          }
          
          .images-grid { 
            grid-template-columns: 1fr !important;
          }
          
          .review-grid { 
            grid-template-columns: 1fr !important;
          }

          .step-title {
            display: none !important;
          }

          .steps-wrapper {
            justify-content: space-between;
          }
        }

        @media (max-height: 600px) and (orientation: landscape) {
          .modal-content { 
            max-height: 75vh !important;
          }
          
          .steps-container { 
            padding: clamp(0.5rem, 2vw, 0.75rem) !important;
          }
        }

        @media (max-width: 768px) {
          input[type="text"],
          input[type="email"],
          input[type="number"],
          input[type="tel"],
          textarea,
          select { 
            font-size: 16px !important;
          }
        }

        @media (min-width: 481px) and (max-width: 768px) {
          .form-grid { 
            grid-template-columns: repeat(2, 1fr) !important;
          }
          
          .amenities-grid { 
            grid-template-columns: repeat(3, 1fr) !important;
          }
          
          .images-grid { 
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }

        @media (min-width: 769px) {
          .amenities-grid { 
            grid-template-columns: repeat(3, 1fr) !important;
          }
          
          .images-grid { 
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }

        @media (min-width: 1024px) {
          .modal-content { 
            max-width: 56rem !important;
          }
        }

        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: 'clamp(0.5rem, 2vw, 1rem)',
          right: 'clamp(0.5rem, 2vw, 1rem)',
          left: 'clamp(0.5rem, 2vw, auto)',
          backgroundColor: toast.variant === 'error' ? '#ef4444' : '#10b981',
          color: 'white',
          padding: 'clamp(0.75rem, 2vw, 1rem)',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          zIndex: 9999,
          maxWidth: '400px',
          animation: 'slideIn 0.3s ease-out',
          fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{toast.title}</div>
          <div style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>{toast.description}</div>
        </div>
      )}

      <div className="min-h-screen" style={{ backgroundColor: 'hsl(40 33% 98%)' }}>

        {/* Progress Steps */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto steps-container" style={{ 
            padding: 'clamp(0.75rem, 3vw, 1.5rem) clamp(0.75rem, 3vw, 1rem)'
          }}>
            <div className="steps-wrapper flex items-center max-w-3xl mx-auto">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center flex-shrink-0" style={{ gap: 'clamp(0.25rem, 1vw, 0.5rem)' }}>
                    <div 
                      className="step-icon rounded-full flex items-center justify-center font-semibold transition-all duration-300"
                      style={{
                        width: 'clamp(2.25rem, 10vw, 3rem)',
                        height: 'clamp(2.25rem, 10vw, 3rem)',
                        backgroundColor: currentStep >= step.number ? 'hsl(174 62% 32%)' : 'hsl(40 30% 94%)',
                        color: currentStep >= step.number ? 'white' : 'hsl(200 15% 45%)',
                        fontSize: 'clamp(0.75rem, 2.5vw, 1rem)'
                      }}
                    >
                      {currentStep > step.number ? (
                        <CheckCircle2 style={{ 
                          height: 'clamp(1.125rem, 4vw, 1.5rem)', 
                          width: 'clamp(1.125rem, 4vw, 1.5rem)' 
                        }} />
                      ) : (
                        <step.icon style={{ 
                          height: 'clamp(1.125rem, 4vw, 1.5rem)', 
                          width: 'clamp(1.125rem, 4vw, 1.5rem)' 
                        }} />
                      )}
                    </div>
                    <span 
                      className="step-title font-medium text-center leading-tight"
                      style={{ 
                        color: currentStep >= step.number ? 'hsl(174 62% 32%)' : 'hsl(200 15% 45%)',
                        fontSize: 'clamp(0.625rem, 2vw, 0.75rem)'
                      }}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div 
                      className="step-connector h-1 rounded transition-all duration-300"
                      style={{ 
                        flex: 1,
                        minWidth: 'clamp(1rem, 5vw, 2rem)',
                        margin: '0 clamp(0.25rem, 1vw, 0.5rem)',
                        backgroundColor: currentStep > step.number ? 'hsl(174 62% 32%)' : 'hsl(40 20% 88%)'
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="container mx-auto form-padding" style={{ 
          padding: 'clamp(1rem, 3vw, 2rem) clamp(0.75rem, 3vw, 1rem)'
        }}>
          <div className="max-w-3xl mx-auto modal-content">
            <div className="bg-white rounded-xl shadow-lg" style={{ 
              borderColor: 'hsl(40 20% 88%)',
              padding: 'clamp(1rem, 4vw, 2rem)'
            }}>
              <form onSubmit={handleSubmit}>
              {/* Step 1: Property Details */}
              {currentStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 3vw, 1.5rem)' }}>
                  <div>
                    <div className="flex gap-2 mb-4">
                      <button
                        type="button"
                        onClick={() => handlePurposeChange('rent')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${data.purpose === 'rent' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                      >
                        For Rent
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePurposeChange('sale')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${data.purpose === 'sale' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                      >
                        For Sale
                      </button>
                    </div>
                    <h2 className="font-bold mb-1 tracking-tight" style={{ 
                      color: 'hsl(200 25% 15%)',
                      fontSize: 'clamp(1.125rem, 4vw, 1.5rem)'
                    }}>
                      Property Details
                    </h2>
                    <p style={{ 
                      color: 'hsl(200 15% 45%)',
                      fontSize: 'clamp(0.8125rem, 2.5vw, 0.875rem)'
                    }}>
                      Tell us about the property you're listing
                    </p>
                  </div>

                  <div>
                    <label className="block font-medium mb-2" style={{ 
                      color: 'hsl(200 25% 15%)',
                      fontSize: 'clamp(0.8125rem, 2.5vw, 0.875rem)'
                    }}>
                      Property Title *
                    </label>
                    <input
                      type="text"
                      value={data.title}
                      onChange={(e) => setData('title', e.target.value)}
                      placeholder="e.g., 2 Bedroom Self-Contained Apartment"
                      className="w-full border rounded-lg focus:ring-2 transition-all"
                      style={{ 
                        borderColor: errors.title ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)',
                        padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1rem)',
                        fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
                      }}
                    />
                    {errors.title && (
                      <p className="mt-1 flex items-center gap-1" style={{ 
                        color: 'hsl(0 72% 51%)',
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
                      }}>
                        <AlertCircle style={{ height: '1rem', width: '1rem' }} /> {errors.title}
                      </p>
                    )}
                  </div>

                  <div className="grid form-grid" style={{ 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 'clamp(0.75rem, 3vw, 1rem)'
                  }}>
                    <div>
                      <label className="block font-medium mb-2" style={{ 
                        color: 'hsl(200 25% 15%)',
                        fontSize: 'clamp(0.8125rem, 2.5vw, 0.875rem)'
                      }}>
                        Property Type *
                      </label>
                      <select
                        value={data.propertyType}
                        onChange={(e) => setData('propertyType', e.target.value)}
                        className="w-full border rounded-lg focus:ring-2 transition-all appearance-none"
                        style={{ 
                          borderColor: errors.propertyType ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)',
                          padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1rem)',
                          fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
                        }}
                      >
                        <option value="">Select type</option>
                        {/* <option value={PropertyNames}>{PropertyNames}</option> */}
                        {PropertyNames.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      {errors.propertyType && (
                        <p className="mt-1 flex items-center gap-1" style={{ 
                          color: 'hsl(0 72% 51%)',
                          fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
                        }}>
                          <AlertCircle style={{ height: '1rem', width: '1rem' }} /> {errors.propertyType}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block font-medium mb-2" style={{ 
                        color: 'hsl(200 25% 15%)',
                        fontSize: 'clamp(0.8125rem, 2.5vw, 0.875rem)'
                      }}>
                        Region *
                      </label>
                      <select
                        value={data.city}
                        onChange={(e) => setData('city', e.target.value)}
                        className="w-full border rounded-lg focus:ring-2 transition-all appearance-none"
                        style={{ 
                          borderColor: errors.city ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)',
                          padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1rem)',
                          fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
                        }}
                      >
                        <option value="">Select Region</option>
                        {names.map(city => (
                          <option key={city} value={city}>
                              {city}
                          </option>
                        ))}
                      </select>
                      {errors.city && (
                        <p className="mt-1 flex items-center gap-1" style={{ 
                          color: 'hsl(0 72% 51%)',
                          fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
                        }}>
                          <AlertCircle style={{ height: '1rem', width: '1rem' }} /> {errors.city}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium mb-2" style={{ 
                      color: 'hsl(200 25% 15%)',
                      fontSize: 'clamp(0.8125rem, 2.5vw, 0.875rem)'
                    }}>
                      Area/Neighborhood *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute top-1/2 -translate-y-1/2" style={{ 
                        left: 'clamp(0.625rem, 2vw, 0.75rem)',
                        height: 'clamp(1.125rem, 3vw, 1.25rem)',
                        width: 'clamp(1.125rem, 3vw, 1.25rem)',
                        color: 'hsl(200 15% 45%)'
                      }} />
                      <input
                        type="text"
                        value={data.area}
                        onChange={(e) => setData('area', e.target.value)}
                        placeholder="e.g., East Legon, Spintex"
                        className="w-full border rounded-lg focus:ring-2 transition-all"
                        style={{ 
                          borderColor: errors.area ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)',
                          paddingLeft: 'clamp(2.25rem, 8vw, 2.5rem)',
                          paddingRight: 'clamp(0.75rem, 3vw, 1rem)',
                          paddingTop: 'clamp(0.625rem, 2vw, 0.75rem)',
                          paddingBottom: 'clamp(0.625rem, 2vw, 0.75rem)',
                          fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
                        }}
                      />
                    </div>
                    {errors.area && (
                      <p className="mt-1 flex items-center gap-1" style={{ 
                        color: 'hsl(0 72% 51%)',
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
                      }}>
                        <AlertCircle style={{ height: '1rem', width: '1rem' }} /> {errors.area}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block font-medium mb-2" style={{ 
                      color: 'hsl(200 25% 15%)',
                      fontSize: 'clamp(0.8125rem, 2.5vw, 0.875rem)'
                    }}>
                      Full Address
                    </label>
                    <textarea
                      value={data.address}
                      onChange={(e) => setData('address', e.target.value)}
                      placeholder="Enter the complete address (optional)"
                      rows={3}
                      className="w-full border rounded-lg focus:ring-2 transition-all resize-none"
                      style={{ 
                        borderColor: 'hsl(40 20% 88%)',
                        padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1rem)',
                        fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Pricing & Features */}
              {currentStep === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 3vw, 1.5rem)' }}>
                  <div>
                    <h2 className="font-bold mb-1 tracking-tight" style={{ 
                      color: 'hsl(200 25% 15%)',
                      fontSize: 'clamp(1.125rem, 4vw, 1.5rem)'
                    }}>
                      Pricing & Features
                    </h2>
                    <p style={{ 
                      color: 'hsl(200 15% 45%)',
                      fontSize: 'clamp(0.8125rem, 2.5vw, 0.875rem)'
                    }}>
                      {data.purpose === 'rent' ? 'Help tenants understand the cost and features' : 'Set the sale price and highlight key features'}
                    </p>
                  </div>

                  {data.purpose === 'rent' ? (
                    <>
                      <div className="grid form-grid" style={{ 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: 'clamp(0.75rem, 3vw, 1rem)'
                      }}>
                        <div>
                          <label className="block font-medium mb-2" style={{ 
                            color: 'hsl(200 25% 15%)',
                            fontSize: 'clamp(0.8125rem, 2.5vw, 0.875rem)'
                          }}>
                            Rent Minimum (GH₵) *
                          </label>
                          <div className="relative">
                            <DollarSign className="absolute top-1/2 -translate-y-1/2" style={{ 
                              left: 'clamp(0.625rem, 2vw, 0.75rem)',
                              height: 'clamp(1.125rem, 3vw, 1.25rem)',
                              width: 'clamp(1.125rem, 3vw, 1.25rem)',
                              color: 'hsl(200 15% 45%)'
                            }} />
                            <input
                              type="number"
                              value={data.rentMin}
                              onChange={(e) => setData('rentMin', e.target.value)}
                              placeholder="1500"
                              className="w-full border rounded-lg focus:ring-2 transition-all"
                              style={{ 
                                borderColor: errors.rentMin ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)',
                                paddingLeft: 'clamp(2.25rem, 8vw, 2.5rem)',
                                paddingRight: 'clamp(0.75rem, 3vw, 1rem)',
                                paddingTop: 'clamp(0.625rem, 2vw, 0.75rem)',
                                paddingBottom: 'clamp(0.625rem, 2vw, 0.75rem)',
                                fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
                              }}
                            />
                          </div>
                          {errors.rentMin && (
                            <p className="mt-1 flex items-center gap-1" style={{ 
                              color: 'hsl(0 72% 51%)',
                              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
                            }}>
                              <AlertCircle style={{ height: '1rem', width: '1rem' }} /> {errors.rentMin}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block font-medium mb-2" style={{ 
                            color: 'hsl(200 25% 15%)',
                            fontSize: 'clamp(0.8125rem, 2.5vw, 0.875rem)'
                          }}>
                            Rent Maximum (GH₵) *
                          </label>
                          <div className="relative">
                            <DollarSign className="absolute top-1/2 -translate-y-1/2" style={{ 
                              left: 'clamp(0.625rem, 2vw, 0.75rem)',
                              height: 'clamp(1.125rem, 3vw, 1.25rem)',
                              width: 'clamp(1.125rem, 3vw, 1.25rem)',
                              color: 'hsl(200 15% 45%)'
                            }} />
                            <input
                              type="number"
                              value={data.rentMax}
                              onChange={(e) => setData('rentMax', e.target.value)}
                              placeholder="2500"
                              className="w-full border rounded-lg focus:ring-2 transition-all"
                              style={{ 
                                borderColor: errors.rentMax ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)',
                                paddingLeft: 'clamp(2.25rem, 8vw, 2.5rem)',
                                paddingRight: 'clamp(0.75rem, 3vw, 1rem)',
                                paddingTop: 'clamp(0.625rem, 2vw, 0.75rem)',
                                paddingBottom: 'clamp(0.625rem, 2vw, 0.75rem)',
                                fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
                              }}
                            />
                          </div>
                          {errors.rentMax && (
                            <p className="mt-1 flex items-center gap-1" style={{ 
                              color: 'hsl(0 72% 51%)',
                              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
                            }}>
                              <AlertCircle style={{ height: '1rem', width: '1rem' }} /> {errors.rentMax}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block font-medium mb-2" style={{ 
                          color: 'hsl(200 25% 15%)',
                          fontSize: 'clamp(0.8125rem, 2.5vw, 0.875rem)'
                        }}>
                          Advance Duration *
                        </label>
                        <div className="relative">
                          <Calendar className="absolute top-1/2 -translate-y-1/2" style={{ 
                            left: 'clamp(0.625rem, 2vw, 0.75rem)',
                            height: 'clamp(1.125rem, 3vw, 1.25rem)',
                            width: 'clamp(1.125rem, 3vw, 1.25rem)',
                            color: 'hsl(200 15% 45%)'
                          }} />
                          <select
                            value={data.advanceDuration}
                            onChange={(e) => setData('advanceDuration', e.target.value)}
                            className="w-full border rounded-lg focus:ring-2 transition-all appearance-none"
                            style={{ 
                              borderColor: 'hsl(40 20% 88%)',
                              paddingLeft: 'clamp(2.25rem, 8vw, 2.5rem)',
                              paddingRight: 'clamp(0.75rem, 3vw, 1rem)',
                              paddingTop: 'clamp(0.625rem, 2vw, 0.75rem)',
                              paddingBottom: 'clamp(0.625rem, 2vw, 0.75rem)',
                              fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
                            }}
                          >
                            <option value="1">1 Year</option>
                            <option value="2">2 Years</option>
                            <option value="3">3 Years</option>
                            <option value="4">4 Years</option>
                            <option value="5">5 Years</option>
                          </select>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="block font-medium mb-2" style={{ 
                        color: 'hsl(200 25% 15%)',
                        fontSize: 'clamp(0.8125rem, 2.5vw, 0.875rem)'
                      }}>
                        Sale Price (GH₵) *
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute top-1/2 -translate-y-1/2" style={{ 
                          left: 'clamp(0.625rem, 2vw, 0.75rem)',
                          height: 'clamp(1.125rem, 3vw, 1.25rem)',
                          width: 'clamp(1.125rem, 3vw, 1.25rem)',
                          color: 'hsl(200 15% 45%)'
                        }} />
                        <input
                          type="number"
                          value={data.salePrice}
                          onChange={(e) => setData('salePrice', e.target.value)}
                          placeholder="250000"
                          className="w-full border rounded-lg focus:ring-2 transition-all"
                          style={{ 
                            borderColor: errors.salePrice ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)',
                            paddingLeft: 'clamp(2.25rem, 8vw, 2.5rem)',
                            paddingRight: 'clamp(0.75rem, 3vw, 1rem)',
                            paddingTop: 'clamp(0.625rem, 2vw, 0.75rem)',
                            paddingBottom: 'clamp(0.625rem, 2vw, 0.75rem)',
                            fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
                          }}
                        />
                      </div>
                      {errors.salePrice && (
                        <p className="mt-1 flex items-center gap-1" style={{ 
                          color: 'hsl(0 72% 51%)',
                          fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
                        }}>
                          <AlertCircle style={{ height: '1rem', width: '1rem' }} /> {errors.salePrice}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="grid form-grid" style={{ 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: 'clamp(0.75rem, 3vw, 1rem)'
                  }}>
                    <div>
                      <label className="block font-medium mb-2" style={{ 
                        color: 'hsl(200 25% 15%)',
                        fontSize: 'clamp(0.8125rem, 2.5vw, 0.875rem)'
                      }}>
                        Bedrooms *
                      </label>
                      <input
                        type="number"
                        value={data.bedrooms}
                        onChange={(e) => setData('bedrooms', e.target.value)}
                        placeholder="2"
                        min="0"
                        className="w-full border rounded-lg focus:ring-2 transition-all"
                        style={{ 
                          borderColor: errors.bedrooms ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)',
                          padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1rem)',
                          fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
                        }}
                      />
                      {errors.bedrooms && (
                        <p className="mt-1 flex items-center gap-1" style={{ 
                          color: 'hsl(0 72% 51%)',
                          fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
                        }}>
                          <AlertCircle style={{ height: '1rem', width: '1rem' }} /> {errors.bedrooms}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block font-medium mb-2" style={{ 
                        color: 'hsl(200 25% 15%)',
                        fontSize: 'clamp(0.8125rem, 2.5vw, 0.875rem)'
                      }}>
                        Bathrooms
                      </label>
                      <input
                        type="number"
                        value={data.bathrooms}
                        onChange={(e) => setData('bathrooms', e.target.value)}
                        placeholder="1"
                        min="0"
                        className="w-full border rounded-lg focus:ring-2 transition-all"
                        style={{ 
                          borderColor: 'hsl(40 20% 88%)',
                          padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1rem)',
                          fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium mb-3" style={{ 
                      color: 'hsl(200 25% 15%)',
                      fontSize: 'clamp(0.8125rem, 2.5vw, 0.875rem)'
                    }}>
                      Amenities
                    </label>
                    <div className="grid amenities-grid" style={{
                      gap: 'clamp(0.5rem, 2vw, 0.75rem)'
                    }}>
                      {AmenityNames.map(amenity => (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => handleAmenityToggle(amenity)}
                          className="rounded-lg border font-medium transition-all"
                          style={{
                            borderColor: data.amenities.includes(amenity) ? 'hsl(174 62% 32%)' : 'hsl(40 20% 88%)',
                            backgroundColor: data.amenities.includes(amenity) ? 'hsl(174 62% 32% / 0.1)' : 'white',
                            color: data.amenities.includes(amenity) ? 'hsl(174 62% 32%)' : 'hsl(200 25% 15%)',
                            padding: 'clamp(0.5rem, 2vw, 0.625rem) clamp(0.75rem, 3vw, 1rem)',
                            fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                            minHeight: '44px',
                            touchAction: 'manipulation'
                          }}
                        >
                          {data.amenities.includes(amenity) && <CheckCircle2 className="inline mr-1" style={{ height: '1rem', width: '1rem' }} />}
                          {amenity}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium mb-2" style={{ 
                      color: 'hsl(200 25% 15%)',
                      fontSize: 'clamp(0.8125rem, 2.5vw, 0.875rem)'
                    }}>
                      Property Description
                    </label>
                    <textarea
                      value={data.description}
                      onChange={(e) => setData('description', e.target.value)}
                      placeholder="Describe the property, its condition, nearby facilities, and any other relevant details..."
                      rows={5}
                      className="w-full border rounded-lg focus:ring-2 transition-all resize-none"
                      style={{ 
                        borderColor: 'hsl(40 20% 88%)',
                        padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1rem)',
                        fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
                      }}
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-3" style={{ 
                      color: 'hsl(200 25% 15%)',
                      fontSize: 'clamp(0.8125rem, 2.5vw, 0.875rem)'
                    }}>
                      Property Images (Max 6)
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.75rem, 2vw, 1rem)' }}>
                      {images.length < 6 && (
                        <label className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg cursor-pointer transition-colors hover:border-opacity-60"
                          style={{ 
                            borderColor: 'hsl(174 62% 32%)', 
                            backgroundColor: 'hsl(174 62% 32% / 0.05)',
                            height: 'clamp(7rem, 20vw, 8rem)',
                            touchAction: 'manipulation'
                          }}
                        >
                          <div className="flex flex-col items-center justify-center">
                            <Upload style={{ 
                              height: 'clamp(1.5rem, 5vw, 2rem)', 
                              width: 'clamp(1.5rem, 5vw, 2rem)',
                              marginBottom: '0.5rem',
                              color: 'hsl(174 62% 32%)'
                            }} />
                            <p className="font-medium" style={{ 
                              color: 'hsl(174 62% 32%)',
                              fontSize: 'clamp(0.8125rem, 2.5vw, 0.875rem)'
                            }}>
                              Click to upload images
                            </p>
                            <p style={{ 
                              color: 'hsl(200 15% 45%)',
                              fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)'
                            }}>
                              PNG, JPG up to 5MB
                            </p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                          />
                        </label>
                      )}

                      {images.length > 0 && (
                        <div className="grid images-grid">
                          {images.map(image => (
                            <div key={image.id} className="relative group">
                              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                                <img src={image.preview} alt={image.name} className="w-full h-full object-cover" />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeImage(image.id)}
                                className="absolute rounded-full transition-opacity"
                                style={{ 
                                  backgroundColor: 'hsl(0 72% 51%)',
                                  top: 'clamp(0.375rem, 2vw, 0.5rem)',
                                  right: 'clamp(0.375rem, 2vw, 0.5rem)',
                                  padding: 'clamp(0.25rem, 1vw, 0.375rem)',
                                  opacity: 0.9,
                                  minHeight: '32px',
                                  minWidth: '32px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  touchAction: 'manipulation'
                                }}
                              >
                                <X style={{ height: '1rem', width: '1rem', color: 'white' }} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Contact Information */}
              {currentStep === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 3vw, 1.5rem)' }}>
                  <div>
                    <h2 className="font-bold mb-1 tracking-tight" style={{ 
                      color: 'hsl(200 25% 15%)',
                      fontSize: 'clamp(1.125rem, 4vw, 1.5rem)'
                    }}>
                      Contact Information
                    </h2>
                    <p style={{ color: 'hsl(200 15% 45%)', fontSize: 'clamp(0.8125rem, 2.5vw, 0.875rem)' }}>
                      {data.purpose === 'rent' ? 'How should tenants reach you?' : 'How should buyers reach you?'}
                    </p>
                  </div>

                  <div 
                    className="rounded-lg"
                    style={{ 
                      backgroundColor: 'hsl(38 92% 50% / 0.1)', 
                      border: '1px solid hsl(38 92% 50% / 0.2)',
                      padding: 'clamp(0.75rem, 3vw, 1rem)'
                    }}
                  >
                    <p style={{ 
                      color: 'hsl(200 25% 10%)',
                      fontSize: 'clamp(0.8125rem, 2.5vw, 0.875rem)'
                    }}>
                      <strong>⚠️ Important:</strong> Your contact information will be visible to interested tenants. 
                      Make sure it's accurate and up-to-date.
                    </p>
                  </div>

                  {/* Agent Name */}
                  <div>
                    <label className="block font-medium mb-2" style={{ 
                      color: 'hsl(200 25% 15%)',
                      fontSize: 'clamp(0.8125rem, 2.5vw, 0.875rem)'
                    }}>
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={data.agentName}
                      onChange={(e) => setData('agentName', e.target.value)}
                      className="w-full border rounded-lg focus:ring-2 transition-all"
                      style={{ 
                        borderColor: errors.agentName ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)',
                        padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1rem)',
                        fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
                      }}
                    />
                    {errors.agentName && (
                      <p className="mt-1 flex items-center gap-1" style={{ 
                        color: 'hsl(0 72% 51%)',
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
                      }}>
                        <AlertCircle style={{ height: '1rem', width: '1rem' }} /> {errors.agentName}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block font-medium mb-2" style={{ 
                      color: 'hsl(200 25% 15%)',
                      fontSize: 'clamp(0.8125rem, 2.5vw, 0.875rem)'
                    }}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={data.agentPhone}
                      onChange={(e) => setData('agentPhone', e.target.value)}
                      className="w-full border rounded-lg focus:ring-2 transition-all"
                      style={{ 
                        borderColor: errors.agentPhone ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)',
                        padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1rem)',
                        fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
                      }}
                    />
                    {errors.agentPhone && (
                      <p className="mt-1 flex items-center gap-1" style={{ 
                        color: 'hsl(0 72% 51%)',
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
                      }}>
                        <AlertCircle style={{ height: '1rem', width: '1rem' }} /> {errors.agentPhone}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block font-medium mb-2" style={{ 
                      color: 'hsl(200 25% 15%)',
                      fontSize: 'clamp(0.8125rem, 2.5vw, 0.875rem)'
                    }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={data.agentEmail}
                      onChange={(e) => setData('agentEmail', e.target.value)}
                      className="w-full border rounded-lg focus:ring-2 transition-all"
                      style={{ 
                        borderColor: errors.agentEmail ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)',
                        padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1rem)',
                        fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
                      }}
                    />
                    {errors.agentEmail && (
                      <p className="mt-1 flex items-center gap-1" style={{ 
                        color: 'hsl(0 72% 51%)',
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
                      }}>
                        <AlertCircle style={{ height: '1rem', width: '1rem' }} /> {errors.agentEmail}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {currentStep === 4 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 3vw, 1.5rem)' }}>
                  <div>
                    <h2 className="font-bold mb-1 tracking-tight" style={{ 
                      color: 'hsl(200 25% 15%)',
                      fontSize: 'clamp(1.125rem, 4vw, 1.5rem)'
                    }}>
                      Review Your Listing
                    </h2>
                    <p style={{ 
                      color: 'hsl(200 15% 45%)',
                      fontSize: 'clamp(0.8125rem, 2.5vw, 0.875rem)'
                    }}>
                      Please review all details before submitting
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.75rem, 2vw, 1rem)' }}>
                    <div className="rounded-lg" style={{ 
                      backgroundColor: 'hsl(40 30% 94%)',
                      padding: 'clamp(0.75rem, 3vw, 1rem)'
                    }}>
                      <h3 className="font-semibold mb-3" style={{ 
                        color: 'hsl(200 25% 15%)',
                        fontSize: 'clamp(0.9375rem, 2.5vw, 1rem)'
                      }}>Property Details</h3>
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 'clamp(0.5rem, 2vw, 0.75rem)',
                        fontSize: 'clamp(0.8125rem, 2.5vw, 0.875rem)'
                      }}>
                        <div className="flex justify-between gap-2">
                          <span style={{ color: 'hsl(200 15% 45%)' }}>Title:</span>
                          <span style={{ color: 'hsl(200 25% 15%)', textAlign: 'right' }}>{data.title}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span style={{ color: 'hsl(200 15% 45%)' }}>Type:</span>
                          <span style={{ color: 'hsl(200 25% 15%)', textAlign: 'right' }}>{data.propertyType}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span style={{ color: 'hsl(200 15% 45%)' }}>Location:</span>
                          <span style={{ color: 'hsl(200 25% 15%)', textAlign: 'right' }}>{data.area}, {data.city}</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg" style={{ 
                      backgroundColor: 'hsl(40 30% 94%)',
                      padding: 'clamp(0.75rem, 3vw, 1rem)'
                    }}>
                      <h3 className="font-semibold mb-3" style={{ 
                        color: 'hsl(200 25% 15%)',
                        fontSize: 'clamp(0.9375rem, 2.5vw, 1rem)'
                      }}>Pricing & Features</h3>
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 'clamp(0.5rem, 2vw, 0.75rem)',
                        fontSize: 'clamp(0.8125rem, 2.5vw, 0.875rem)'
                      }}>
                        {data.purpose === 'rent' ? (
                          <>
                            <div className="flex justify-between gap-2">
                              <span style={{ color: 'hsl(200 15% 45%)' }}>Monthly Rent:</span>
                              <span className="font-semibold" style={{ color: 'hsl(174 62% 32%)', textAlign: 'right' }}>
                                GH₵{data.rentMin ? Number(data.rentMin).toLocaleString() : '0'} - 
                                 GH₵{data.rentMax ? Number(data.rentMax).toLocaleString() : '0'}
                              </span>
                            </div>
                            <div className="flex justify-between gap-2">
                              <span style={{ color: 'hsl(200 15% 45%)' }}>Advance Duration:</span>
                              <span style={{ color: 'hsl(200 25% 15%)', textAlign: 'right' }}>
                                {data.advanceDuration} {data.advanceDuration === '1' ? 'Year' : 'Years'}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="flex justify-between gap-2">
                            <span style={{ color: 'hsl(200 15% 45%)' }}>Sale Price:</span>
                            <span className="font-semibold" style={{ color: 'hsl(174 62% 32%)', textAlign: 'right' }}>
                              GH₵{data.salePrice ? Number(data.salePrice).toLocaleString() : '0'}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between gap-2">
                          <span style={{ color: 'hsl(200 15% 45%)' }}>Bedrooms:</span>
                          <span style={{ color: 'hsl(200 25% 15%)', textAlign: 'right' }}>{data.bedrooms || '0'}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span style={{ color: 'hsl(200 15% 45%)' }}>Bathrooms:</span>
                          <span style={{ color: 'hsl(200 25% 15%)', textAlign: 'right' }}>{data.bathrooms || '0'}</span>
                        </div>
                        {data.amenities.length > 0 && (
                          <div className="pt-2 mt-2 border-t" style={{ borderColor: 'hsl(40 20% 88%)' }}>
                            <span className="block mb-2" style={{ color: 'hsl(200 15% 45%)' }}>Amenities:</span>
                            <div className="flex flex-wrap gap-2">
                              {data.amenities.map(amenity => (
                                <span 
                                  key={amenity}
                                  className="rounded"
                                  style={{ 
                                    backgroundColor: 'hsl(174 62% 32% / 0.1)',
                                    color: 'hsl(174 62% 32%)',
                                    padding: 'clamp(0.25rem, 1vw, 0.375rem) clamp(0.5rem, 2vw, 0.625rem)',
                                    fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)',
                                    fontWeight: '500'
                                  }}
                                >
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="rounded-lg" style={{ 
                      backgroundColor: 'hsl(40 30% 94%)',
                      padding: 'clamp(0.75rem, 3vw, 1rem)'
                    }}>
                      <h3 className="font-semibold mb-3" style={{ 
                        color: 'hsl(200 25% 15%)',
                        fontSize: 'clamp(0.9375rem, 2.5vw, 1rem)'
                      }}>Contact Information</h3>
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 'clamp(0.5rem, 2vw, 0.75rem)',
                        fontSize: 'clamp(0.8125rem, 2.5vw, 0.875rem)'
                      }}>
                        <div className="flex justify-between gap-2">
                          <span style={{ color: 'hsl(200 15% 45%)' }}>Name:</span>
                          <span style={{ color: 'hsl(200 25% 15%)', textAlign: 'right' }}>{data.agentName}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span style={{ color: 'hsl(200 15% 45%)' }}>Phone:</span>
                          <span style={{ color: 'hsl(200 25% 15%)', textAlign: 'right' }}>{data.agentPhone}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span style={{ color: 'hsl(200 15% 45%)' }}>Email:</span>
                          <span style={{ color: 'hsl(200 25% 15%)', textAlign: 'right', wordBreak: 'break-word' }}>{data.agentEmail}</span>
                        </div>
                      </div>
                    </div>

                    {images.length > 0 && (
                      <div className="rounded-lg" style={{ 
                        backgroundColor: 'hsl(40 30% 94%)',
                        padding: 'clamp(0.75rem, 3vw, 1rem)'
                      }}>
                        <h3 className="font-semibold mb-3" style={{ 
                          color: 'hsl(200 25% 15%)',
                          fontSize: 'clamp(0.9375rem, 2.5vw, 1rem)'
                        }}>
                          Images ({images.length})
                        </h3>
                        <div className="grid images-grid review-grid" style={{ gap: 'clamp(0.5rem, 2vw, 0.75rem)' }}>
                          {images.map(image => (
                            <div key={image.id} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                              <img src={image.preview} alt={image.name} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div 
                    className="rounded-lg"
                    style={{ 
                      backgroundColor: 'hsl(152 60% 40% / 0.1)', 
                      border: '1px solid hsl(152 60% 40% / 0.2)',
                      padding: 'clamp(0.75rem, 3vw, 1rem)'
                    }}
                  >
                    <div style={{ display: 'flex', gap: 'clamp(0.5rem, 2vw, 0.75rem)' }}>
                      <CheckCircle2 className="flex-shrink-0" style={{ 
                        height: 'clamp(1.125rem, 3vw, 1.25rem)',
                        width: 'clamp(1.125rem, 3vw, 1.25rem)',
                        color: 'hsl(152 60% 40%)'
                      }} />
                      <div>
                        <p className="font-medium mb-1" style={{ 
                          color: 'hsl(200 25% 15%)',
                          fontSize: 'clamp(0.8125rem, 2.5vw, 0.875rem)'
                        }}>
                          What happens next?
                        </p>
                        <ul style={{ 
                          color: 'hsl(200 15% 45%)',
                          fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.25rem'
                        }}>
                          <li>• Our team will review your listing within 24 hours</li>
                          <li>• You'll receive a confirmation email once approved</li>
                          <li>• Your listing will be visible to thousands of tenants</li>
                          <li>• You can manage and update your listing anytime</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between button-container" style={{ 
                paddingTop: 'clamp(1rem, 3vw, 1.5rem)',
                marginTop: 'clamp(1.5rem, 4vw, 2rem)',
                borderTop: '1px solid hsl(40 20% 88%)'
              }}>
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={processing}
                    className="action-button rounded-lg font-semibold transition-colors border"
                    style={{ 
                      borderColor: 'hsl(40 20% 88%)',
                      color: 'hsl(200 25% 15%)',
                      padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
                      fontSize: 'clamp(0.8125rem, 2.5vw, 0.875rem)',
                      touchAction: 'manipulation'
                    }}
                  >
                    Previous
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={processing}
                    className="action-button rounded-lg font-semibold text-white transition-all duration-200 active:scale-95"
                    style={{ 
                      backgroundColor: 'hsl(174 62% 32%)',
                      padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
                      fontSize: 'clamp(0.8125rem, 2.5vw, 0.875rem)',
                      touchAction: 'manipulation'
                    }}
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={processing}
                    className="action-button rounded-lg font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50"
                    style={{ 
                      background: 'linear-gradient(135deg, hsl(38 92% 50%) 0%, hsl(30 90% 45%) 100%)',
                      color: 'hsl(200 25% 10%)',
                      padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
                      fontSize: 'clamp(0.8125rem, 2.5vw, 0.875rem)',
                      touchAction: 'manipulation'
                    }}
                  >
                    {processing ? 'Submitting...' : 'Submit Listing'}
                  </button>
                )}
              </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddRentalPage;