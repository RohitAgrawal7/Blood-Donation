export interface Donor {
  id: number;
  fullName: string;
  email?: string;
  phone: string;
  age?: number | string;
  bloodType: string;
  address?: string;
  city: string;
  lastDonation?: string;
  medicalConditions?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  gender?: string;
  status?: 'pending' | 'accepted' | 'rejected';
  registeredAt?: string;
}
