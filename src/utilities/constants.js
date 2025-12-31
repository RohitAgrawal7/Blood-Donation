export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
];

export const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending Review', color: 'yellow' },
  { value: 'approved', label: 'Approved', color: 'green' },
  { value: 'rejected', label: 'Rejected', color: 'red' },
  { value: 'on_hold', label: 'On Hold', color: 'blue' },
  { value: 'active', label: 'Active Donor', color: 'purple' },
];

export const ELIGIBILITY_CRITERIA = {
  minAge: 18,
  maxAge: 65,
  minWeight: 50, // kg
  minHemoglobin: 12.5, // g/dL
  donationInterval: 90, // days
};