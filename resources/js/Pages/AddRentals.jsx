import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Home, MapPin, DollarSign, Calendar, Image, FileText, CheckCircle2, AlertCircle, Upload, X } from 'lucide-react';

const AddRentalPage = () => {

  const { data, setData, post, processing, errors, reset } = useForm({
    title: '',
    propertyType: '',
    area: '',
    city: '',
    address: '',
    monthlyRent: '',
    advanceDuration: '1',
    bedrooms: '',
    bathrooms: '',
    amenities: [],
    description: '',
    agentName: '',
    agentPhone: '',
    agentEmail: ''
  });

  const [images, setImages] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  const propertyTypes = ['Apartment', 'House', 'Studio', 'Chamber and Hall', 'Self-Contained', 'Condo', 'Townhouse'];
  const cities = ['Accra', 'Kumasi', 'Tema', 'Takoradi', 'Cape Coast', 'Tamale'];
  const amenitiesList = ['Wi-Fi', 'Parking', 'Security', 'Water Supply', 'Backup Generator', 'Air Conditioning', 'Furnished', 'Gym', 'Swimming Pool', 'Garden'];

  const handleAmenityToggle = (amenity) => {
    const updatedAmenities = data.amenities.includes(amenity)
      ? data.amenities.filter(a => a !== amenity)
      : [...data.amenities, amenity];
    setData('amenities', updatedAmenities);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      file: file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages].slice(0, 6));
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const validateStep = (step) => {
    if (step === 1) {
      return data.title && data.propertyType && data.city && data.area;
    } else if (step === 2) {
      return data.monthlyRent && data.bedrooms && data.advanceDuration;
    } else if (step === 3) {
      return data.agentName && data.agentPhone && data.agentEmail;
    }
    return true;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = (e) => {
    e.preventDefault();
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      const formData = new FormData();
      
      // Add all form fields
      formData.append('title', data.title);
      formData.append('propertyType', data.propertyType);
      formData.append('area', data.area);
      formData.append('city', data.city);
      formData.append('address', data.address || '');
      formData.append('monthlyRent', data.monthlyRent);
      formData.append('advanceDuration', data.advanceDuration);
      formData.append('bedrooms', data.bedrooms);
      formData.append('bathrooms', data.bathrooms || '0');
      formData.append('amenities', JSON.stringify(data.amenities));
      formData.append('description', data.description || '');
      formData.append('agentName', data.agentName);
      formData.append('agentPhone', data.agentPhone);
      formData.append('agentEmail', data.agentEmail);
      
      // Add images - each image as a separate field
      images.forEach((image, index) => {
        if (image.file) {
          formData.append(`images[]`, image.file);
        }
      });
      
      post('/rent', {
        data: formData,
        forceFormData: true,
        onSuccess: () => {
          alert('Listing submitted successfully!');
          reset();
          setImages([]);
          setCurrentStep(1);
        },
        onError: (errors) => {
          console.error('Submission errors:', errors);
        }
      });
    }
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
      `}</style>

      <div className="min-h-screen" style={{ backgroundColor: 'hsl(40 33% 98%)' }}>

        {/* Progress Steps */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center gap-2">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300"
                      style={{
                        backgroundColor: currentStep >= step.number ? 'hsl(174 62% 32%)' : 'hsl(40 30% 94%)',
                        color: currentStep >= step.number ? 'white' : 'hsl(200 15% 45%)'
                      }}
                    >
                      {currentStep > step.number ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : (
                        <step.icon className="h-6 w-6" />
                      )}
                    </div>
                    <span 
                      className="text-xs font-medium hidden sm:block text-center"
                      style={{ color: currentStep >= step.number ? 'hsl(174 62% 32%)' : 'hsl(200 15% 45%)' }}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div 
                      className="flex-1 h-1 mx-2 rounded transition-all duration-300"
                      style={{ 
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
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8" style={{ borderColor: 'hsl(40 20% 88%)' }}>
              <form onSubmit={handleSubmit}>
              {/* Step 1: Property Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-1 tracking-tight" style={{ color: 'hsl(200 25% 15%)' }}>
                      Property Details
                    </h2>
                    <p className="text-sm" style={{ color: 'hsl(200 15% 45%)' }}>
                      Tell us about the property you're listing
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(200 25% 15%)' }}>
                      Property Title *
                    </label>
                    <input
                      type="text"
                      value={data.title}
                      onChange={(e) => setData('title', e.target.value)}
                      placeholder="e.g., 2 Bedroom Self-Contained Apartment"
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all"
                      style={{ borderColor: errors.title ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)' }}
                    />
                    {errors.title && (
                      <p className="text-sm mt-1 flex items-center gap-1" style={{ color: 'hsl(0 72% 51%)' }}>
                        <AlertCircle className="h-4 w-4" /> {errors.title}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(200 25% 15%)' }}>
                        Property Type *
                      </label>
                      <select
                        value={data.propertyType}
                        onChange={(e) => setData('propertyType', e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all appearance-none"
                        style={{ borderColor: errors.propertyType ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)' }}
                      >
                        <option value="">Select type</option>
                        {propertyTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      {errors.propertyType && (
                        <p className="text-sm mt-1 flex items-center gap-1" style={{ color: 'hsl(0 72% 51%)' }}>
                          <AlertCircle className="h-4 w-4" /> {errors.propertyType}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(200 25% 15%)' }}>
                        City *
                      </label>
                      <select
                        value={data.city}
                        onChange={(e) => setData('city', e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all appearance-none"
                        style={{ borderColor: errors.city ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)' }}
                      >
                        <option value="">Select city</option>
                        {cities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                      {errors.city && (
                        <p className="text-sm mt-1 flex items-center gap-1" style={{ color: 'hsl(0 72% 51%)' }}>
                          <AlertCircle className="h-4 w-4" /> {errors.city}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(200 25% 15%)' }}>
                      Area/Neighborhood *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'hsl(200 15% 45%)' }} />
                      <input
                        type="text"
                        value={data.area}
                        onChange={(e) => setData('area', e.target.value)}
                        placeholder="e.g., East Legon, Spintex"
                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 transition-all"
                        style={{ borderColor: errors.area ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)' }}
                      />
                    </div>
                    {errors.area && (
                      <p className="text-sm mt-1 flex items-center gap-1" style={{ color: 'hsl(0 72% 51%)' }}>
                        <AlertCircle className="h-4 w-4" /> {errors.area}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(200 25% 15%)' }}>
                      Full Address
                    </label>
                    <textarea
                      value={data.address}
                      onChange={(e) => setData('address', e.target.value)}
                      placeholder="Enter the complete address (optional)"
                      rows={3}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all resize-none"
                      style={{ borderColor: 'hsl(40 20% 88%)' }}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Pricing & Features */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-1 tracking-tight" style={{ color: 'hsl(200 25% 15%)' }}>
                      Pricing & Features
                    </h2>
                    <p className="text-sm" style={{ color: 'hsl(200 15% 45%)' }}>
                      Help tenants understand the cost and features
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(200 25% 15%)' }}>
                        Monthly Rent (GH₵) *
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'hsl(200 15% 45%)' }} />
                        <input
                          type="number"
                          value={data.monthlyRent}
                          onChange={(e) => setData('monthlyRent', e.target.value)}
                          placeholder="1500"
                          className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 transition-all"
                          style={{ borderColor: errors.monthlyRent ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)' }}
                        />
                      </div>
                      {errors.monthlyRent && (
                        <p className="text-sm mt-1 flex items-center gap-1" style={{ color: 'hsl(0 72% 51%)' }}>
                          <AlertCircle className="h-4 w-4" /> {errors.monthlyRent}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(200 25% 15%)' }}>
                        Advance Duration *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'hsl(200 15% 45%)' }} />
                        <select
                          value={data.advanceDuration}
                          onChange={(e) => setData('advanceDuration', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 transition-all appearance-none"
                          style={{ borderColor: 'hsl(40 20% 88%)' }}
                        >
                          <option value="1">1 Year</option>
                          <option value="2">2 Years</option>
                          <option value="3">3 Years</option>
                          <option value="4">4 Years</option>
                          <option value="5">5 Years</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(200 25% 15%)' }}>
                        Bedrooms *
                      </label>
                      <input
                        type="number"
                        value={data.bedrooms}
                        onChange={(e) => setData('bedrooms', e.target.value)}
                        placeholder="2"
                        min="0"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all"
                        style={{ borderColor: errors.bedrooms ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)' }}
                      />
                      {errors.bedrooms && (
                        <p className="text-sm mt-1 flex items-center gap-1" style={{ color: 'hsl(0 72% 51%)' }}>
                          <AlertCircle className="h-4 w-4" /> {errors.bedrooms}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(200 25% 15%)' }}>
                        Bathrooms
                      </label>
                      <input
                        type="number"
                        value={data.bathrooms}
                        onChange={(e) => setData('bathrooms', e.target.value)}
                        placeholder="1"
                        min="0"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all"
                        style={{ borderColor: 'hsl(40 20% 88%)' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3" style={{ color: 'hsl(200 25% 15%)' }}>
                      Amenities
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {amenitiesList.map(amenity => (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => handleAmenityToggle(amenity)}
                          className="px-4 py-2 rounded-lg border text-sm font-medium transition-all"
                          style={{
                            borderColor: data.amenities.includes(amenity) ? 'hsl(174 62% 32%)' : 'hsl(40 20% 88%)',
                            backgroundColor: data.amenities.includes(amenity) ? 'hsl(174 62% 32% / 0.1)' : 'white',
                            color: data.amenities.includes(amenity) ? 'hsl(174 62% 32%)' : 'hsl(200 25% 15%)'
                          }}
                        >
                          {data.amenities.includes(amenity) && <CheckCircle2 className="inline h-4 w-4 mr-1" />}
                          {amenity}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(200 25% 15%)' }}>
                      Property Description
                    </label>
                    <textarea
                      value={data.description}
                      onChange={(e) => setData('description', e.target.value)}
                      placeholder="Describe the property, its condition, nearby facilities, and any other relevant details..."
                      rows={5}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all resize-none"
                      style={{ borderColor: 'hsl(40 20% 88%)' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3" style={{ color: 'hsl(200 25% 15%)' }}>
                      Property Images (Max 6)
                    </label>
                    <div className="space-y-3">
                      {images.length < 6 && (
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors hover:border-opacity-60"
                          style={{ borderColor: 'hsl(174 62% 32%)', backgroundColor: 'hsl(174 62% 32% / 0.05)' }}
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="h-8 w-8 mb-2" style={{ color: 'hsl(174 62% 32%)' }} />
                            <p className="text-sm font-medium" style={{ color: 'hsl(174 62% 32%)' }}>
                              Click to upload images
                            </p>
                            <p className="text-xs" style={{ color: 'hsl(200 15% 45%)' }}>
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
                        <div className="grid grid-cols-3 gap-3">
                          {images.map(image => (
                            <div key={image.id} className="relative group">
                              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                                <img src={image.preview} alt={image.name} className="w-full h-full object-cover" />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeImage(image.id)}
                                className="absolute top-2 right-2 p-1 rounded-full transition-opacity opacity-0 group-hover:opacity-100"
                                style={{ backgroundColor: 'hsl(0 72% 51%)' }}
                              >
                                <X className="h-4 w-4 text-white" />
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
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-1 tracking-tight" style={{ color: 'hsl(200 25% 15%)' }}>
                      Contact Information
                    </h2>
                    <p className="text-sm" style={{ color: 'hsl(200 15% 45%)' }}>
                      How should tenants reach you?
                    </p>
                  </div>

                  <div 
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: 'hsl(38 92% 50% / 0.1)', border: '1px solid hsl(38 92% 50% / 0.2)' }}
                  >
                    <p className="text-sm" style={{ color: 'hsl(200 25% 10%)' }}>
                      <strong>⚠️ Important:</strong> Your contact information will be visible to interested tenants. 
                      Make sure it's accurate and up-to-date.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(200 25% 15%)' }}>
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={data.agentName}
                      onChange={(e) => setData('agentName', e.target.value)}
                      placeholder="Full name or business name"
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all"
                      style={{ borderColor: errors.agentName ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)' }}
                    />
                    {errors.agentName && (
                      <p className="text-sm mt-1 flex items-center gap-1" style={{ color: 'hsl(0 72% 51%)' }}>
                        <AlertCircle className="h-4 w-4" /> {errors.agentName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(200 25% 15%)' }}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={data.agentPhone}
                      onChange={(e) => setData('agentPhone', e.target.value)}
                      placeholder="+233 XX XXX XXXX"
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all"
                      style={{ borderColor: errors.agentPhone ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)' }}
                    />
                    {errors.agentPhone && (
                      <p className="text-sm mt-1 flex items-center gap-1" style={{ color: 'hsl(0 72% 51%)' }}>
                        <AlertCircle className="h-4 w-4" /> {errors.agentPhone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(200 25% 15%)' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={data.agentEmail}
                      onChange={(e) => setData('agentEmail', e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all"
                      style={{ borderColor: errors.agentEmail ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)' }}
                    />
                    {errors.agentEmail && (
                      <p className="text-sm mt-1 flex items-center gap-1" style={{ color: 'hsl(0 72% 51%)' }}>
                        <AlertCircle className="h-4 w-4" /> {errors.agentEmail}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-1 tracking-tight" style={{ color: 'hsl(200 25% 15%)' }}>
                      Review Your Listing
                    </h2>
                    <p className="text-sm" style={{ color: 'hsl(200 15% 45%)' }}>
                      Please review all details before submitting
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'hsl(40 30% 94%)' }}>
                      <h3 className="font-semibold mb-3" style={{ color: 'hsl(200 25% 15%)' }}>Property Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span style={{ color: 'hsl(200 15% 45%)' }}>Title:</span>
                          <span style={{ color: 'hsl(200 25% 15%)' }}>{data.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: 'hsl(200 15% 45%)' }}>Type:</span>
                          <span style={{ color: 'hsl(200 25% 15%)' }}>{data.propertyType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: 'hsl(200 15% 45%)' }}>Location:</span>
                          <span style={{ color: 'hsl(200 25% 15%)' }}>{data.area}, {data.city}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'hsl(40 30% 94%)' }}>
                      <h3 className="font-semibold mb-3" style={{ color: 'hsl(200 25% 15%)' }}>Pricing & Features</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span style={{ color: 'hsl(200 15% 45%)' }}>Monthly Rent:</span>
                          <span className="font-semibold" style={{ color: 'hsl(174 62% 32%)' }}>
                            GH₵{data.monthlyRent ? Number(data.monthlyRent).toLocaleString() : '0'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: 'hsl(200 15% 45%)' }}>Advance Duration:</span>
                          <span style={{ color: 'hsl(200 25% 15%)' }}>{data.advanceDuration} {data.advanceDuration === '1' ? 'Year' : 'Years'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: 'hsl(200 15% 45%)' }}>Bedrooms:</span>
                          <span style={{ color: 'hsl(200 25% 15%)' }}>{data.bedrooms || '0'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: 'hsl(200 15% 45%)' }}>Bathrooms:</span>
                          <span style={{ color: 'hsl(200 25% 15%)' }}>{data.bathrooms || '0'}</span>
                        </div>
                        {data.amenities.length > 0 && (
                          <div className="pt-2 mt-2 border-t" style={{ borderColor: 'hsl(40 20% 88%)' }}>
                            <span className="block mb-2" style={{ color: 'hsl(200 15% 45%)' }}>Amenities:</span>
                            <div className="flex flex-wrap gap-2">
                              {data.amenities.map(amenity => (
                                <span 
                                  key={amenity}
                                  className="px-2 py-1 rounded text-xs font-medium"
                                  style={{ 
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

                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'hsl(40 30% 94%)' }}>
                      <h3 className="font-semibold mb-3" style={{ color: 'hsl(200 25% 15%)' }}>Contact Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span style={{ color: 'hsl(200 15% 45%)' }}>Name:</span>
                          <span style={{ color: 'hsl(200 25% 15%)' }}>{data.agentName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: 'hsl(200 15% 45%)' }}>Phone:</span>
                          <span style={{ color: 'hsl(200 25% 15%)' }}>{data.agentPhone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: 'hsl(200 15% 45%)' }}>Email:</span>
                          <span style={{ color: 'hsl(200 25% 15%)' }}>{data.agentEmail}</span>
                        </div>
                      </div>
                    </div>

                    {images.length > 0 && (
                      <div className="p-4 rounded-lg" style={{ backgroundColor: 'hsl(40 30% 94%)' }}>
                        <h3 className="font-semibold mb-3" style={{ color: 'hsl(200 25% 15%)' }}>
                          Images ({images.length})
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
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
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: 'hsl(152 60% 40% / 0.1)', border: '1px solid hsl(152 60% 40% / 0.2)' }}
                  >
                    <div className="flex gap-3">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: 'hsl(152 60% 40%)' }} />
                      <div>
                        <p className="text-sm font-medium mb-1" style={{ color: 'hsl(200 25% 15%)' }}>
                          What happens next?
                        </p>
                        <ul className="text-sm space-y-1" style={{ color: 'hsl(200 15% 45%)' }}>
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
              <div className="flex justify-between pt-6 border-t mt-8" style={{ borderColor: 'hsl(40 20% 88%)' }}>
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={processing}
                    className="px-6 py-3 rounded-lg font-semibold transition-colors border"
                    style={{ 
                      borderColor: 'hsl(40 20% 88%)',
                      color: 'hsl(200 25% 15%)'
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
                    className="px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 active:scale-95"
                    style={{ backgroundColor: 'hsl(174 62% 32%)' }}
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={processing}
                    className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50"
                    style={{ 
                      background: 'linear-gradient(135deg, hsl(38 92% 50%) 0%, hsl(30 90% 45%) 100%)',
                      color: 'hsl(200 25% 10%)'
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