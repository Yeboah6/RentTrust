import React, { useState, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import { Home, MapPin, DollarSign, Calendar, Image, FileText, CheckCircle2, AlertCircle, Upload, X } from 'lucide-react';

const EditRentals = ({ agentData, setShowEditListingModal, rental, locations = [], propertyTypes = [], amenities = [], userRole = 'agent' }) => {
  const { flash, locations: pageLocations = [], propertyTypes: pagePropertyTypes = [], amenities: pageAmenities = [] } = usePage().props;

  const locationsData = locations.length ? locations : pageLocations;
  const propertyTypesData = propertyTypes.length ? propertyTypes : pagePropertyTypes;
  const amenitiesData = amenities.length ? amenities : pageAmenities;
  const isAdmin = userRole === 'admin';

  const { data, setData, processing, errors, reset } = useForm({
    purpose: 'rent',
    id: rental?.id,
    title: rental?.title,
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
    newImages: [], 
    existingImages: [], 
    removedImages: [],
    description: '',
    agentName: agentData?.fullName || '',
    agentPhone: agentData?.phone || '',
    agentEmail: agentData?.email || '',
    status: ''
  });

  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [toast, setToast] = useState(null);
  const [availability, setAvailability] = useState('active');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cityNames = locationsData?.map(l => l?.name) || [];
  const propertyTypeNames = propertyTypesData?.map(p => p?.name) || [];
  const amenityNames = amenitiesData?.map(a => a?.name) || [];

  useEffect(() => {
    if (flash?.toast) {
      showToast(flash.toast.type, flash.toast.title, flash.toast.message);
    }
  }, [flash?.toast]);

  const parseImages = (imagesData) => {
    if (!imagesData) return [];
    
    try {
      if (Array.isArray(imagesData)) return imagesData;
      if (typeof imagesData === 'string') {
        const parsed = JSON.parse(imagesData);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (e) {
      console.error('Error parsing images:', e);
      return [];
    }
  };

  useEffect(() => {
    if (rental) {
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

      const imagesArray = parseImages(rental.images);
      
      const existingImagesList = imagesArray.map((img, index) => {
        let imagePath = '';
        if (typeof img === 'string') {
          imagePath = img;
        } else if (img && img.path) {
          imagePath = img.path;
        } else if (img && img.url) {
          imagePath = img.url;
        }

        return {
          id: `existing-${index}`,
          name: `image-${index}`,
          preview: imagePath.startsWith('http') 
            ? imagePath 
            : `/storage/rental_images/${imagePath}`,
          path: imagePath,
          isExisting: true
        };
      });

      setExistingImages(existingImagesList);

      if (rental.is_sold) {
        setAvailability('sold');
      } else if (rental.is_rented) {
        setAvailability('rented');
      } else {
        setAvailability('active');
      }
      
      setData({
        purpose: rental.purpose || 'rent',
        id: rental.id || '',
        title: rental.title || '',
        propertyType: rental.property_type || '',
        area: rental.area || '',
        city: rental.city || '',
        address: rental.address || '',
        rentMin: rental.rent_min || '',
        rentMax: rental.rent_max || '',
        salePrice: rental.sale_price || '',
        advanceDuration: rental.advance_duration?.toString() || '1',
        bedrooms: rental.bedrooms?.toString() || '',
        bathrooms: rental.bathrooms?.toString() || '',
        amenities: parsedAmenities,
        newImages: [],
        existingImages: existingImagesList.map(img => img.path),
        removedImages: [],
        description: rental.description || '',
        agentName: rental.agent_name || agentData?.fullName || '',
        agentPhone: rental.agent_phone || agentData?.phone || '',
        agentEmail: rental.agent_email || agentData?.email || '',
        is_sold: rental.is_sold?.toString() || '0',
        is_rented: rental.is_rented?.toString() || '0',
        status: rental.status || ''
      });
    }
  }, [rental]);

  const handleAmenityToggle = (amenity) => {
    const updatedAmenities = data.amenities.includes(amenity)
      ? data.amenities.filter(a => a !== amenity)
      : [...data.amenities, amenity];
    setData('amenities', updatedAmenities);
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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        showToast("File too large", `${file.name} is larger than 5MB`, "error");
        return false;
      }
      return true;
    });

    const newImageObjects = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      file: file,
      preview: URL.createObjectURL(file),
      isExisting: false
    }));
    
    const totalImages = existingImages.length + newImages.length + newImageObjects.length;
    if (totalImages > 6) {
      showToast("Too many images", "Maximum 6 images allowed", "error");
      return;
    }
    
    const updatedNewImages = [...newImages, ...newImageObjects];
    setNewImages(updatedNewImages);
    setData('newImages', updatedNewImages.map(img => img.file));
  };

  const removeImage = (id, isExisting) => {
    if (isExisting) {
      const imageToRemove = existingImages.find(img => img.id === id);
      
      const updatedExistingImages = existingImages.filter(img => img.id !== id);
      setExistingImages(updatedExistingImages);
      
      setData(prev => ({
        ...prev,
        existingImages: updatedExistingImages.map(img => img.path),
        removedImages: [...prev.removedImages, imageToRemove.path]
      }));
    } else {
      const updatedNewImages = newImages.filter(img => img.id !== id);
      setNewImages(updatedNewImages);
      setData('newImages', updatedNewImages.map(img => img.file));
    }
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
    } else {
      showToast("Missing Information", "Please fill all required fields before proceeding.", "error");
    }
  };

  const handlePrevious = (e) => {
    e.preventDefault();
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      showToast("Missing Information", "Please fill all required fields.", "error");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    
    formData.append('_method', 'PUT');
    
    formData.append('id', data.id);
    formData.append('title', data.title);
    formData.append('propertyType', data.propertyType);
    formData.append('area', data.area);
    formData.append('city', data.city);
    formData.append('address', data.address || '');
    if (data.purpose === 'rent') {
      formData.append('rentMin', data.rentMin);
      formData.append('rentMax', data.rentMax);
      formData.append('advanceDuration', data.advanceDuration);
    } else {
      formData.append('salePrice', data.salePrice);
      formData.append('rentMin', '');
      formData.append('rentMax', '');
    }
    formData.append('bedrooms', data.bedrooms);
    formData.append('bathrooms', data.bathrooms || '0');
    formData.append('description', data.description || '');
    formData.append('agentName', data.agentName);
    formData.append('agentPhone', data.agentPhone);
    formData.append('agentEmail', data.agentEmail);

    if (isAdmin) {
      formData.append('status', data.status);
      formData.append('is_sold', data.status === 'sold' ? '1' : '0');
      formData.append('is_rented', data.status === 'rented' ? '1' : '0');
    } else {
      // formData.append('status', data.status);
      formData.append('is_sold', availability === 'sold' ? '1' : '0');
      formData.append('is_rented', availability === 'rented' ? '1' : '0');
    }

    formData.append('amenities', JSON.stringify(data.amenities));
    
    data.existingImages.forEach((imagePath, index) => {
      formData.append(`existingImages[${index}]`, imagePath);
    });
    
    data.removedImages.forEach((imagePath, index) => {
      formData.append(`removedImages[${index}]`, imagePath);
    });
    
    newImages.forEach((imageObj, index) => {
      formData.append(`newImages[${index}]`, imageObj.file);
    });

    const baseUrl = userRole === 'admin' ? '/admin/rent' : '/rent';
    const url = `${baseUrl}/${data.id}`;
    axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      showToast("Listing Updated", "Your rental listing has been updated successfully.", "success");
      setTimeout(() => {
        if (setShowEditListingModal) setShowEditListingModal(false);
        window.location.reload();
      }, 1500);
    })
    .catch((error) => {
      console.error('Update error response:', error.response?.data);
      const errorData = error.response?.data;
      
      if (errorData?.errors) {
        const errorMessages = Object.entries(errorData.errors)
          .map(([field, messages]) => {
            return Array.isArray(messages) ? messages[0] : messages;
          })
          .filter(Boolean);
        
      const errorMessage = errorMessages.join(' ');
        showToast("Validation Error", errorMessage || "Please check your input and try again.", "error");
      } else if (errorData?.error) {
        showToast("Update Failed", errorData.error, "error");
      } else if (errorData?.message) {
        showToast("Update Failed", errorData.message, "error");
      } else {
        showToast("Update Failed", "An error occurred while updating your listing. Please try again.", "error");
      }
    })
    .finally(() => {
      setIsSubmitting(false);
    });
  };


  const steps = [
    { number: 1, title: 'Property Details', icon: Home },
    { number: 2, title: 'Pricing & Features', icon: DollarSign },
    { number: 3, title: 'Contact Information', icon: FileText },
    { number: 4, title: 'Review & Submit', icon: CheckCircle2 }
  ];

  const allImages = [...existingImages, ...newImages];

  return (
    <>
      <style>{`
        * {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }
        
        input:focus, textarea:focus, select:focus {
          outline: none;
          ring: 2px;
          ring-color: hsl(174 62% 32%);
        }

        /* Responsive styles */
        @media (max-width: 768px) {
          .modal-content {
            max-height: 85vh !important;
            margin: 0.5rem !important;
            max-width: 95% !important;
          }

          .steps-container {
            padding: 1rem 0.5rem !important;
          }

          .step-icon {
            width: clamp(2rem, 10vw, 3rem) !important;
            height: clamp(2rem, 10vw, 3rem) !important;
          }

          .step-title {
            display: none !important;
          }

          .step-connector {
            flex: 1 !important;
            margin: 0 0.25rem !important;
          }

          .form-grid {
            grid-template-columns: 1fr !important;
          }

          .amenities-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }

          .images-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }

          .action-button {
            min-height: 44px;
            -webkit-tap-highlight-color: transparent;
            padding: 0.75rem 1rem !important;
            font-size: 0.875rem !important;
          }

          .form-padding {
            padding: clamp(0.75rem, 3vw, 1rem) !important;
          }
        }

        /* Extra small devices */
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

          .button-container {
            flex-direction: column !important;
            gap: 0.5rem !important;
          }

          .button-container button {
            width: 100% !important;
          }
        }

        /* Landscape mobile */
        @media (max-height: 600px) and (orientation: landscape) {
          .modal-content {
            max-height: 75vh !important;
          }

          .steps-container {
            padding: 0.5rem !important;
          }
        }

        /* Prevent zoom on input focus for iOS */
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

        /* Tablet */
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

        /* Desktop */
        @media (min-width: 769px) {
          .amenities-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }

          .images-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }

        /* Large desktop */
        @media (min-width: 1024px) {
          .modal-content {
            max-width: 56rem !important;
          }
        }

        /* Toast animation */
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: 'clamp(0.75rem, 3vw, 1rem)',
          right: 'clamp(0.75rem, 3vw, 1rem)',
          backgroundColor: toast.variant === 'error' ? 'hsl(0 72% 51%)' : 'hsl(152 60% 40%)',
          color: 'white',
          padding: 'clamp(0.75rem, 2vw, 1rem)',
          borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          zIndex: 9999,
          maxWidth: 'clamp(300px, 90vw, 400px)',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <div style={{ 
            fontWeight: '600', 
            marginBottom: 'clamp(0.125rem, 1vw, 0.25rem)',
            fontSize: 'clamp(0.875rem, 2vw, 1rem)'
          }}>
            {toast.title}
          </div>
          <div style={{ 
            fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
            lineHeight: '1.4'
          }}>
            {toast.description}
          </div>
        </div>
      )}

      <div className="min-h-screen" style={{ backgroundColor: 'hsl(40 33% 98%)' }}>
        {/* Progress Steps */}
        <div className="bg-white shadow-sm">
          <div className="steps-container" style={{ 
            padding: 'clamp(1rem, 3vw, 1.5rem) clamp(0.5rem, 2vw, 1rem)' 
          }}>
            <div className="flex items-center justify-between" style={{ 
              maxWidth: '48rem', 
              margin: '0 auto'
            }}>
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center gap-2">
                    <div 
                      className="step-icon rounded-full flex items-center justify-center font-semibold transition-all duration-300"
                      style={{
                        backgroundColor: currentStep >= step.number ? 'hsl(174 62% 32%)' : 'hsl(40 30% 94%)',
                        color: currentStep >= step.number ? 'white' : 'hsl(200 15% 45%)',
                        width: 'clamp(2.5rem, 8vw, 3rem)',
                        height: 'clamp(2.5rem, 8vw, 3rem)'
                      }}
                    >
                      {currentStep > step.number ? (
                        <CheckCircle2 style={{ 
                          height: 'clamp(1rem, 3vw, 1.5rem)', 
                          width: 'clamp(1rem, 3vw, 1.5rem)' 
                        }} />
                      ) : (
                        <step.icon style={{ 
                          height: 'clamp(1rem, 3vw, 1.5rem)', 
                          width: 'clamp(1rem, 3vw, 1.5rem)' 
                        }} />
                      )}
                    </div>
                    <span 
                      className="step-title text-xs font-medium text-center hidden sm:block"
                      style={{ 
                        color: currentStep >= step.number ? 'hsl(174 62% 32%)' : 'hsl(200 15% 45%)',
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
                      }}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div 
                      className="step-connector h-1 mx-2 rounded transition-all duration-300"
                      style={{ 
                        backgroundColor: currentStep > step.number ? 'hsl(174 62% 32%)' : 'hsl(40 20% 88%)',
                        flex: 1
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="form-padding" style={{ 
          padding: 'clamp(1rem, 3vw, 2rem) clamp(0.5rem, 2vw, 1rem)' 
        }}>
          <div style={{ 
            maxWidth: '48rem', 
            margin: '0 auto' 
          }}>
            <div className="bg-white rounded-xl shadow-lg" style={{ 
              border: '1px solid hsl(40 20% 88%)',
              padding: 'clamp(1rem, 3vw, 2rem)'
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
                      <h2 style={{ 
                        color: 'hsl(200 25% 15%)',
                        fontSize: 'clamp(1.125rem, 4vw, 1.25rem)',
                        fontWeight: '700',
                        marginBottom: 'clamp(0.125rem, 1vw, 0.25rem)',
                        lineHeight: '1.2'
                      }}>
                        Property Details
                      </h2>
                      <p style={{ 
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                        color: 'hsl(200 15% 45%)' 
                      }}>
                        Tell us about the property you're listing
                      </p>
                    </div>

                    <div>
                      <label style={{ 
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                        fontWeight: '500',
                        color: 'hsl(200 25% 15%)',
                        display: 'block', 
                        marginBottom: 'clamp(0.375rem, 1.5vw, 0.5rem)' 
                      }}>
                        Property Title *
                      </label>
                      <input
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        placeholder="e.g., 2 Bedroom Self-Contained Apartment"
                        style={{
                          width: '100%',
                          padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1rem)',
                          border: `1px solid ${errors.title ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}`,
                          borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
                          fontSize: 'clamp(0.875rem, 2vw, 0.875rem)',
                          fontFamily: 'inherit',
                          transition: 'all 0.2s'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = 'hsl(174 62% 32%)';
                          e.target.style.boxShadow = '0 0 0 2px hsl(174 62% 32% / 0.2)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = errors.title ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                      {errors.title && (
                        <p style={{ 
                          fontSize: 'clamp(0.75rem, 2vw, 0.75rem)', 
                          marginTop: 'clamp(0.25rem, 1vw, 0.375rem)', 
                          color: 'hsl(0 72% 51%)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'clamp(0.25rem, 1vw, 0.375rem)'
                        }}>
                          <AlertCircle style={{ 
                            height: 'clamp(0.75rem, 2vw, 0.875rem)', 
                            width: 'clamp(0.75rem, 2vw, 0.875rem)' 
                          }} /> 
                          {errors.title}
                        </p>
                      )}
                    </div>

                    <div className="form-grid" style={{
                      display: 'grid',
                      gap: 'clamp(0.75rem, 2vw, 1rem)'
                    }}>
                      <div>
                        <label style={{ 
                          fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                          fontWeight: '500',
                          color: 'hsl(200 25% 15%)',
                          display: 'block', 
                          marginBottom: 'clamp(0.375rem, 1.5vw, 0.5rem)' 
                        }}>
                          Property Type *
                        </label>
                        <select
                          value={data.propertyType}
                          onChange={(e) => setData('propertyType', e.target.value)}
                          style={{
                            width: '100%',
                            padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1rem)',
                            border: `1px solid ${errors.propertyType ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}`,
                            borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
                            fontSize: 'clamp(0.875rem, 2vw, 0.875rem)',
                            fontFamily: 'inherit',
                            backgroundColor: 'white',
                            appearance: 'none',
                            transition: 'all 0.2s'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = 'hsl(174 62% 32%)';
                            e.target.style.boxShadow = '0 0 0 2px hsl(174 62% 32% / 0.2)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = errors.propertyType ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)';
                            e.target.style.boxShadow = 'none';
                          }}
                        >
                          <option value="">Select type</option>
                          {propertyTypeNames.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        {errors.propertyType && (
                          <p style={{ 
                            fontSize: 'clamp(0.75rem, 2vw, 0.75rem)', 
                            marginTop: 'clamp(0.25rem, 1vw, 0.375rem)', 
                            color: 'hsl(0 72% 51%)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'clamp(0.25rem, 1vw, 0.375rem)'
                          }}>
                            <AlertCircle style={{ 
                              height: 'clamp(0.75rem, 2vw, 0.875rem)', 
                              width: 'clamp(0.75rem, 2vw, 0.875rem)' 
                            }} /> 
                            {errors.propertyType}
                          </p>
                        )}
                        {data.propertyType && (
                          <div style={{ 
                            marginTop: 'clamp(0.5rem, 1.5vw, 0.75rem)',
                            display: 'flex',
                            gap: 'clamp(0.375rem, 1vw, 0.5rem)',
                            flexWrap: 'wrap',
                            alignItems: 'center'
                          }}>
                            <span style={{ 
                              fontSize: 'clamp(0.75rem, 2vw, 0.75rem)',
                              color: 'hsl(200 15% 45%)',
                              fontWeight: '500'
                            }}>
                              Selected:
                            </span>
                            <div style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 'clamp(0.375rem, 1vw, 0.5rem)',
                              paddingLeft: 'clamp(0.625rem, 2vw, 0.75rem)',
                              paddingRight: 'clamp(0.625rem, 2vw, 0.75rem)',
                              paddingTop: 'clamp(0.375rem, 1vw, 0.5rem)',
                              paddingBottom: 'clamp(0.375rem, 1vw, 0.5rem)',
                              backgroundColor: 'hsl(174 62% 32%)',
                              color: 'white',
                              borderRadius: 'clamp(0.5rem, 2vw, 0.625rem)',
                              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                              fontWeight: '600',
                              textTransform: 'capitalize'
                            }}>
                              {data.propertyType}
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <label style={{ 
                          fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                          fontWeight: '500',
                          color: 'hsl(200 25% 15%)',
                          display: 'block', 
                          marginBottom: 'clamp(0.375rem, 1.5vw, 0.5rem)' 
                        }}>
                          City *
                        </label>
                        <select
                          value={data.city}
                          onChange={(e) => setData('city', e.target.value)}
                          style={{
                            width: '100%',
                            padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1rem)',
                            border: `1px solid ${errors.city ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}`,
                            borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
                            fontSize: 'clamp(0.875rem, 2vw, 0.875rem)',
                            fontFamily: 'inherit',
                            backgroundColor: 'white',
                            appearance: 'none',
                            transition: 'all 0.2s'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = 'hsl(174 62% 32%)';
                            e.target.style.boxShadow = '0 0 0 2px hsl(174 62% 32% / 0.2)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = errors.city ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)';
                            e.target.style.boxShadow = 'none';
                          }}
                        >
                          <option value="">Select city</option>
                          {cityNames.map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                        {errors.city && (
                          <p style={{ 
                            fontSize: 'clamp(0.75rem, 2vw, 0.75rem)', 
                            marginTop: 'clamp(0.25rem, 1vw, 0.375rem)', 
                            color: 'hsl(0 72% 51%)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'clamp(0.25rem, 1vw, 0.375rem)'
                          }}>
                            <AlertCircle style={{ 
                              height: 'clamp(0.75rem, 2vw, 0.875rem)', 
                              width: 'clamp(0.75rem, 2vw, 0.875rem)' 
                            }} /> 
                            {errors.city}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label style={{ 
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                        fontWeight: '500',
                        color: 'hsl(200 25% 15%)',
                        display: 'block', 
                        marginBottom: 'clamp(0.375rem, 1.5vw, 0.5rem)' 
                      }}>
                        Area/Neighborhood *
                      </label>
                      <div style={{ position: 'relative' }}>
                        <MapPin style={{ 
                          position: 'absolute',
                          left: 'clamp(0.75rem, 3vw, 1rem)',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          height: 'clamp(1rem, 3vw, 1.25rem)',
                          width: 'clamp(1rem, 3vw, 1.25rem)',
                          color: 'hsl(200 15% 45%)'
                        }} />
                        <input
                          type="text"
                          value={data.area}
                          onChange={(e) => setData('area', e.target.value)}
                          placeholder="e.g., East Legon, Spintex"
                          style={{
                            width: '100%',
                            paddingLeft: 'clamp(2.25rem, 8vw, 2.75rem)',
                            paddingRight: 'clamp(0.75rem, 3vw, 1rem)',
                            paddingTop: 'clamp(0.625rem, 2vw, 0.75rem)',
                            paddingBottom: 'clamp(0.625rem, 2vw, 0.75rem)',
                            border: `1px solid ${errors.area ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}`,
                            borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
                            fontSize: 'clamp(0.875rem, 2vw, 0.875rem)',
                            fontFamily: 'inherit',
                            transition: 'all 0.2s'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = 'hsl(174 62% 32%)';
                            e.target.style.boxShadow = '0 0 0 2px hsl(174 62% 32% / 0.2)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = errors.area ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </div>
                      {errors.area && (
                        <p style={{ 
                          fontSize: 'clamp(0.75rem, 2vw, 0.75rem)', 
                          marginTop: 'clamp(0.25rem, 1vw, 0.375rem)', 
                          color: 'hsl(0 72% 51%)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'clamp(0.25rem, 1vw, 0.375rem)'
                        }}>
                          <AlertCircle style={{ 
                            height: 'clamp(0.75rem, 2vw, 0.875rem)', 
                            width: 'clamp(0.75rem, 2vw, 0.875rem)' 
                          }} /> 
                          {errors.area}
                        </p>
                      )}
                    </div>

                    <div>
                      <label style={{ 
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                        fontWeight: '500',
                        color: 'hsl(200 25% 15%)',
                        display: 'block', 
                        marginBottom: 'clamp(0.375rem, 1.5vw, 0.5rem)' 
                      }}>
                        Full Address
                      </label>
                      <textarea
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        placeholder="Enter the complete address (optional)"
                        rows={3}
                        style={{
                          width: '100%',
                          padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1rem)',
                          border: '1px solid hsl(40 20% 88%)',
                          borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
                          fontSize: 'clamp(0.875rem, 2vw, 0.875rem)',
                          fontFamily: 'inherit',
                          resize: 'vertical',
                          minHeight: '5rem',
                          transition: 'all 0.2s'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = 'hsl(174 62% 32%)';
                          e.target.style.boxShadow = '0 0 0 2px hsl(174 62% 32% / 0.2)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'hsl(40 20% 88%)';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Pricing & Features */}
                {currentStep === 2 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 3vw, 1.5rem)' }}>
                    <div>
                      <h2 style={{ 
                        color: 'hsl(200 25% 15%)',
                        fontSize: 'clamp(1.125rem, 4vw, 1.25rem)',
                        fontWeight: '700',
                        marginBottom: 'clamp(0.125rem, 1vw, 0.25rem)',
                        lineHeight: '1.2'
                      }}>
                        Pricing & Features
                      </h2>
                      <p style={{ 
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                        color: 'hsl(200 15% 45%)' 
                      }}>
                        Help tenants understand the cost and features
                      </p>
                    </div>

                    <div className="form-grid" style={{
                      display: 'grid',
                      gap: 'clamp(0.75rem, 2vw, 1rem)'
                    }}>
                      {data.purpose === 'rent' ? (
                        <>
                          <div>
                            <label style={{ 
                              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                              fontWeight: '500',
                              color: 'hsl(200 25% 15%)',
                              display: 'block', 
                              marginBottom: 'clamp(0.375rem, 1.5vw, 0.5rem)' 
                            }}>
                              Rent Minimum (GH₵) *
                            </label>
                            <div style={{ position: 'relative' }}>
                              <DollarSign style={{ 
                                position: 'absolute',
                                left: 'clamp(0.75rem, 3vw, 1rem)',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                height: 'clamp(1rem, 3vw, 1.25rem)',
                                width: 'clamp(1rem, 3vw, 1.25rem)',
                                color: 'hsl(200 15% 45%)'
                              }} />
                              <input
                                type="number"
                                value={data.rentMin}
                                onChange={(e) => setData('rentMin', e.target.value)}
                                placeholder="1500"
                                style={{
                                  width: '100%',
                                  paddingLeft: 'clamp(2.25rem, 8vw, 2.75rem)',
                                  paddingRight: 'clamp(0.75rem, 3vw, 1rem)',
                                  paddingTop: 'clamp(0.625rem, 2vw, 0.75rem)',
                                  paddingBottom: 'clamp(0.625rem, 2vw, 0.75rem)',
                                  border: `1px solid ${errors.rentMin ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}`,
                                  borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
                                  fontSize: 'clamp(0.875rem, 2vw, 0.875rem)',
                                  fontFamily: 'inherit',
                                  transition: 'all 0.2s'
                                }}
                                onFocus={(e) => {
                                  e.target.style.borderColor = 'hsl(174 62% 32%)';
                                  e.target.style.boxShadow = '0 0 0 2px hsl(174 62% 32% / 0.2)';
                                }}
                                onBlur={(e) => {
                                  e.target.style.borderColor = errors.rentMin ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)';
                                  e.target.style.boxShadow = 'none';
                                }}
                              />
                            </div>
                            {errors.rentMin && (
                              <p style={{ 
                                fontSize: 'clamp(0.75rem, 2vw, 0.75rem)', 
                                marginTop: 'clamp(0.25rem, 1vw, 0.375rem)', 
                                color: 'hsl(0 72% 51%)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'clamp(0.25rem, 1vw, 0.375rem)'
                              }}>
                                <AlertCircle style={{ 
                                  height: 'clamp(0.75rem, 2vw, 0.875rem)', 
                                  width: 'clamp(0.75rem, 2vw, 0.875rem)' 
                                }} /> 
                                {errors.rentMin}
                              </p>
                            )}
                          </div>

                          <div>
                            <label style={{ 
                              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                              fontWeight: '500',
                              color: 'hsl(200 25% 15%)',
                              display: 'block', 
                              marginBottom: 'clamp(0.375rem, 1.5vw, 0.5rem)' 
                            }}>
                              Rent Maximum (GH₵) *
                            </label>
                            <div style={{ position: 'relative' }}>
                              <DollarSign style={{ 
                                position: 'absolute',
                                left: 'clamp(0.75rem, 3vw, 1rem)',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                height: 'clamp(1rem, 3vw, 1.25rem)',
                                width: 'clamp(1rem, 3vw, 1.25rem)',
                                color: 'hsl(200 15% 45%)'
                              }} />
                              <input
                                type="number"
                                value={data.rentMax}
                                onChange={(e) => setData('rentMax', e.target.value)}
                                placeholder="2500"
                                style={{
                                  width: '100%',
                                  paddingLeft: 'clamp(2.25rem, 8vw, 2.75rem)',
                                  paddingRight: 'clamp(0.75rem, 3vw, 1rem)',
                                  paddingTop: 'clamp(0.625rem, 2vw, 0.75rem)',
                                  paddingBottom: 'clamp(0.625rem, 2vw, 0.75rem)',
                                  border: `1px solid ${errors.rentMax ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}`,
                                  borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
                                  fontSize: 'clamp(0.875rem, 2vw, 0.875rem)',
                                  fontFamily: 'inherit',
                                  transition: 'all 0.2s'
                                }}
                                onFocus={(e) => {
                                  e.target.style.borderColor = 'hsl(174 62% 32%)';
                                  e.target.style.boxShadow = '0 0 0 2px hsl(174 62% 32% / 0.2)';
                                }}
                                onBlur={(e) => {
                                  e.target.style.borderColor = errors.rentMax ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)';
                                  e.target.style.boxShadow = 'none';
                                }}
                              />
                            </div>
                            {errors.rentMax && (
                              <p style={{ 
                                fontSize: 'clamp(0.75rem, 2vw, 0.75rem)', 
                                marginTop: 'clamp(0.25rem, 1vw, 0.375rem)', 
                                color: 'hsl(0 72% 51%)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'clamp(0.25rem, 1vw, 0.375rem)'
                              }}>
                                <AlertCircle style={{ 
                                  height: 'clamp(0.75rem, 2vw, 0.875rem)', 
                                  width: 'clamp(0.75rem, 2vw, 0.875rem)' 
                                }} /> 
                                {errors.rentMax}
                              </p>
                            )}
                          </div>

                          <div>
                      <label style={{ 
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                        fontWeight: '500',
                        color: 'hsl(200 25% 15%)',
                        display: 'block', 
                        marginBottom: 'clamp(0.375rem, 1.5vw, 0.5rem)' 
                      }}>
                        Advance Duration *
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Calendar style={{ 
                          position: 'absolute',
                          left: 'clamp(0.75rem, 3vw, 1rem)',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          height: 'clamp(1rem, 3vw, 1.25rem)',
                          width: 'clamp(1rem, 3vw, 1.25rem)',
                          color: 'hsl(200 15% 45%)'
                        }} />
                        <select
                          value={data.advanceDuration}
                          onChange={(e) => setData('advanceDuration', e.target.value)}
                          style={{
                            width: '100%',
                            paddingLeft: 'clamp(2.25rem, 8vw, 2.75rem)',
                            paddingRight: 'clamp(0.75rem, 3vw, 1rem)',
                            paddingTop: 'clamp(0.625rem, 2vw, 0.75rem)',
                            paddingBottom: 'clamp(0.625rem, 2vw, 0.75rem)',
                            border: '1px solid hsl(40 20% 88%)',
                            borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
                            fontSize: 'clamp(0.875rem, 2vw, 0.875rem)',
                            fontFamily: 'inherit',
                            backgroundColor: 'white',
                            appearance: 'none',
                            transition: 'all 0.2s'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = 'hsl(174 62% 32%)';
                            e.target.style.boxShadow = '0 0 0 2px hsl(174 62% 32% / 0.2)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = 'hsl(40 20% 88%)';
                            e.target.style.boxShadow = 'none';
                          }}
                        >
                          <option value="1">1 Month</option>
                          <option value="2">2 Months</option>
                          <option value="3">3 Months</option>
                          <option value="4">4 Months</option>
                          <option value="5">5 Months</option>
                        </select>
                      </div>
                    </div>

                        </>
                      ) : (
                        <div>
                          <label style={{ 
                            fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                            fontWeight: '500',
                            color: 'hsl(200 25% 15%)',
                            display: 'block', 
                            marginBottom: 'clamp(0.375rem, 1.5vw, 0.5rem)' 
                          }}>
                            Sale Price (GH₵) *
                          </label>
                          <div style={{ position: 'relative' }}>
                            <DollarSign style={{ 
                              position: 'absolute',
                              left: 'clamp(0.75rem, 3vw, 1rem)',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              height: 'clamp(1rem, 3vw, 1.25rem)',
                              width: 'clamp(1rem, 3vw, 1.25rem)',
                              color: 'hsl(200 15% 45%)'
                            }} />
                            <input
                              type="number"
                              value={data.salePrice}
                              onChange={(e) => setData('salePrice', e.target.value)}
                              placeholder="250000"
                              style={{
                                width: '100%',
                                paddingLeft: 'clamp(2.25rem, 8vw, 2.75rem)',
                                paddingRight: 'clamp(0.75rem, 3vw, 1rem)',
                                paddingTop: 'clamp(0.625rem, 2vw, 0.75rem)',
                                paddingBottom: 'clamp(0.625rem, 2vw, 0.75rem)',
                                border: `1px solid ${errors.salePrice ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}`,
                                borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
                                fontSize: 'clamp(0.875rem, 2vw, 0.875rem)',
                                fontFamily: 'inherit',
                                transition: 'all 0.2s'
                              }}
                              onFocus={(e) => {
                                e.target.style.borderColor = 'hsl(174 62% 32%)';
                                e.target.style.boxShadow = '0 0 0 2px hsl(174 62% 32% / 0.2)';
                              }}
                              onBlur={(e) => {
                                e.target.style.borderColor = errors.salePrice ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)';
                                e.target.style.boxShadow = 'none';
                              }}
                            />
                          </div>
                          {errors.salePrice && (
                            <p style={{ 
                              fontSize: 'clamp(0.75rem, 2vw, 0.75rem)', 
                              marginTop: 'clamp(0.25rem, 1vw, 0.375rem)', 
                              color: 'hsl(0 72% 51%)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 'clamp(0.25rem, 1vw, 0.375rem)'
                            }}>
                              <AlertCircle style={{ 
                                height: 'clamp(0.75rem, 2vw, 0.875rem)', 
                                width: 'clamp(0.75rem, 2vw, 0.875rem)' 
                              }} /> 
                              {errors.salePrice}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="form-grid" style={{
                      display: 'grid',
                      gap: 'clamp(0.75rem, 2vw, 1rem)'
                    }}>
                      <div>
                        <label style={{ 
                          fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                          fontWeight: '500',
                          color: 'hsl(200 25% 15%)',
                          display: 'block', 
                          marginBottom: 'clamp(0.375rem, 1.5vw, 0.5rem)' 
                        }}>
                          Bedrooms *
                        </label>
                        <input
                          type="number"
                          value={data.bedrooms}
                          onChange={(e) => setData('bedrooms', e.target.value)}
                          placeholder="2"
                          min="0"
                          style={{
                            width: '100%',
                            padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1rem)',
                            border: `1px solid ${errors.bedrooms ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}`,
                            borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
                            fontSize: 'clamp(0.875rem, 2vw, 0.875rem)',
                            fontFamily: 'inherit',
                            transition: 'all 0.2s'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = 'hsl(174 62% 32%)';
                            e.target.style.boxShadow = '0 0 0 2px hsl(174 62% 32% / 0.2)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = errors.bedrooms ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                        {errors.bedrooms && (
                          <p style={{ 
                            fontSize: 'clamp(0.75rem, 2vw, 0.75rem)', 
                            marginTop: 'clamp(0.25rem, 1vw, 0.375rem)', 
                            color: 'hsl(0 72% 51%)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'clamp(0.25rem, 1vw, 0.375rem)'
                          }}>
                            <AlertCircle style={{ 
                              height: 'clamp(0.75rem, 2vw, 0.875rem)', 
                              width: 'clamp(0.75rem, 2vw, 0.875rem)' 
                            }} /> 
                            {errors.bedrooms}
                          </p>
                        )}
                      </div>

                      <div>
                        <label style={{ 
                          fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                          fontWeight: '500',
                          color: 'hsl(200 25% 15%)',
                          display: 'block', 
                          marginBottom: 'clamp(0.375rem, 1.5vw, 0.5rem)' 
                        }}>
                          Bathrooms
                        </label>
                        <input
                          type="number"
                          value={data.bathrooms}
                          onChange={(e) => setData('bathrooms', e.target.value)}
                          placeholder="1"
                          min="0"
                          style={{
                            width: '100%',
                            padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1rem)',
                            border: '1px solid hsl(40 20% 88%)',
                            borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
                            fontSize: 'clamp(0.875rem, 2vw, 0.875rem)',
                            fontFamily: 'inherit',
                            transition: 'all 0.2s'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = 'hsl(174 62% 32%)';
                            e.target.style.boxShadow = '0 0 0 2px hsl(174 62% 32% / 0.2)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = 'hsl(40 20% 88%)';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ 
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                        fontWeight: '500',
                        color: 'hsl(200 25% 15%)',
                        display: 'block', 
                        marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)' 
                      }}>
                        Amenities
                      </label>
                      <div className="amenities-grid" style={{
                        display: 'grid',
                        gap: 'clamp(0.5rem, 2vw, 0.75rem)'
                      }}>
                        {amenityNames.map(amenity => (
                          <button
                            key={amenity}
                            type="button"
                            onClick={() => handleAmenityToggle(amenity)}
                            className="action-button"
                            style={{
                              padding: 'clamp(0.5rem, 2vw, 0.625rem) clamp(0.75rem, 3vw, 1rem)',
                              borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
                              border: `1px solid ${data.amenities.includes(amenity) ? 'hsl(174 62% 32%)' : 'hsl(40 20% 88%)'}`,
                              backgroundColor: data.amenities.includes(amenity) ? 'hsl(174 62% 32% / 0.1)' : 'white',
                              color: data.amenities.includes(amenity) ? 'hsl(174 62% 32%)' : 'hsl(200 25% 15%)',
                              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                              fontWeight: '500',
                              cursor: 'pointer',
                              textAlign: 'center',
                              transition: 'all 0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.25rem'
                            }}
                            onMouseEnter={(e) => {
                              if (!data.amenities.includes(amenity)) {
                                e.currentTarget.style.borderColor = 'hsl(174 62% 32%)';
                                e.currentTarget.style.backgroundColor = 'hsl(174 62% 32% / 0.05)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!data.amenities.includes(amenity)) {
                                e.currentTarget.style.borderColor = 'hsl(40 20% 88%)';
                                e.currentTarget.style.backgroundColor = 'white';
                              }
                            }}
                          >
                            {data.amenities.includes(amenity) && <CheckCircle2 style={{ 
                              height: 'clamp(0.875rem, 2.5vw, 1rem)', 
                              width: 'clamp(0.875rem, 2.5vw, 1rem)' 
                            }} />}
                            {amenity}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{ 
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                        fontWeight: '500',
                        color: 'hsl(200 25% 15%)',
                        display: 'block', 
                        marginBottom: 'clamp(0.375rem, 1.5vw, 0.5rem)' 
                      }}>
                        Property Description
                      </label>
                      <textarea
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        placeholder="Describe the property, its condition, nearby facilities, and any other relevant details..."
                        rows={5}
                        style={{
                          width: '100%',
                          padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1rem)',
                          border: '1px solid hsl(40 20% 88%)',
                          borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
                          fontSize: 'clamp(0.875rem, 2vw, 0.875rem)',
                          fontFamily: 'inherit',
                          resize: 'vertical',
                          minHeight: '7.5rem',
                          transition: 'all 0.2s'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = 'hsl(174 62% 32%)';
                          e.target.style.boxShadow = '0 0 0 2px hsl(174 62% 32% / 0.2)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'hsl(40 20% 88%)';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ 
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                        fontWeight: '500',
                        color: 'hsl(200 25% 15%)',
                        display: 'block', 
                        marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)' 
                      }}>
                        Property Images (Max 6) - {allImages.length}/6
                      </label>
                      
                      {/* Show info about existing images */}
                      {existingImages.length > 0 && (
                        <div style={{
                          padding: '0.75rem',
                          marginBottom: '0.75rem',
                          backgroundColor: 'hsl(217 91% 60% / 0.1)',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          color: 'hsl(200 25% 15%)'
                        }}>
                          📷 {existingImages.length} existing image{existingImages.length !== 1 ? 's' : ''} • 
                          {newImages.length > 0 && ` ${newImages.length} new image${newImages.length !== 1 ? 's' : ''} to upload`}
                        </div>
                      )}
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.75rem, 2vw, 1rem)' }}>
                        {allImages.length < 6 && (
                          <label className="action-button" style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: 'clamp(6rem, 25vw, 8rem)',
                            border: '2px dashed hsl(174 62% 32%)',
                            borderRadius: 'clamp(0.5rem, 2vw, 0.75rem)',
                            backgroundColor: 'hsl(174 62% 32% / 0.05)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            padding: '1rem'
                          }}>
                            <Upload style={{ 
                              height: 'clamp(1.5rem, 5vw, 2rem)', 
                              width: 'clamp(1.5rem, 5vw, 2rem)', 
                              marginBottom: 'clamp(0.25rem, 1vw, 0.375rem)',
                              color: 'hsl(174 62% 32%)' 
                            }} />
                            <p style={{ 
                              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                              fontWeight: '500',
                              color: 'hsl(174 62% 32%)'
                            }}>
                              Click to upload new images
                            </p>
                            <input
                              type="file"
                              style={{ display: 'none' }}
                              accept="image/*"
                              multiple
                              onChange={handleImageUpload}
                            />
                          </label>
                        )}

                        {allImages.length > 0 && (
                          <div className="images-grid" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                            gap: 'clamp(0.5rem, 2vw, 0.75rem)'
                          }}>
                            {allImages.map(image => (
                              <div key={image.id} style={{ position: 'relative' }}>
                                <div style={{ 
                                  aspectRatio: '1 / 1',
                                  backgroundColor: 'hsl(40 30% 94%)',
                                  borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
                                  overflow: 'hidden',
                                  border: image.isExisting ? '2px solid hsl(217 91% 60%)' : 'none'
                                }}>
                                  <img 
                                    src={image.preview} 
                                    alt={image.name}
                                    onError={(e) => {
                                      console.error('Image load error:', image.preview);
                                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                                    }}
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover'
                                    }} 
                                  />
                                  {image.isExisting && (
                                    <div style={{ 
                                      position: 'absolute',
                                      top: '0.5rem',
                                      left: '0.5rem',
                                      padding: '0.25rem 0.5rem',
                                      borderRadius: '0.25rem',
                                      fontSize: '0.6875rem',
                                      fontWeight: '600',
                                      backgroundColor: 'hsl(217 91% 60%)',
                                      color: 'white'
                                    }}>
                                      Existing
                                    </div>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeImage(image.id, image.isExisting)}
                                  className="action-button"
                                  style={{
                                    position: 'absolute',
                                    top: '0.5rem',
                                    right: '0.5rem',
                                    padding: '0.25rem',
                                    borderRadius: '50%',
                                    backgroundColor: 'hsl(0 72% 51%)',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'opacity 0.2s'
                                  }}
                                >
                                  <X style={{ 
                                    height: 'clamp(0.875rem, 2.5vw, 1rem)', 
                                    width: 'clamp(0.875rem, 2.5vw, 1rem)' 
                                  }} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  // </div>
                )}

                {/* Step 3: Contact Information */}
                {currentStep === 3 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 3vw, 1.5rem)' }}>
                    <div>
                      <h2 style={{ 
                        color: 'hsl(200 25% 15%)',
                        fontSize: 'clamp(1.125rem, 4vw, 1.25rem)',
                        fontWeight: '700',
                        marginBottom: 'clamp(0.125rem, 1vw, 0.25rem)',
                        lineHeight: '1.2'
                      }}>
                        Contact Information
                      </h2>
                      <p style={{ 
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                        color: 'hsl(200 15% 45%)' 
                      }}>
                        How should tenants reach you?
                      </p>
                    </div>

                    <div style={{ 
                      padding: 'clamp(0.75rem, 3vw, 1rem)',
                      borderRadius: 'clamp(0.5rem, 2vw, 0.75rem)',
                      backgroundColor: 'hsl(38 92% 50% / 0.1)',
                      border: '1px solid hsl(38 92% 50% / 0.2)'
                    }}>
                      <p style={{ 
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                        color: 'hsl(200 25% 10%)',
                        lineHeight: '1.5'
                      }}>
                        <strong>⚠️ Important:</strong> Your contact information will be visible to interested tenants. 
                        Make sure it's accurate and up-to-date.
                      </p>
                    </div>

                    <div>
                      <label style={{ 
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                        fontWeight: '500',
                        color: 'hsl(200 25% 15%)',
                        display: 'block', 
                        marginBottom: 'clamp(0.375rem, 1.5vw, 0.5rem)' 
                      }}>
                        Your Name *
                      </label>
                      <input
                        type="text"
                        value={data.agentName || agentData.fullName}
                        onChange={(e) => setData('agentName', e.target.value)}
                        style={{
                          width: '100%',
                          padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1rem)',
                          border: `1px solid ${errors.agentName ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}`,
                          borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
                          fontSize: 'clamp(0.875rem, 2vw, 0.875rem)',
                          fontFamily: 'inherit',
                          transition: 'all 0.2s'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = 'hsl(174 62% 32%)';
                          e.target.style.boxShadow = '0 0 0 2px hsl(174 62% 32% / 0.2)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = errors.agentName ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                      {errors.agentName && (
                        <p style={{ 
                          fontSize: 'clamp(0.75rem, 2vw, 0.75rem)', 
                          marginTop: 'clamp(0.25rem, 1vw, 0.375rem)', 
                          color: 'hsl(0 72% 51%)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'clamp(0.25rem, 1vw, 0.375rem)'
                        }}>
                          <AlertCircle style={{ 
                            height: 'clamp(0.75rem, 2vw, 0.875rem)', 
                            width: 'clamp(0.75rem, 2vw, 0.875rem)' 
                          }} /> 
                          {errors.agentName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label style={{ 
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                        fontWeight: '500',
                        color: 'hsl(200 25% 15%)',
                        display: 'block', 
                        marginBottom: 'clamp(0.375rem, 1.5vw, 0.5rem)' 
                      }}>
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={data.agentPhone || agentData.phone}
                        onChange={(e) => setData('agentPhone', e.target.value)}
                        style={{
                          width: '100%',
                          padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1rem)',
                          border: `1px solid ${errors.agentPhone ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}`,
                          borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
                          fontSize: 'clamp(0.875rem, 2vw, 0.875rem)',
                          fontFamily: 'inherit',
                          transition: 'all 0.2s'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = 'hsl(174 62% 32%)';
                          e.target.style.boxShadow = '0 0 0 2px hsl(174 62% 32% / 0.2)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = errors.agentPhone ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                      {errors.agentPhone && (
                        <p style={{ 
                          fontSize: 'clamp(0.75rem, 2vw, 0.75rem)', 
                          marginTop: 'clamp(0.25rem, 1vw, 0.375rem)', 
                          color: 'hsl(0 72% 51%)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'clamp(0.25rem, 1vw, 0.375rem)'
                        }}>
                          <AlertCircle style={{ 
                            height: 'clamp(0.75rem, 2vw, 0.875rem)', 
                            width: 'clamp(0.75rem, 2vw, 0.875rem)' 
                          }} /> 
                          {errors.agentPhone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label style={{ 
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                        fontWeight: '500',
                        color: 'hsl(200 25% 15%)',
                        display: 'block', 
                        marginBottom: 'clamp(0.375rem, 1.5vw, 0.5rem)' 
                      }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={data.agentEmail || agentData.email}
                        onChange={(e) => setData('agentEmail', e.target.value)}
                        style={{
                          width: '100%',
                          padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1rem)',
                          border: `1px solid ${errors.agentEmail ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}`,
                          borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
                          fontSize: 'clamp(0.875rem, 2vw, 0.875rem)',
                          fontFamily: 'inherit',
                          transition: 'all 0.2s'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = 'hsl(174 62% 32%)';
                          e.target.style.boxShadow = '0 0 0 2px hsl(174 62% 32% / 0.2)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = errors.agentEmail ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                      {errors.agentEmail && (
                        <p style={{ 
                          fontSize: 'clamp(0.75rem, 2vw, 0.75rem)', 
                          marginTop: 'clamp(0.25rem, 1vw, 0.375rem)', 
                          color: 'hsl(0 72% 51%)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'clamp(0.25rem, 1vw, 0.375rem)'
                        }}>
                          <AlertCircle style={{ 
                            height: 'clamp(0.75rem, 2vw, 0.875rem)', 
                            width: 'clamp(0.75rem, 2vw, 0.875rem)' 
                          }} /> 
                          {errors.agentEmail}
                        </p>
                      )}
                    </div>

                    {isAdmin ? (
                    /* Admin: full status control */
                    <div>
                        <label style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', fontWeight: '500', color: 'hsl(200 25% 15%)', display: 'block', marginBottom: 'clamp(0.375rem, 1.5vw, 0.5rem)' }}>
                            Status
                        </label>
                        <select
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            style={{
                                width: '100%',
                                padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1rem)',
                                border: `1px solid ${errors.status ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}`,
                                borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
                                fontSize: 'clamp(0.875rem, 2vw, 0.875rem)',
                                fontFamily: 'inherit',
                                backgroundColor: 'white',
                                appearance: 'none',
                                transition: 'all 0.2s'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = 'hsl(174 62% 32%)';
                                e.target.style.boxShadow = '0 0 0 2px hsl(174 62% 32% / 0.2)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = errors.status ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            <option value="active">Active</option>
                            <option value="rented">Rented</option>
                            <option value="sold">Sold</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        {errors.status && (
                          <p style={{ fontSize: 'clamp(0.75rem, 2vw, 0.75rem)', marginTop: 'clamp(0.25rem, 1vw, 0.375rem)', color: 'hsl(0 72% 51%)', display: 'flex', alignItems: 'center', gap: 'clamp(0.25rem, 1vw, 0.375rem)' }}>
                              <AlertCircle style={{ height: 'clamp(0.75rem, 2vw, 0.875rem)', width: 'clamp(0.75rem, 2vw, 0.875rem)' }} /> 
                              {errors.status}
                          </p>
                        )}
                    </div>
                ) : (
                    /* Agent: availability toggle (doesn't change status) */
                    <div>
                        <label style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', fontWeight: '500', color: 'hsl(200 25% 15%)', display: 'block', marginBottom: 'clamp(0.375rem, 1.5vw, 0.5rem)' }}>
                            Availability
                        </label>
                        <select
                            value={availability}
                            onChange={(e) => setAvailability(e.target.value)}
                            style={{
                                width: '100%',
                                padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1rem)',
                                border: '1px solid hsl(40 20% 88%)',
                                borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
                                fontSize: 'clamp(0.875rem, 2vw, 0.875rem)',
                                fontFamily: 'inherit',
                                backgroundColor: 'white',
                                appearance: 'none',
                                transition: 'all 0.2s'
                            }}
                        >
                            <option value="active">Active</option>
                            {data.purpose === 'sale' && <option value="sold">Sold</option>}
                            {data.purpose === 'rent' && <option value="rented">Rented</option>}
                        </select>
                        <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)', marginTop: '0.375rem' }}>
                            Mark the listing as no longer available. The approval status will not change.
                        </p>
                    </div>
                )}
                  </div>
                )}

                {/* Step 4: Review */}
                {currentStep === 4 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 3vw, 1.5rem)' }}>
                    <div>
                      <h2 style={{ 
                        color: 'hsl(200 25% 15%)',
                        fontSize: 'clamp(1.125rem, 4vw, 1.25rem)',
                        fontWeight: '700',
                        marginBottom: 'clamp(0.125rem, 1vw, 0.25rem)',
                        lineHeight: '1.2'
                      }}>
                        Review Your Listing
                      </h2>
                      <p style={{ 
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                        color: 'hsl(200 15% 45%)' 
                      }}>
                        Please review all details before submitting
                      </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 3vw, 1.5rem)' }}>
                      <div style={{ 
                        padding: 'clamp(1rem, 3vw, 1.25rem)',
                        borderRadius: 'clamp(0.5rem, 2vw, 0.75rem)',
                        backgroundColor: 'hsl(40 30% 94%)'
                      }}>
                        <h3 style={{ 
                          color: 'hsl(200 25% 15%)',
                          fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                          fontWeight: '600',
                          marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)'
                        }}>
                          Property Details
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.375rem, 1.5vw, 0.5rem)' }}>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '0.5rem'
                          }}>
                            <span style={{ 
                              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                              color: 'hsl(200 15% 45%)' 
                            }}>
                              Title:
                            </span>
                            <span style={{ 
                              fontSize: 'clamp(0.875rem, 2.5vw, 0.875rem)', 
                              color: 'hsl(200 25% 15%)',
                              fontWeight: '500',
                              textAlign: 'right'
                            }}>
                              {data.title}
                            </span>
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '0.5rem'
                          }}>
                            <span style={{ 
                              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                              color: 'hsl(200 15% 45%)' 
                            }}>
                              Type:
                            </span>
                            <span style={{ 
                              fontSize: 'clamp(0.875rem, 2.5vw, 0.875rem)', 
                              color: 'hsl(200 25% 15%)',
                              fontWeight: '500',
                              textAlign: 'right',
                              textTransform: 'capitalize'
                            }}>
                              {data.propertyType}
                            </span>
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '0.5rem'
                          }}>
                            <span style={{ 
                              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                              color: 'hsl(200 15% 45%)' 
                            }}>
                              Location:
                            </span>
                            <span style={{ 
                              fontSize: 'clamp(0.875rem, 2.5vw, 0.875rem)', 
                              color: 'hsl(200 25% 15%)',
                              fontWeight: '500',
                              textAlign: 'right'
                            }}>
                              {data.area}, {data.city}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={{ 
                        padding: 'clamp(1rem, 3vw, 1.25rem)',
                        borderRadius: 'clamp(0.5rem, 2vw, 0.75rem)',
                        backgroundColor: 'hsl(40 30% 94%)'
                      }}>
                        <h3 style={{ 
                          color: 'hsl(200 25% 15%)',
                          fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                          fontWeight: '600',
                          marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)'
                        }}>
                          Pricing & Features
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.375rem, 1.5vw, 0.5rem)' }}>
                         {rental.purpose === 'sale' ? (
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '0.5rem'
                        }}>
                          <span style={{ 
                              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                              color: 'hsl(200 15% 45%)' 
                            }}>
                            Sale Price
                          </span>
                            <span style={{ 
                              fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', 
                              fontWeight: '600',
                              color: 'hsl(174 62% 32%)',
                              textAlign: 'right'
                            }}>
                            GH₵{Number(rental.sale_price || 0).toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '0.5rem'
                          }}>
                            <span style={{ 
                              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                              color: 'hsl(200 15% 45%)' 
                            }}>
                              Monthly Rent:
                            </span>
                            <span style={{ 
                              fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', 
                              fontWeight: '600',
                              color: 'hsl(174 62% 32%)',
                              textAlign: 'right'
                            }}>
                              GH₵{data.rentMin ? Number(data.rentMin).toLocaleString() : '0'} - 
                              GH₵{data.rentMax ? Number(data.rentMax).toLocaleString() : '0'}
                            </span>
                          </div>

                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '0.5rem'
                          }}>
                            <span style={{ 
                              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                              color: 'hsl(200 15% 45%)' 
                            }}>
                              Advance Duration:
                            </span>
                            <span style={{ 
                              fontSize: 'clamp(0.875rem, 2.5vw, 0.875rem)', 
                              color: 'hsl(200 25% 15%)',
                              fontWeight: '500',
                              textAlign: 'right'
                            }}>
                              {data.advanceDuration} {data.advanceDuration === '1' ? 'Month' : 'Months'}
                            </span>
                          </div>
                          </>
                      )}
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '0.5rem'
                          }}>
                            <span style={{ 
                              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                              color: 'hsl(200 15% 45%)' 
                            }}>
                              Bedrooms:
                            </span>
                            <span style={{ 
                              fontSize: 'clamp(0.875rem, 2.5vw, 0.875rem)', 
                              color: 'hsl(200 25% 15%)',
                              fontWeight: '500',
                              textAlign: 'right'
                            }}>
                              {data.bedrooms || '0'}
                            </span>
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '0.5rem'
                          }}>
                            <span style={{ 
                              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                              color: 'hsl(200 15% 45%)' 
                            }}>
                              Bedrooms:
                            </span>
                            <span style={{ 
                              fontSize: 'clamp(0.875rem, 2.5vw, 0.875rem)', 
                              color: 'hsl(200 25% 15%)',
                              fontWeight: '500',
                              textAlign: 'right'
                            }}>
                              {data.bedrooms || '0'}
                            </span>
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '0.5rem'
                          }}>
                            <span style={{ 
                              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                              color: 'hsl(200 15% 45%)' 
                            }}>
                              Description:
                            </span>
                            <span style={{ 
                              fontSize: 'clamp(0.875rem, 2.5vw, 0.875rem)', 
                              color: 'hsl(200 25% 15%)',
                              fontWeight: '500',
                              textAlign: 'right'
                            }}>
                              {data.description}
                            </span>
                          </div>
                          {data.amenities.length > 0 && (
                            <div style={{ 
                              paddingTop: 'clamp(0.75rem, 2vw, 1rem)',
                              marginTop: 'clamp(0.5rem, 2vw, 0.75rem)',
                              borderTop: '1px solid hsl(40 20% 88%)'
                            }}>
                              <span style={{ 
                                fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                                color: 'hsl(200 15% 45%)',
                                display: 'block',
                                marginBottom: 'clamp(0.5rem, 2vw, 0.5rem)'
                              }}>
                                Amenities:
                              </span>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(0.375rem, 1.5vw, 0.5rem)' }}>
                                {data.amenities.map(amenity => (
                                  <span 
                                    key={amenity}
                                    style={{ 
                                      padding: 'clamp(0.25rem, 1vw, 0.375rem) clamp(0.5rem, 2vw, 0.75rem)',
                                      borderRadius: 'clamp(0.25rem, 1.5vw, 0.375rem)',
                                      fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)',
                                      fontWeight: '500',
                                      backgroundColor: 'hsl(174 62% 32% / 0.1)',
                                      color: 'hsl(174 62% 32%)'
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

                      <div style={{ 
                        padding: 'clamp(1rem, 3vw, 1.25rem)',
                        borderRadius: 'clamp(0.5rem, 2vw, 0.75rem)',
                        backgroundColor: 'hsl(40 30% 94%)'
                      }}>
                        <h3 style={{ 
                          color: 'hsl(200 25% 15%)',
                          fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                          fontWeight: '600',
                          marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)'
                        }}>
                          Contact Information
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.375rem, 1.5vw, 0.5rem)' }}>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '0.5rem'
                          }}>
                            <span style={{ 
                              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                              color: 'hsl(200 15% 45%)' 
                            }}>
                              Name:
                            </span>
                            <span style={{ 
                              fontSize: 'clamp(0.875rem, 2.5vw, 0.875rem)', 
                              color: 'hsl(200 25% 15%)',
                              fontWeight: '500',
                              textAlign: 'right'
                            }}>
                              {data.agentName}
                            </span>
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '0.5rem'
                          }}>
                            <span style={{ 
                              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                              color: 'hsl(200 15% 45%)' 
                            }}>
                              Phone:
                            </span>
                            <span style={{ 
                              fontSize: 'clamp(0.875rem, 2.5vw, 0.875rem)', 
                              color: 'hsl(200 25% 15%)',
                              fontWeight: '500',
                              textAlign: 'right'
                            }}>
                              {data.agentPhone}
                            </span>
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '0.5rem'
                          }}>
                            <span style={{ 
                              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                              color: 'hsl(200 15% 45%)' 
                            }}>
                              Email:
                            </span>
                            <span style={{ 
                              fontSize: 'clamp(0.875rem, 2.5vw, 0.875rem)', 
                              color: 'hsl(200 25% 15%)',
                              fontWeight: '500',
                              textAlign: 'right'
                            }}>
                              {data.agentEmail}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={{ padding: 'clamp(1rem, 3vw, 1.25rem)', borderRadius: 'clamp(0.5rem, 2vw, 0.75rem)', backgroundColor: 'hsl(40 30% 94%)' }}>
                        <h3 style={{ color: 'hsl(200 25% 15%)', fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', fontWeight: '600', marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)' }}>
                            {isAdmin ? 'Status Update' : 'Availability'}
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.375rem, 1.5vw, 0.5rem)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                                <span style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', color: 'hsl(200 15% 45%)' }}>
                                    {isAdmin ? 'Status:' : 'Availability:'}
                                </span>
                                <span style={{ fontSize: 'clamp(0.875rem, 2.5vw, 0.875rem)', color: 'hsl(200 25% 15%)', fontWeight: '500', textAlign: 'right', textTransform: 'capitalize' }}>
                                    {isAdmin ? data.status : availability}
                                </span>
                            </div>
                        </div>
                      </div>

                      {allImages.length > 0 && (
                        <div style={{ 
                          padding: 'clamp(1rem, 3vw, 1.25rem)',
                          borderRadius: 'clamp(0.5rem, 2vw, 0.75rem)',
                          backgroundColor: 'hsl(40 30% 94%)'
                        }}>
                          <h3 style={{ 
                            color: 'hsl(200 25% 15%)',
                            fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                            fontWeight: '600',
                            marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)'
                          }}>
                            Images ({allImages.length})
                          </h3>
                          <div className="images-grid" style={{
                            display: 'grid',
                            gap: 'clamp(0.5rem, 2vw, 0.75rem)'
                          }}>
                            {allImages.map(image => (
                              <div key={image.id} style={{ 
                                aspectRatio: '1 / 1',
                                backgroundColor: 'hsl(40 30% 94%)',
                                borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
                                overflow: 'hidden'
                              }}>
                                <img 
                                  src={image.preview} 
                                  alt={image.name} 
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                  }} 
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div style={{ 
                      padding: 'clamp(0.75rem, 3vw, 1rem)',
                      borderRadius: 'clamp(0.5rem, 2vw, 0.75rem)',
                      backgroundColor: 'hsl(152 60% 40% / 0.1)',
                      border: '1px solid hsl(152 60% 40% / 0.2)'
                    }}>
                      <div style={{ display: 'flex', gap: 'clamp(0.5rem, 2vw, 0.75rem)' }}>
                        <CheckCircle2 style={{ 
                          height: 'clamp(1rem, 3vw, 1.25rem)', 
                          width: 'clamp(1rem, 3vw, 1.25rem)',
                          color: 'hsl(152 60% 40%)',
                          flexShrink: 0
                        }} />
                        <div>
                          <p style={{ 
                            fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                            fontWeight: '500',
                            color: 'hsl(200 25% 15%)',
                            marginBottom: 'clamp(0.25rem, 1vw, 0.375rem)'
                          }}>
                            What happens next?
                          </p>
                          <ul style={{ 
                            fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                            color: 'hsl(200 15% 45%)',
                            paddingLeft: '1.25rem',
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
                <div className="button-container" style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: 'clamp(1rem, 3vw, 1.5rem)',
                  marginTop: 'clamp(1rem, 3vw, 2rem)',
                  borderTop: '1px solid hsl(40 20% 88%)',
                  gap: 'clamp(0.5rem, 2vw, 1rem)'
                }}>
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevious}
                      disabled={isSubmitting}
                      className="action-button"
                      style={{
                        padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(1.5rem, 4vw, 2rem)',
                        borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
                        border: '1px solid hsl(40 20% 88%)',
                        color: 'hsl(200 25% 15%)',
                        backgroundColor: 'white',
                        fontWeight: '600',
                        fontSize: 'clamp(0.875rem, 2vw, 0.875rem)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'hsl(40 30% 96%)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
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
                      disabled={isSubmitting}
                      className="action-button"
                      style={{
                        padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(1.5rem, 4vw, 2rem)',
                        borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
                        backgroundColor: 'hsl(174 62% 32%)',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: 'clamp(0.875rem, 2vw, 0.875rem)',
                        cursor: 'pointer',
                        border: 'none',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'hsl(174 50% 25%)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'hsl(174 62% 32%)';
                      }}
                    >
                      Next Step
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="action-button"
                      style={{
                        padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(1.5rem, 4vw, 2rem)',
                        borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
                        background: 'linear-gradient(135deg, hsl(38 92% 50%) 0%, hsl(30 90% 45%) 100%)',
                        color: 'hsl(200 25% 10%)',
                        fontWeight: '600',
                        fontSize: 'clamp(0.875rem, 2vw, 0.875rem)',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        border: 'none',
                        transition: 'all 0.2s',
                        opacity: isSubmitting ? 0.7 : 1
                      }}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Listing'}
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

export default EditRentals;