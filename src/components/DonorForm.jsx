// import React, { useState } from 'react';
// import { CheckCircle, AlertCircle } from 'lucide-react';

// export default function DonorForm({ onSubmitSuccess }) {
//   const [formData, setFormData] = useState({
//     fullName: '', email: '', phone: '', age: '', bloodType: '', address: '',
//     city: '', lastDonation: '', medicalConditions: '', emergencyContact: '', emergencyPhone: ''
//   });

//   const [errors, setErrors] = useState({});
//   const [submitStatus, setSubmitStatus] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.fullName.trim() || formData.fullName.length < 3)
//       newErrors.fullName = 'Full name must be at least 3 characters';
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) newErrors.email = 'Please enter a valid email address';
//     const phoneRegex = /^\d{10}$/;
//     if (!phoneRegex.test(formData.phone.replace(/\D/g, '')))
//       newErrors.phone = 'Phone number must be 10 digits';
//     const age = parseInt(formData.age);
//     if (!age || age < 18 || age > 65) newErrors.age = 'Age must be between 18 and 65';
//     if (!formData.bloodType) newErrors.bloodType = 'Please select your blood type';
//     if (!formData.city.trim()) newErrors.city = 'City is required';
//     if (formData.emergencyContact.trim().length < 3)
//       newErrors.emergencyContact = 'Emergency contact name is required';
//     if (!phoneRegex.test(formData.emergencyPhone.replace(/\D/g, '')))
//       newErrors.emergencyPhone = 'Emergency phone must be 10 digits';

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) {
//       setSubmitStatus('error');
//       setTimeout(() => setSubmitStatus(null), 3000);
//       return;
//     }

//     setIsSubmitting(true);
//     await new Promise(resolve => setTimeout(resolve, 800));

//     const newDonor = {
//       ...formData,
//       id: Date.now(),
//       registeredAt: new Date().toISOString()
//     };

//     onSubmitSuccess(newDonor);

//     setSubmitStatus('success');
//     setIsSubmitting(false);

//     setTimeout(() => {
//       setSubmitStatus(null);
//       setFormData({
//         fullName: '', email: '', phone: '', age: '', bloodType: '', address: '',
//         city: '', lastDonation: '', medicalConditions: '', emergencyContact: '', emergencyPhone: ''
//       });
//     }, 1500);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
//   };

//   return (
//     <div className="space-y-6">
//       <div className="grid md:grid-cols-2 gap-6">
//         {/* Full Name */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
//           <input type="text" name="fullName" value={formData.fullName} onChange={handleChange}
//             className={`w-full px-4 py-3 rounded-xl border-2 ${errors.fullName ? 'border-red-500' : 'border-gray-200'} focus:border-red-500 focus:outline-none transition-all`}
//             placeholder="John Doe" />
//           {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
//         </div>

//         {/* Email */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
//           <input type="email" name="email" value={formData.email} onChange={handleChange}
//             className={`w-full px-4 py-3 rounded-xl border-2 ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:border-red-500 focus:outline-none transition-all`}
//             placeholder="john@example.com" />
//           {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
//         </div>

//         {/* Phone */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
//           <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
//             className={`w-full px-4 py-3 rounded-xl border-2 ${errors.phone ? 'border-red-500' : 'border-gray-200'} focus:border-red-500 focus:outline-none transition-all`}
//             placeholder="9876543210" />
//           {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
//         </div>

//         {/* Age */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">Age *</label>
//           <input type="number" name="age" value={formData.age} onChange={handleChange}
//             className={`w-full px-4 py-3 rounded-xl border-2 ${errors.age ? 'border-red-500' : 'border-gray-200'} focus:border-red-500 focus:outline-none transition-all`}
//             placeholder="25" />
//           {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
//         </div>

//         {/* Blood Type */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">Blood Type *</label>
//           <select name="bloodType" value={formData.bloodType} onChange={handleChange}
//             className={`w-full px-4 py-3 rounded-xl border-2 ${errors.bloodType ? 'border-red-500' : 'border-gray-200'} focus:border-red-500 focus:outline-none transition-all`}>
//             <option value="">Select Blood Type</option>
//             <option value="A+">A+</option><option value="A-">A-</option>
//             <option value="B+">B+</option><option value="B-">B-</option>
//             <option value="AB+">AB+</option><option value="AB-">AB-</option>
//             <option value="O+">O+</option><option value="O-">O-</option>
//           </select>
//           {errors.bloodType && <p className="text-red-500 text-sm mt-1">{errors.bloodType}</p>}
//         </div>

//         {/* City */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
//           <input type="text" name="city" value={formData.city} onChange={handleChange}
//             className={`w-full px-4 py-3 rounded-xl border-2 ${errors.city ? 'border-red-500' : 'border-gray-200'} focus:border-red-500 focus:outline-none transition-all`}
//             placeholder="Mumbai" />
//           {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
//         </div>

//         {/* Address (full width) */}
//         <div className="md:col-span-2">
//           <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
//           <input type="text" name="address" value={formData.address} onChange={handleChange}
//             className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none transition-all"
//             placeholder="Street Address" />
//         </div>

//         {/* Last Donation */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">Last Donation Date</label>
//           <input type="date" name="lastDonation" value={formData.lastDonation} onChange={handleChange}
//             className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none transition-all" />
//         </div>

//         {/* Emergency Contact */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Contact Name *</label>
//           <input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange}
//             className={`w-full px-4 py-3 rounded-xl border-2 ${errors.emergencyContact ? 'border-red-500' : 'border-gray-200'} focus:border-red-500 focus:outline-none transition-all`}
//             placeholder="Jane Doe" />
//           {errors.emergencyContact && <p className="text-red-500 text-sm mt-1">{errors.emergencyContact}</p>}
//         </div>

//         {/* Emergency Phone */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Phone *</label>
//           <input type="tel" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange}
//             className={`w-full px-4 py-3 rounded-xl border-2 ${errors.emergencyPhone ? 'border-red-500' : 'border-gray-200'} focus:border-red-500 focus:outline-none transition-all`}
//             placeholder="9876543210" />
//           {errors.emergencyPhone && <p className="text-red-500 text-sm mt-1">{errors.emergencyPhone}</p>}
//         </div>

//         {/* Medical Conditions (full width) */}
//         <div className="md:col-span-2">
//           <label className="block text-sm font-semibold text-gray-700 mb-2">Medical Conditions (if any)</label>
//           <textarea name="medicalConditions" value={formData.medicalConditions} onChange={handleChange} rows="3"
//             className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none transition-all"
//             placeholder="List any medical conditions or medications" />
//         </div>
//       </div>

//       {/* Submit Button */}
//       <button
//         onClick={handleSubmit}
//         disabled={isSubmitting}
//         className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//       >
//         {isSubmitting ? 'Registering...' : 'Register as Donor'}
//       </button>

//       {/* Status Messages */}
//       {submitStatus === 'success' && (
//         <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 p-4 rounded-xl">
//           <CheckCircle className="w-6 h-6" />
//           <span className="font-semibold">Registration Successful! Redirecting to dashboard...</span>
//         </div>
//       )}
//       {submitStatus === 'error' && (
//         <div className="flex items-center justify-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl">
//           <AlertCircle className="w-6 h-6" />
//           <span className="font-semibold">Please fix the errors above</span>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  User, Mail, Phone, Calendar, MapPin, Droplet, 
  AlertCircle, CheckCircle, Stethoscope, Users,
  ChevronDown, ChevronUp
} from 'lucide-react';

const DonorForm = ({ onSubmit, initialData = null, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    bloodType: '',
    address: '',
    city: '',
    lastDonation: '',
    medicalConditions: '',
    emergencyContact: '',
    emergencyPhone: '',
    gender: '',
    weight: '',
    hemoglobin: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
    'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
    'Surat', 'Kanpur', 'Nagpur', 'Indore', 'Thane'
  ];

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const validateForm = () => {
    const newErrors = {};
    
    // Basic validations
    if (!formData.fullName.trim() || formData.fullName.length < 3) {
      newErrors.fullName = 'Full name must be at least 3 characters';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    const age = parseInt(formData.age);
    if (!age || age < 18 || age > 65) {
      newErrors.age = 'Age must be between 18 and 65 years';
    }
    
    if (!formData.bloodType) {
      newErrors.bloodType = 'Please select your blood type';
    }
    
    if (!formData.city) {
      newErrors.city = 'Please select your city';
    }

    if (!formData.gender) {
      newErrors.gender = 'Please select gender';
    }

    const weight = parseFloat(formData.weight);
    if (weight && weight < 50) {
      newErrors.weight = 'Minimum weight required is 50kg';
    }

    if (formData.emergencyContact && formData.emergencyContact.length < 3) {
      newErrors.emergencyContact = 'Emergency contact name is required';
    }

    if (formData.emergencyPhone && !phoneRegex.test(formData.emergencyPhone.replace(/\D/g, ''))) {
      newErrors.emergencyPhone = 'Emergency phone must be 10 digits';
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    setFormValid(isValid);
    return isValid;
  };

  useEffect(() => {
    validateForm();
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const donorData = {
        ...formData,
        id: mode === 'create' ? Date.now() : formData.id,
        registeredAt: mode === 'create' ? new Date().toISOString() : formData.registeredAt,
        lastUpdated: new Date().toISOString(),
        status: mode === 'create' ? 'pending' : formData.status
      };

      onSubmit(donorData);
      
      if (mode === 'create') {
        // Reset form for new entry
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          age: '',
          bloodType: '',
          address: '',
          city: '',
          lastDonation: '',
          medicalConditions: '',
          emergencyContact: '',
          emergencyPhone: '',
          gender: '',
          weight: '',
          hemoglobin: ''
        });
      }
      
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputField = ({ label, name, type = 'text', icon: Icon, placeholder, required = false, ...props }) => (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        {Icon && <Icon className="w-4 h-4" />}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 ${
          errors[name] 
            ? 'border-red-500 focus:ring-red-200' 
            : 'border-gray-200 focus:border-red-400 focus:ring-red-100'
        }`}
        {...props}
      />
      {errors[name] && (
        <div className="flex items-center gap-2 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4" />
          {errors[name]}
        </div>
      )}
    </div>
  );

  const SelectField = ({ label, name, icon: Icon, options, required = false, ...props }) => (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        {Icon && <Icon className="w-4 h-4" />}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 ${
          errors[name] 
            ? 'border-red-500 focus:ring-red-200' 
            : 'border-gray-200 focus:border-red-400 focus:ring-red-100'
        }`}
        {...props}
      >
        <option value="">Select {label}</option>
        {options.map(option => (
          <option key={option.value || option} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
      {errors[name] && (
        <div className="flex items-center gap-2 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4" />
          {errors[name]}
        </div>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 mb-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {mode === 'create' ? 'Register as a Blood Donor' : 'Update Donor Information'}
        </h2>
        <p className="text-gray-600">
          {mode === 'create' 
            ? 'Fill in the form below to join our life-saving community' 
            : 'Update your donor profile information'
          }
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center">
          {['Personal', 'Medical', 'Emergency'].map((step, index) => (
            <React.Fragment key={step}>
              <div className={`flex flex-col items-center ${index === 0 ? 'text-red-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index === 0 ? 'bg-red-100' : 'bg-gray-100'
                }`}>
                  {index + 1}
                </div>
                <span className="text-xs mt-1">{step}</span>
              </div>
              {index < 2 && (
                <div className={`w-16 h-1 mx-2 ${index === 0 ? 'bg-red-200' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Basic Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <User className="w-5 h-5" />
          Personal Information
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <InputField
            label="Full Name"
            name="fullName"
            icon={User}
            placeholder="John Doe"
            required
            autoFocus
          />
          
          <InputField
            label="Email Address"
            name="email"
            type="email"
            icon={Mail}
            placeholder="john@example.com"
            required
          />
          
          <InputField
            label="Phone Number"
            name="phone"
            type="tel"
            icon={Phone}
            placeholder="9876543210"
            required
          />
          
          <InputField
            label="Age"
            name="age"
            type="number"
            icon={Calendar}
            placeholder="25"
            min="18"
            max="65"
            required
          />
          
          <SelectField
            label="Gender"
            name="gender"
            icon={Users}
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Other' }
            ]}
            required
          />
          
          <SelectField
            label="Blood Type"
            name="bloodType"
            icon={Droplet}
            options={bloodTypes}
            required
          />
          
          <SelectField
            label="City"
            name="city"
            icon={MapPin}
            options={cities}
            required
          />
          
          <InputField
            label="Weight (kg)"
            name="weight"
            type="number"
            placeholder="65"
            min="40"
            step="0.1"
          />
        </div>
        
        <InputField
          label="Address"
          name="address"
          placeholder="Street, Area, Landmark"
          className="md:col-span-2"
        />
      </div>

      {/* Advanced Fields Toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
      >
        <span className="font-semibold text-gray-700">Additional Information</span>
        {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {/* Advanced Fields */}
      {showAdvanced && (
        <div className="space-y-6 p-4 bg-gray-50 rounded-xl">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Stethoscope className="w-5 h-5" />
            Medical Information
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <InputField
              label="Last Donation Date"
              name="lastDonation"
              type="date"
            />
            
            <InputField
              label="Hemoglobin Level (g/dL)"
              name="hemoglobin"
              type="number"
              placeholder="14.5"
              step="0.1"
              min="12.5"
            />
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Stethoscope className="w-4 h-4" />
              Medical Conditions / Medications
            </label>
            <textarea
              name="medicalConditions"
              value={formData.medicalConditions}
              onChange={handleChange}
              rows="3"
              placeholder="List any medical conditions, allergies, or regular medications..."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 focus:outline-none transition-all"
            />
          </div>
          
          <h3 className="text-lg font-bold text-gray-800 mt-6">Emergency Contact</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <InputField
              label="Contact Name"
              name="emergencyContact"
              placeholder="Jane Doe"
            />
            
            <InputField
              label="Contact Phone"
              name="emergencyPhone"
              type="tel"
              placeholder="9876543210"
            />
          </div>
        </div>
      )}

      {/* Eligibility Check */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-green-800">Eligibility Check</h4>
            <ul className="mt-2 space-y-1 text-sm text-green-700">
              {formData.age >= 18 && formData.age <= 65 && (
                <li>✓ Age requirement satisfied (18-65 years)</li>
              )}
              {formData.weight >= 50 && (
                <li>✓ Minimum weight requirement satisfied (≥50kg)</li>
              )}
              {formData.lastDonation && (
                <li>✓ Previous donation recorded</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Submit Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {formValid ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-green-600">Form is ready to submit</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <span className="text-sm text-yellow-600">Please fill all required fields</span>
              </>
            )}
          </div>
          
          <div className="text-sm text-gray-500">
            Fields marked with <span className="text-red-500">*</span> are required
          </div>
        </div>
        
        <button
          type="submit"
          disabled={!formValid || isSubmitting}
          className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
            formValid && !isSubmitting
              ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white hover:shadow-xl transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {mode === 'create' ? 'Registering...' : 'Updating...'}
            </span>
          ) : (
            mode === 'create' ? 'Register as Donor' : 'Update Donor'
          )}
        </button>
      </div>

      {/* Privacy Notice */}
      <div className="text-center text-sm text-gray-500 p-4 border-t">
        <p>
          Your information is secure and will only be used for blood donation purposes. 
          By submitting this form, you agree to our privacy policy.
        </p>
      </div>
    </form>
  );
};

DonorForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  mode: PropTypes.oneOf(['create', 'edit'])
};

DonorForm.defaultProps = {
  mode: 'create'
};

export default DonorForm;