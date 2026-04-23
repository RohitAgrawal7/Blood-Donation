import React, { useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import useDonors from '../hooks/useDonors';

export default function DonorForm({ onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', age: '', bloodType: '', address: '',
    city: '', lastDonation: '', medicalConditions: '', emergencyPhone: '',
    gender: '',
    nirankarType: '',
    source: '',
  });

  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { donors } = useDonors();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim() || formData.fullName.length < 3)
      newErrors.fullName = 'Full name must be at least 3 characters';
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(formData.email)) newErrors.email = 'Please enter a valid email address';
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, '')))
      newErrors.phone = 'Phone number must be 10 digits';
    const age = parseInt(formData.age);
    if (!age || age < 18 || age > 65) newErrors.age = 'Age must be between 18 and 65';
    if (!formData.bloodType) newErrors.bloodType = 'Please select your blood type';
    if (!formData.city.trim()) newErrors.city = 'City is required';
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
        city: '', lastDonation: '', medicalConditions: '', emergencyPhone: '', gender: '',
        nirankarType: '', source: '',
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
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address </label>
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
        
        {/* Gender */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange}
            className={`w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none transition-all`}>
            <option value="">Prefer not to say</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            {/* <option value="Other">Other</option> */}
          </select>
        </div>

        {/* Nirankar Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
          <select
            name="nirankarType"
            value={formData.nirankarType}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none transition-all"
          >
            <option value="">Select</option>
            <option value="Nirankar">Nirankar</option>
            <option value="Non Nirankari">Non Nirankari</option>
          </select>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Area *</label>
          <input type="text" name="city" value={formData.city} onChange={handleChange}
            className={`w-full px-4 py-3 rounded-xl border-2 ${errors.city ? 'border-red-500' : 'border-gray-200'} focus:border-red-500 focus:outline-none transition-all`}
            placeholder="Mumbai" />
          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
        </div>

        {/* Source */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Source</label>
          <input
            type="text"
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none transition-all"
            placeholder="e.g. Camp, Referral, WhatsApp, Poster"
          />
        </div>

        {/* Address (full width) */}
        {/* <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none transition-all"
            placeholder="Street Address" />
        </div> */}

        {/* Last Donation */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Last Donation Date</label>
          <input type="date" name="lastDonation" value={formData.lastDonation} onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none transition-all" />
        </div>

        {/* Emergency Contact */}
        {/* <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Contact Name *</label>
          <input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange}
            className={`w-full px-4 py-3 rounded-xl border-2 ${errors.emergencyContact ? 'border-red-500' : 'border-gray-200'} focus:border-red-500 focus:outline-none transition-all`}
            placeholder="Jane Doe" />
          {errors.emergencyContact && <p className="text-red-500 text-sm mt-1">{errors.emergencyContact}</p>}
        </div> */}

        {/* Emergency Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Whatsapp Number *</label>
          <input type="tel" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange}
            className={`w-full px-4 py-3 rounded-xl border-2 ${errors.emergencyPhone ? 'border-red-500' : 'border-gray-200'} focus:border-red-500 focus:outline-none transition-all`}
            placeholder="9876543210" />
          {errors.emergencyPhone && <p className="text-red-500 text-sm mt-1">{errors.emergencyPhone}</p>}
        </div>

        {/* Medical Conditions (full width) */}
        {/* <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Medical Conditions (if any)</label>
          <textarea name="medicalConditions" value={formData.medicalConditions} onChange={handleChange} rows="3"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none transition-all"
            placeholder="List any medical conditions or medications" />
        </div> */}
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
          <span className="font-semibold">Registration Successful!</span>
        </div>
      )}
      {submitStatus === 'error' && (
        <div className="flex items-center justify-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl">
          <AlertCircle className="w-6 h-6" />
          <span className="font-semibold">Please fix the errors above</span>
        </div>
      )}

      {/* Show last 5 recent registrations after a successful submit
          Display newest entry at the bottom so the list is stable and the latest
          registration appears as the last row. Use a small sticky offset so the
          block remains visible near the bottom of the form area on scroll. */}
      {submitStatus === 'success' && (
        <div className="mt-6 bg-white rounded-xl border border-gray-100 p-4 sticky bottom-6 z-10">
          <h3 className="font-bold text-lg mb-2">Recent Registrations (Last 5)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="py-2">Sr.</th>
                  <th className="py-2">Name</th>
                  <th className="py-2">Blood</th>
                  <th className="py-2">City</th>
                  <th className="py-2">Registered</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const list = (donors || []).slice(0, 5).slice().reverse(); // newest last
                  if (list.length === 0) {
                    return (
                      <tr>
                        <td colSpan={5} className="py-4 text-center text-gray-500">No recent registrations yet.</td>
                      </tr>
                    );
                  }
                  return list.map((d, i) => (
                    <tr key={d.id} className="border-t border-gray-100">
                      <td className="py-2">{i + 1}</td>
                      <td className="py-2 font-semibold">{d.fullName}</td>
                      <td className="py-2">{d.bloodType || '-'}</td>
                      <td className="py-2">{d.city || '-'}</td>
                      <td className="py-2 text-gray-500 text-xs">{d.registeredAt ? new Date(d.registeredAt).toLocaleString() : '-'}</td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}