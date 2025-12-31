export const validateDonorForm = (data) => {
  const errors = {};
  
  if (!data.fullName?.trim() || data.fullName.length < 3) {
    errors.fullName = 'Full name must be at least 3 characters';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    errors.email = 'Valid email required';
  }
  
  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(data.phone.replace(/\D/g, ''))) {
    errors.phone = '10-digit phone number required';
  }
  
  const age = parseInt(data.age);
  if (age < 18 || age > 65) {
    errors.age = 'Age must be 18-65 years';
  }
  
  if (!data.bloodType) {
    errors.bloodType = 'Blood type is required';
  }
  
  if (!data.city?.trim()) {
    errors.city = 'City is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};