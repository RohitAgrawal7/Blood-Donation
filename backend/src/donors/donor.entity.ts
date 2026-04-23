import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'donors' })
export class DonorEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  fullName!: string;

  @Column({ type: 'text', nullable: true })
  email?: string;

  @Column({ type: 'text' })
  phone!: string;

  @Column({ type: 'integer', nullable: true })
  age?: number;

  @Column({ type: 'text' })
  bloodType!: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ type: 'text' })
  city!: string;

  @Column({ type: 'text', nullable: true })
  lastDonation?: string;

  @Column({ type: 'text', nullable: true })
  medicalConditions?: string;

  @Column({ type: 'text', nullable: true })
  emergencyContact?: string;

  @Column({ type: 'text', nullable: true })
  emergencyPhone?: string;

  @Column({ type: 'text', nullable: true })
  gender?: string;

  @Column({ type: 'text', nullable: true })
  nirankarType?: 'Nirankar' | 'Non Nirankari';

  @Column({ type: 'text', nullable: true })
  source?: string;

  @Column({ type: 'text', default: 'pending' })
  status?: 'pending' | 'accepted' | 'rejected';

  @CreateDateColumn()
  registeredAt?: string;
}
