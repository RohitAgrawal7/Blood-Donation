import { CreateDonorDto } from './create-donor.dto';

export class UpdateDonorDto implements Partial<CreateDonorDto> {
  fullName?: string;
  email?: string;
  phone?: string;
  age?: number | string;
  bloodType?: string;
  address?: string;
  city?: string;
  lastDonation?: string;
  medicalConditions?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  gender?: string;
  nirankarType?: 'Nirankar' | 'Non Nirankari';
  source?: string;
  status?: 'pending' | 'accepted' | 'rejected';
}

