import React, { useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function DonorForm({ onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', age: '', bloodType: '', address: '',
    city: '', lastDonation: '', medicalConditions: '', emergencyContact: '', emergencyPhone: ''
  });

  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim() || formData.fullName.length < 3)
      newErrors.fullName = 'Full name must be at least 3 characters';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) newErrors.email = 'Please enter a valid email address';
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, '')))
      newErrors.phone = 'Phone number must be 10 digits';
    const age = parseInt(formData.age);
    if (!age || age < 18 || age > 65) newErrors.age = 'Age must be between 18 and 65';
    if (!formData.bloodType) newErrors.bloodType = 'Please select your blood type';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (formData.emergencyContact.trim().length < 3)
      newErrors.emergencyContact = 'Emergency contact name is required';
    if (!phoneRegex.test(formData.emergencyPhone.replace(/\D/g, '')))
      newErrors.emergencyPhone = 'Emergency phone must be 10 digits';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 3000);
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const newDonor = {
      ...formData,
      id: Date.now(),
      registeredAt: new Date().toISOString()
    };

    onSubmitSuccess(newDonor);

    setSubmitStatus('success');
    setIsSubmitting(false);

    setTimeout(() => {
      setSubmitStatus(null);
      setFormData({
        fullName: '', email: '', phone: '', age: '', bloodType: '', address: '',
        city: '', lastDonation: '', medicalConditions: '', emergencyContact: '', emergencyPhone: ''
      });
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange}
            className={`w-full px-4 py-3 rounded-xl border-2 ${errors.fullName ? 'border-red-500' : 'border-gray-200'} focus:border-red-500 focus:outline-none transition-all`}
            placeholder="John Doe" />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange}
            className={`w-full px-4 py-3 rounded-xl border-2 ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:border-red-500 focus:outline-none transition-all`}
            placeholder="john@example.com" />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
            className={`w-full px-4 py-3 rounded-xl border-2 ${errors.phone ? 'border-red-500' : 'border-gray-200'} focus:border-red-500 focus:outline-none transition-all`}
            placeholder="9876543210" />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Age *</label>
          <input type="number" name="age" value={formData.age} onChange={handleChange}
            className={`w-full px-4 py-3 rounded-xl border-2 ${errors.age ? 'border-red-500' : 'border-gray-200'} focus:border-red-500 focus:outline-none transition-all`}
            placeholder="25" />
          {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
        </div>

        {/* Blood Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Blood Type *</label>
          <select name="bloodType" value={formData.bloodType} onChange={handleChange}
            className={`w-full px-4 py-3 rounded-xl border-2 ${errors.bloodType ? 'border-red-500' : 'border-gray-200'} focus:border-red-500 focus:outline-none transition-all`}>
            <option value="">Select Blood Type</option>
            <option value="A+">A+</option><option value="A-">A-</option>
            <option value="B+">B+</option><option value="B-">B-</option>
            <option value="AB+">AB+</option><option value="AB-">AB-</option>
            <option value="O+">O+</option><option value="O-">O-</option>
          </select>
          {errors.bloodType && <p className="text-red-500 text-sm mt-1">{errors.bloodType}</p>}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
          <input type="text" name="city" value={formData.city} onChange={handleChange}
            className={`w-full px-4 py-3 rounded-xl border-2 ${errors.city ? 'border-red-500' : 'border-gray-200'} focus:border-red-500 focus:outline-none transition-all`}
            placeholder="Mumbai" />
          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
        </div>

        {/* Address (full width) */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none transition-all"
            placeholder="Street Address" />
        </div>

        {/* Last Donation */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Last Donation Date</label>
          <input type="date" name="lastDonation" value={formData.lastDonation} onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none transition-all" />
        </div>

        {/* Emergency Contact */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Contact Name *</label>
          <input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange}
            className={`w-full px-4 py-3 rounded-xl border-2 ${errors.emergencyContact ? 'border-red-500' : 'border-gray-200'} focus:border-red-500 focus:outline-none transition-all`}
            placeholder="Jane Doe" />
          {errors.emergencyContact && <p className="text-red-500 text-sm mt-1">{errors.emergencyContact}</p>}
        </div>

        {/* Emergency Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Phone *</label>
          <input type="tel" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange}
            className={`w-full px-4 py-3 rounded-xl border-2 ${errors.emergencyPhone ? 'border-red-500' : 'border-gray-200'} focus:border-red-500 focus:outline-none transition-all`}
            placeholder="9876543210" />
          {errors.emergencyPhone && <p className="text-red-500 text-sm mt-1">{errors.emergencyPhone}</p>}
        </div>

        {/* Medical Conditions (full width) */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Medical Conditions (if any)</label>
          <textarea name="medicalConditions" value={formData.medicalConditions} onChange={handleChange} rows="3"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none transition-all"
            placeholder="List any medical conditions or medications" />
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Registering...' : 'Register as Donor'}
      </button>

      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 p-4 rounded-xl">
          <CheckCircle className="w-6 h-6" />
          <span className="font-semibold">Registration Successful! Redirecting to dashboard...</span>
        </div>
      )}
      {submitStatus === 'error' && (
        <div className="flex items-center justify-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl">
          <AlertCircle className="w-6 h-6" />
          <span className="font-semibold">Please fix the errors above</span>
        </div>
      )}
    </div>
  );
}