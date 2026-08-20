import React, { useState, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Home, MapPin, DollarSign, Calendar, Image, FileText, CheckCircle2, AlertCircle, Upload, X } from 'lucide-react';

const STEP_FIELDS = {
  1: ['title', 'propertyType', 'city', 'area', 'address'],
  2: ['rentMin', 'rentMax', 'advanceDuration', 'salePrice', 'bedrooms', 'bathrooms', 'amenities', 'images'],
  3: ['agentName', 'agentPhone', 'agentEmail'],
};

const FIELD_LABELS = {
  title: 'Property Title',
  propertyType: 'Property Type',
  city: 'Region',
  area: 'Area/Neighborhood',
  address: 'Address',
  rentMin: 'Rent Minimum',
  rentMax: 'Rent Maximum',
  advanceDuration: 'Advance Duration',
  salePrice: 'Sale Price',
  bedrooms: 'Bedrooms',
  bathrooms: 'Bathrooms',
  amenities: 'Amenities',
  images: 'Images',
  agentName: 'Your Name',
  agentPhone: 'Phone Number',
  agentEmail: 'Email Address',
};

const isFilled = (v) => v !== '' && v !== null && v !== undefined;
const fieldsForStep = (step) => STEP_FIELDS[step] ?? [];

const getInputStyle = (hasError) => ({
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: '0.65rem',
  border: `1px solid ${hasError ? 'rgba(255,107,107,0.55)' : 'hsl(40 20% 88%)'}`,
  backgroundColor: hasError ? 'rgba(255,107,107,0.04)' : 'white',
  color: 'hsl(200 25% 15%)',
  outline: 'none',
  fontSize: '0.9rem',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s, background-color 0.15s',
  fontFamily: 'inherit',
});

const labelStyle = { 
  display: 'grid', 
  gap: '0.4rem', 
  fontSize: '0.82rem', 
  color: 'hsl(200 25% 15%)',
  fontWeight: '600',
};

const ErrorMsg = ({ msg }) =>
  msg ? (
    <span style={{ color: 'hsl(0 72% 51%)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
      <span style={{ fontSize: '0.7rem' }}>✕</span> {msg}
    </span>
  ) : null;

const AddRentalPage = ({ agentData, setShowAddListingModal, adminData, locations = [], propertyTypes = [], amenities = [] }) => {
  const { data, setData, post, transform, processing, errors, reset } = useForm({
    purpose: 'rent',
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
  const names = (locations || []).map(l => l?.name);
  const PropertyNames = (propertyTypes || []).map(p => p?.name);
  const AmenityNames = (amenities || []).map(a => a?.name);

  useEffect(() => {
    if (flash?.toast) {
      showToast(flash.toast.type, flash.toast.title, flash.toast.message);
    }
  }, [flash?.toast]);

  const [images, setImages] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [toast, setToast] = useState(null);
  const [clientErrors, setClientErrors] = useState({});

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

    const newImages = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      file: file,
      preview: URL.createObjectURL(file)
    }));
    
    const updatedImages = [...images, ...newImages].slice(0, 6);
    setImages(updatedImages);
    setData('images', updatedImages.map(img => img.file));
    setClientErrors(prev => {
      const next = { ...prev };
      if (updatedImages.length > 0) delete next.images;
      return next;
    });
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
    const stepErrors = {};

    if (step === 1) {
      if (!isFilled(data.title)) stepErrors.title = 'Property title is required.';
      if (!isFilled(data.propertyType)) stepErrors.propertyType = 'Property type is required.';
      if (!isFilled(data.city)) stepErrors.city = 'Region is required.';
      if (!isFilled(data.area)) stepErrors.area = 'Area or neighborhood is required.';
    } else if (step === 2) {
      if (data.purpose === 'rent') {
        if (!isFilled(data.rentMin)) stepErrors.rentMin = 'Minimum rent is required.';
        if (!isFilled(data.rentMax)) stepErrors.rentMax = 'Maximum rent is required.';
        if (!isFilled(data.bedrooms)) stepErrors.bedrooms = 'Bedrooms is required.';
        if (!isFilled(data.bathrooms)) stepErrors.bathrooms = 'Bathrooms is required.';
        if (!data.images?.length) stepErrors.images = 'At least one photo is required.';
        if (!isFilled(data.advanceDuration)) stepErrors.advanceDuration = 'Advance duration is required.';
      } else {
        if (!isFilled(data.salePrice)) stepErrors.salePrice = 'Sale price is required.';
        if (!isFilled(data.bedrooms)) stepErrors.bedrooms = 'Bedrooms is required.';
        if (!isFilled(data.bathrooms)) stepErrors.bathrooms = 'Bathrooms is required.';
        if (!data.images?.length) stepErrors.images = 'At least one photo is required.';
      }
    } else if (step === 3) {
      if (!isFilled(data.agentName)) stepErrors.agentName = 'Your name is required.';
      if (!isFilled(data.agentPhone)) stepErrors.agentPhone = 'Phone number is required.';
      if (!isFilled(data.agentEmail)) stepErrors.agentEmail = 'Email address is required.';
    }

    setClientErrors(prev => {
      const next = { ...prev };
      fieldsForStep(step).forEach(field => delete next[field]);
      return { ...next, ...stepErrors };
    });

    return Object.keys(stepErrors).length === 0;
  };

  const getFieldError = (field) => clientErrors[field] || errors[field];
  const displayedErrors = { ...errors, ...clientErrors };
  const stepHasError = (step) => fieldsForStep(step).some((field) => Boolean(getFieldError(field)));

  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = (e) => {
    e.preventDefault();
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToStep = (step) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

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
        payload.salePrice = d.salePrice;
        delete payload.rentMin;
        delete payload.rentMax;
        delete payload.advanceDuration;
      }

      return payload;
    });

    const endpoint = adminData ? "/admin/rent" : "/rent";
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
      onError: (errs) => {
        const failingStep = [1, 2, 3].find((step) =>
          fieldsForStep(step).some((field) => Boolean(errs[field]))
        );
        if (failingStep) {
          setCurrentStep(failingStep);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showToast("Submission Failed", "Please fix the highlighted fields below and try again.", "error");
      },
    });
  };

  const steps = [
    { number: 1, title: 'Property Details', icon: Home },
    { number: 2, title: 'Pricing & Features', icon: DollarSign },
    { number: 3, title: 'Contact Information', icon: FileText },
    { number: 4, title: 'Review & Submit', icon: CheckCircle2 }
  ];

  const errorEntries = Object.entries(errors || {});
  const purposeAccent = data.purpose === 'sale' ? '#f59f0a' : '#1f847a';

  return (
    <div className="add-rental-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: '#00000094', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <style>{`
        .add-rental-overlay {
          align-items: flex-start;
          overflow-y: auto;
        }
        .add-rental-modal {
          width: 100%;
          max-width: 680px;
          border-radius: 1rem;
          background-color: white;
          color: hsl(200 25% 15%);
          box-shadow: 0 25px 80px rgba(0,0,0,0.15);
          overflow: hidden;
          max-height: 92vh;
          display: flex;
          flex-direction: column;
          margin: 0 auto;
        }
        .add-rental-header {
          padding: 1.5rem 1.5rem 1rem;
          border-bottom: 1px solid hsl(40 20% 88%);
          position: sticky;
          top: 0;
          background-color: white;
          z-index: 10;
        }
        .add-rental-steps {
          padding: .5rem;
          border-bottom: 1px solid #e7e2da;
          background-color: #fbfaf8;
        }
        .add-rental-body {
          padding: 1.5rem;
          overflow-y: auto;
          flex: 1;
        }
        .add-rental-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid hsl(40 20% 88%);
          background-color: hsl(40 30% 98%);
          display: flex;
          gap: 0.75rem;
          justify-content: space-between;
        }
        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .amenities-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }
        .images-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }

        @media (max-width: 640px) {
          .add-rental-overlay {
            padding: 0.5rem;
          }
          .add-rental-modal {
            max-height: 95vh;
            border-radius: 0.75rem;
            max-width: 100%;
          }
          .add-rental-header {
            padding: 1rem 1rem 0.75rem;
          }
          .add-rental-steps {
            padding: 0.75rem 1rem;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .add-rental-steps::-webkit-scrollbar {
            display: none;
          }
          .add-rental-body {
            padding: 1rem;
          }
          .add-rental-footer {
            padding: 0.75rem 1rem;
            flex-direction: column-reverse;
          }
          .add-rental-footer button {
            width: 100%;
          }
          .form-grid-2 {
            grid-template-columns: 1fr;
          }
          .amenities-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .images-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .amenities-grid {
            grid-template-columns: 1fr;
          }
          .images-grid {
            grid-template-columns: 1fr;
          }
          .step-label {
            display: none;
          }
        }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          left: 'auto',
          backgroundColor: toast.variant === 'error' ? '#ef4444' : '#10b981',
          color: 'white',
          padding: '1rem',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          zIndex: 9999,
          maxWidth: 'min(400px, 90vw)',
          animation: 'slideIn 0.3s ease-out',
          fontSize: '0.875rem'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{toast.title}</div>
          <div style={{ fontSize: '0.75rem' }}>{toast.description}</div>
        </div>
      )}

      <div className="add-rental-modal">
        {/* Header */}
        <div className="add-rental-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 'clamp(1.125rem, 3vw, 1.25rem)', fontWeight: 700 }}>
                {data.purpose === 'rent' ? 'Add Rental Listing' : 'Add Sale Listing'}
              </h2>
              <p style={{ margin: '0.5rem 0 0', color: 'hsl(200 15% 45%)', fontSize: '0.875rem' }}>
                Complete the steps below to list your property
              </p>
            </div>
            <button 
              type="button" 
              onClick={() => setShowAddListingModal?.(false)} 
              style={{ 
                border: 'none', 
                background: 'hsl(40 30% 94%)', 
                color: 'hsl(200 15% 45%)', 
                fontSize: '1.25rem', 
                cursor: 'pointer', 
                width: 36, 
                height: 36, 
                borderRadius: 8, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Steps Indicator */}
        <div className="add-rental-steps">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', minWidth: 'max-content' }}>
            {steps.map((step, index) => {
              const hasError = step.number !== 4 && stepHasError(step.number);
              return (
                <React.Fragment key={step.number}>
                  <button
                    type="button"
                    onClick={() => goToStep(step.number)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.4rem 0.6rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      backgroundColor: hasError ? 'hsl(0 72% 51% / 0.1)' : currentStep === step.number ? 'hsl(174 62% 32% / 0.1)' : 'transparent',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    <div style={{
                      width: '1.75rem',
                      height: '1.75rem',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: hasError ? 'hsl(0 72% 51%)' : currentStep >= step.number ? 'hsl(174 62% 32%)' : 'hsl(220 15% 88%)',
                      color: hasError || currentStep >= step.number ? 'white' : 'hsl(200 15% 45%)',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      flexShrink: 0,
                    }}>
                      {hasError ? <AlertCircle style={{ height: '0.875rem', width: '0.875rem' }} /> : currentStep > step.number ? <CheckCircle2 style={{ height: '0.875rem', width: '0.875rem' }} /> : step.number}
                    </div>
                    <span className="step-label" style={{ fontSize: '0.75rem', fontWeight: '600', color: hasError ? 'hsl(0 72% 51%)' : currentStep >= step.number ? 'hsl(174 62% 32%)' : 'hsl(200 15% 45%)', whiteSpace: 'nowrap' }}>
                      {step.title}
                    </span>
                  </button>
                  {index < steps.length - 1 && (
                    <div style={{ width: '1.5rem', height: 2, backgroundColor: currentStep > step.number ? '#1f847a' : '#dcdfe5', flexShrink: 0 }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Error Summary */}
        {errorEntries.length > 0 && (
          <div style={{ margin: '1rem 1.5rem 0', padding: '0.75rem 1rem', borderRadius: '0.65rem', border: '1px solid rgba(255,107,107,0.3)', backgroundColor: 'rgba(255,107,107,0.06)', display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
            <AlertCircle style={{ width: '1rem', height: '1rem', color: 'hsl(0 72% 51%)', flexShrink: 0, marginTop: '0.125rem' }} />
            <div>
              <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600, color: 'hsl(0 72% 51%)' }}>
                {errorEntries.length === 1 ? '1 issue needs your attention' : `${errorEntries.length} issues need your attention`}
              </p>
              <ul style={{ margin: '0.375rem 0 0', paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                {errorEntries.map(([field, message]) => {
                  const step = [1, 2, 3].find((s) => STEP_FIELDS[s].includes(field));
                  return (
                    <li key={field} style={{ fontSize: '0.75rem', color: 'hsl(200 25% 20%)' }}>
                      <button
                        type="button"
                        // onClick={() => step && goToStep(step)}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: step ? 'pointer' : 'default', color: 'inherit', textDecoration: step ? 'underline' : 'none', font: 'inherit' }}
                      >
                        <strong>{FIELD_LABELS[field] || field}:</strong> {message}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="add-rental-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Step 1: Property Details */}
          {currentStep === 1 && (
            <>
              {/* Purpose Toggle */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => handlePurposeChange('rent')}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '0.65rem',
                    border: data.purpose === 'rent' ? '2px solid hsl(174 62% 32%)' : '1px solid hsl(40 20% 88%)',
                    backgroundColor: data.purpose === 'rent' ? 'hsl(174 62% 32% / 0.1)' : 'white',
                    color: data.purpose === 'rent' ? 'hsl(174 62% 32%)' : 'hsl(200 25% 15%)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '0.875rem',
                  }}
                >
                  For Rent
                </button>
                <button
                  type="button"
                  onClick={() => handlePurposeChange('sale')}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '0.65rem',
                    border: data.purpose === 'sale' ? '2px solid hsl(38 92% 50%)' : '1px solid hsl(40 20% 88%)',
                    backgroundColor: data.purpose === 'sale' ? 'hsl(38 92% 50% / 0.1)' : 'white',
                    color: data.purpose === 'sale' ? 'hsl(38 92% 45%)' : 'hsl(200 25% 15%)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '0.875rem',
                  }}
                >
                  For Sale
                </button>
              </div>

              <label style={labelStyle}>
                Property Title *
                <input
                  type="text"
                  value={data.title}
                  onChange={(e) => setData('title', e.target.value)}
                  placeholder="e.g., 2 Bedroom Self-Contained Apartment"
                  style={getInputStyle(!!getFieldError('title'))}
                />
                <ErrorMsg msg={getFieldError('title')} />
              </label>

              <div className="form-grid-2">
                <label style={labelStyle}>
                  Property Type *
                  <select
                    value={data.propertyType}
                    onChange={(e) => setData('propertyType', e.target.value)}
                    style={getInputStyle(!!getFieldError('propertyType'))}
                  >
                    <option value="">Select type</option>
                    {PropertyNames.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <ErrorMsg msg={getFieldError('propertyType')} />
                </label>

                <label style={labelStyle}>
                  Region *
                  <select
                    value={data.city}
                    onChange={(e) => setData('city', e.target.value)}
                    style={getInputStyle(!!getFieldError('city'))}
                  >
                    <option value="">Select Region</option>
                    {names.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  <ErrorMsg msg={getFieldError('city')} />
                </label>
              </div>

              <label style={labelStyle}>
                Area/Neighborhood *
                <input
                  type="text"
                  value={data.area}
                  onChange={(e) => setData('area', e.target.value)}
                  placeholder="e.g., East Legon, Spintex"
                  style={getInputStyle(!!getFieldError('area'))}
                />
                <ErrorMsg msg={getFieldError('area')} />
              </label>

              <label style={labelStyle}>
                Full Address
                <textarea
                  value={data.address}
                  onChange={(e) => setData('address', e.target.value)}
                  placeholder="Enter the complete address (optional)"
                  rows={3}
                  style={{ ...getInputStyle(!!getFieldError('address')), resize: 'vertical' }}
                />
                <ErrorMsg msg={getFieldError('address')} />
              </label>
            </>
          )}

          {/* Step 2: Pricing & Features */}
          {currentStep === 2 && (
            <>
              {data.purpose === 'rent' ? (
                <>
                  <div className="form-grid-2">
                    <label style={labelStyle}>
                      Rent Minimum (GH₵) *
                      <input
                        type="number"
                        value={data.rentMin}
                        onChange={(e) => setData('rentMin', e.target.value)}
                        placeholder="1500"
                        style={getInputStyle(!!getFieldError('rentMin'))}
                      />
                      <ErrorMsg msg={getFieldError('rentMin')} />
                    </label>

                    <label style={labelStyle}>
                      Rent Maximum (GH₵) *
                      <input
                        type="number"
                        value={data.rentMax}
                        onChange={(e) => setData('rentMax', e.target.value)}
                        placeholder="2500"
                        style={getInputStyle(!!getFieldError('rentMax'))}
                      />
                      <ErrorMsg msg={getFieldError('rentMax')} />
                    </label>
                  </div>

                  <label style={labelStyle}>
                    Advance Duration *
                    <select
                      value={data.advanceDuration}
                      onChange={(e) => setData('advanceDuration', e.target.value)}
                      style={getInputStyle(!!getFieldError('advanceDuration'))}
                    >
                      {[1,2,3,4,5,6,7,8,9].map(m => (
                        <option key={m} value={m}>{m} month{m > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                    <ErrorMsg msg={getFieldError('advanceDuration')} />
                  </label>
                </>
              ) : (
                <label style={labelStyle}>
                  Sale Price (GH₵) *
                  <input
                    type="number"
                    value={data.salePrice}
                    onChange={(e) => setData('salePrice', e.target.value)}
                    placeholder="250000"
                      style={getInputStyle(!!getFieldError('salePrice'))}
                  />
                  <ErrorMsg msg={getFieldError('salePrice')} />
                </label>
              )}

              <div className="form-grid-2">
                <label style={labelStyle}>
                  Bedrooms *
                  <input
                    type="number"
                    value={data.bedrooms}
                    onChange={(e) => setData('bedrooms', e.target.value)}
                    placeholder="2"
                    min="0"
                    style={getInputStyle(!!getFieldError('bedrooms'))}
                  />
                  <ErrorMsg msg={getFieldError('bedrooms')} />
                </label>

                <label style={labelStyle}>
                  Bathrooms *
                  <input
                    type="number"
                    value={data.bathrooms}
                    onChange={(e) => setData('bathrooms', e.target.value)}
                    placeholder="1"
                    min="0"
                    style={getInputStyle(!!getFieldError('bathrooms'))}
                  />
                  <ErrorMsg msg={getFieldError('bathrooms')} />
                </label>
              </div>

              <div>
                <label style={{ ...labelStyle, marginBottom: '0.75rem' }}>
                  Amenities
                </label>
                <div className="amenities-grid">
                  {AmenityNames.map(amenity => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => handleAmenityToggle(amenity)}
                      style={{
                        padding: '0.6rem',
                        borderRadius: '0.5rem',
                        border: data.amenities.includes(amenity) ? '2px solid hsl(174 62% 32%)' : '1px solid hsl(40 20% 88%)',
                        backgroundColor: data.amenities.includes(amenity) ? 'hsl(174 62% 32% / 0.1)' : 'white',
                        color: data.amenities.includes(amenity) ? 'hsl(174 62% 32%)' : 'hsl(200 25% 15%)',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        fontSize: '0.8rem',
                        minHeight: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      {data.amenities.includes(amenity) && <CheckCircle2 style={{ height: '0.875rem', width: '0.875rem' }} />}
                      {amenity}
                    </button>
                  ))}
                </div>
                <ErrorMsg msg={getFieldError('amenities')} />
              </div>

              <label style={labelStyle}>
                Property Description
                <textarea
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  placeholder="Describe the property..."
                  rows={4}
                  style={{ ...getInputStyle(!!getFieldError('description')), resize: 'vertical' }}
                />
                <ErrorMsg msg={getFieldError('description')} />
              </label>

              <div>
                <label style={{ ...labelStyle, marginBottom: '0.75rem' }}>
                  Property Images (Max 6)
                </label>
                
                {images.length < 6 && (
                  <label style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.5rem',
                    border: '2px dashed hsl(174 62% 32%)',
                    borderRadius: '0.65rem',
                    backgroundColor: 'hsl(174 62% 32% / 0.05)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    marginBottom: '0.75rem',
                  }}>
                    <Upload style={{ height: '1.5rem', width: '1.5rem', color: 'hsl(174 62% 32%)', marginBottom: '0.5rem' }} />
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'hsl(174 62% 32%)' }}>Click to upload images</span>
                    <span style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)' }}>PNG, JPG up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}

                {images.length > 0 && (
                  <div className="images-grid">
                    {images.map(image => (
                      <div key={image.id} style={{ position: 'relative' }}>
                        <div style={{ aspectRatio: '1', borderRadius: '0.5rem', overflow: 'hidden', backgroundColor: 'hsl(220 15% 93%)' }}>
                          <img src={image.preview} alt={image.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          style={{
                            position: 'absolute',
                            top: '0.375rem',
                            right: '0.375rem',
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            border: 'none',
                            backgroundColor: 'hsl(0 72% 51%)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <X style={{ height: '0.875rem', width: '0.875rem' }} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <ErrorMsg msg={getFieldError('images')} />
              </div>
            </>
          )}

          {/* Step 3: Contact Information */}
          {currentStep === 3 && (
            <>
              <div style={{ padding: '0.75rem 1rem', borderRadius: '0.65rem', backgroundColor: 'hsl(38 92% 50% / 0.1)', border: '1px solid hsl(38 92% 50% / 0.2)' }}>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'hsl(200 25% 15%)' }}>
                  <strong>⚠️ Important:</strong> Your contact information will be visible to interested {data.purpose === 'rent' ? 'tenants' : 'buyers'}.
                </p>
              </div>

              <label style={labelStyle}>
                Your Name *
                <input
                  type="text"
                  value={data.agentName}
                  onChange={(e) => setData('agentName', e.target.value)}
                  style={getInputStyle(!!getFieldError('agentName'))}
                />
                <ErrorMsg msg={getFieldError('agentName')} />
              </label>

              <label style={labelStyle}>
                Phone Number *
                <input
                  type="tel"
                  value={data.agentPhone}
                  onChange={(e) => setData('agentPhone', e.target.value)}
                  style={getInputStyle(!!getFieldError('agentPhone'))}
                />
                <ErrorMsg msg={getFieldError('agentPhone')} />
              </label>

              <label style={labelStyle}>
                Email Address *
                <input
                  type="email"
                  value={data.agentEmail}
                  onChange={(e) => setData('agentEmail', e.target.value)}
                  style={getInputStyle(!!getFieldError('agentEmail'))}
                />
                <ErrorMsg msg={getFieldError('agentEmail')} />
              </label>
            </>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { title: 'Property Details', rows: [
                    ['Title', data.title],
                    ['Type', data.propertyType],
                    ['Location', `${data.area}, ${data.city}`],
                    ['Address', data.address || '—'],
                  ]},
                  { title: 'Pricing & Features', rows: data.purpose === 'rent' ? [
                    ['Monthly Rent', `GH₵${Number(data.rentMin || 0).toLocaleString()} - GH₵${Number(data.rentMax || 0).toLocaleString()}`],
                    ['Advance', `${data.advanceDuration} month${data.advanceDuration > 1 ? 's' : ''}`],
                    ['Bedrooms', data.bedrooms || '0'],
                    ['Bathrooms', data.bathrooms || '0'],
                  ] : [
                    ['Sale Price', `GH₵${Number(data.salePrice || 0).toLocaleString()}`],
                    ['Bedrooms', data.bedrooms || '0'],
                    ['Bathrooms', data.bathrooms || '0'],
                  ]},
                  { title: 'Contact Information', rows: [
                    ['Name', data.agentName],
                    ['Phone', data.agentPhone],
                    ['Email', data.agentEmail],
                  ]},
                ].map(section => (
                  <div key={section.title} style={{ padding: '1rem', borderRadius: '0.65rem', backgroundColor: 'hsl(40 30% 96%)', border: '1px solid hsl(40 20% 88%)' }}>
                    <h3 style={{ margin: '0 0 0.75rem', fontSize: '0.875rem', fontWeight: '700', color: 'hsl(200 25% 15%)' }}>{section.title}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {section.rows.map(([label, value]) => (
                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', fontSize: '0.8rem' }}>
                          <span style={{ color: 'hsl(200 15% 45%)', flexShrink: 0 }}>{label}:</span>
                          <span style={{ color: 'hsl(200 25% 15%)', fontWeight: '600', textAlign: 'right', wordBreak: 'break-word' }}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {images.length > 0 && (
                <div>
                  <h3 style={{ margin: '0 0 0.75rem', fontSize: '0.875rem', fontWeight: '700', color: 'hsl(200 25% 15%)' }}>
                    Images ({images.length})
                  </h3>
                  <div className="images-grid">
                    {images.map(image => (
                      <div key={image.id} style={{ aspectRatio: '1', borderRadius: '0.5rem', overflow: 'hidden' }}>
                        <img src={image.preview} alt={image.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Navigation */}
          <div className="add-rental-footer" style={{ marginTop: 'auto' }}>
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevious}
                disabled={processing}
                style={{
                  padding: '0.75rem 1.25rem',
                  borderRadius: '0.65rem',
                  border: '1px solid hsl(40 20% 88%)',
                  backgroundColor: 'white',
                  color: 'hsl(200 25% 15%)',
                  fontWeight: '600',
                  cursor: processing ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '0.875rem',
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
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.65rem',
                  border: 'none',
                  backgroundColor: purposeAccent,
                  color: data.purpose === 'sale' ? 'hsl(200 25% 10%)' : 'white',
                  fontWeight: '700',
                  cursor: processing ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '0.875rem',
                }}
              >
                Next Step
              </button>
            ) : (
              <button
                type="submit"
                disabled={processing}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.65rem',
                  border: 'none',
                  background: 'linear-gradient(135deg, hsl(38 92% 50%) 0%, hsl(30 90% 45%) 100%)',
                  color: 'hsl(200 25% 10%)',
                  fontWeight: '700',
                  cursor: processing ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '0.875rem',
                  opacity: processing ? 0.7 : 1,
                }}
              >
                {processing ? 'Submitting...' : 'Submit Listing'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRentalPage;