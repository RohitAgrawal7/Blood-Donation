import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DonorEntity } from './donor.entity';

@Injectable()
export class DonorsService {
  constructor(
    @InjectRepository(DonorEntity)
    private readonly repo: Repository<DonorEntity>
  ) {}

  private normalizeInput(payload: any): Partial<DonorEntity> {
    return {
      ...payload,
      status: payload?.status || 'pending',
    } as Partial<DonorEntity>;
  }

  async create(payload: any) {
    const toSave = this.normalizeInput(payload);
    const saved = await this.repo.save(toSave as DonorEntity);
    return saved;
  }

  async findAll(opts: { status?: string; page?: number; pageSize?: number }) {
    const qb = this.repo.createQueryBuilder('d');
    if (opts.status && opts.status !== 'all') {
      qb.where('d.status = :status', { status: opts.status });
    }
    qb.orderBy('d.id', 'DESC');

    const page = opts.page || 1;
    const pageSize = opts.pageSize || 10;
    qb.skip((page - 1) * pageSize).take(pageSize);

    const [data, total] = await qb.getManyAndCount();
    return { total, page, pageSize, data };
  }

  async findOne(id: number) {
    return this.repo.findOneBy({ id }) || null;
  }

  async updateStatus(id: number, status: DonorEntity['status']) {
    const res = await this.repo.update({ id }, { status } as any);
    return res.affected && res.affected > 0;
  }

  async stats() {
    const donorList = await this.repo.find();
    const total = donorList.length;
    const byBloodType = donorList.reduce((acc: Record<string, number>, d: DonorEntity) => {
      if (!d?.bloodType) return acc;
      acc[d.bloodType] = (acc[d.bloodType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const acceptedByBloodType = donorList.reduce((acc: Record<string, number>, d: DonorEntity) => {
      if ((d?.status || 'pending') !== 'accepted') return acc;
      if (!d?.bloodType) return acc;
      acc[d.bloodType] = (acc[d.bloodType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusCounts = donorList.reduce(
      (acc: { accepted: number; rejected: number; pending: number }, d: DonorEntity) => {
        if (d.status === 'accepted') acc.accepted++;
        else if (d.status === 'rejected') acc.rejected++;
        else acc.pending++;
        return acc;
      },
      { accepted: 0, rejected: 0, pending: 0 }
    );

  const male = donorList.reduce((acc: number, d: DonorEntity) => (String(d.gender || '').toLowerCase() === 'male' ? acc + 1 : acc), 0);
  const female = donorList.reduce((acc: number, d: DonorEntity) => (String(d.gender || '').toLowerCase() === 'female' ? acc + 1 : acc), 0);

    const acceptedMale = donorList.reduce(
      (acc: number, d: DonorEntity) => (String(d.gender || '').toLowerCase() === 'male' && (d.status || 'pending') === 'accepted' ? acc + 1 : acc),
      0
    );
    const acceptedFemale = donorList.reduce(
      (acc: number, d: DonorEntity) => (String(d.gender || '').toLowerCase() === 'female' && (d.status || 'pending') === 'accepted' ? acc + 1 : acc),
      0
    );

    return {
      total,
      today: total,
      byBloodType,
      acceptedByBloodType,
      ...statusCounts,
      male,
      female,
      acceptedMale,
      acceptedFemale,
    };
  }
}
