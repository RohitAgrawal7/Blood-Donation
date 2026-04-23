import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DonorEntity } from './donor.entity';
import { UpdateDonorDto } from './dto/update-donor.dto';

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

  async findAll(opts: {
    status?: string;
    page?: number;
    pageSize?: number;
    gender?: string;
    nirankarType?: string;
    minAge?: number;
    maxAge?: number;
    q?: string;
    sortBy?: string;
    sortDir?: string;
  }) {
    const qb = this.repo.createQueryBuilder('d');
    qb.where('1=1');

    if (opts.status && opts.status !== 'all') {
      qb.andWhere('d.status = :status', { status: opts.status });
    }

    const gender = (opts.gender || '').trim();
    if (gender) {
      qb.andWhere('LOWER(COALESCE(d.gender, \'\')) = :gender', { gender: gender.toLowerCase() });
    }

    const nirankarType = (opts.nirankarType || '').trim();
    if (nirankarType) {
      qb.andWhere('d.nirankarType = :nirankarType', { nirankarType });
    }

    if (typeof opts.minAge === 'number' && Number.isFinite(opts.minAge)) {
      qb.andWhere('d.age >= :minAge', { minAge: opts.minAge });
    }
    if (typeof opts.maxAge === 'number' && Number.isFinite(opts.maxAge)) {
      qb.andWhere('d.age <= :maxAge', { maxAge: opts.maxAge });
    }

    const q = (opts.q || '').trim();
    if (q) {
      qb.andWhere(
        '(LOWER(COALESCE(d.fullName, \'\')) LIKE :q OR LOWER(COALESCE(d.email, \'\')) LIKE :q OR COALESCE(d.phone, \'\') LIKE :q)',
        { q: `%${q.toLowerCase()}%` }
      );
    }

    const sortKey = String(opts.sortBy || '').trim();
    const sortDir = String(opts.sortDir || '').toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    const sortMap: Record<string, string> = {
      registeredAt: 'd.registeredAt',
      id: 'd.id',
      fullName: 'd.fullName',
      age: 'd.age',
      city: 'd.city',
      bloodType: 'd.bloodType',
      gender: 'd.gender',
      nirankarType: 'd.nirankarType',
      source: 'd.source',
      status: 'd.status',
    };
    qb.orderBy(sortMap[sortKey] || 'd.id', sortDir as any);

    const page = opts.page || 1;
    // Allow a wider set of page sizes (client uses "fetch all" patterns for accepted lists).
    // Still clamp to a safe maximum to protect the DB from accidental huge scans.
    const requested = Number(opts.pageSize);
    const safeMax = 1000;
    const pageSize = Number.isFinite(requested) && requested > 0 ? Math.min(requested, safeMax) : 10;
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

  async updateDonor(id: number, payload: UpdateDonorDto) {
    const existing = await this.repo.findOneBy({ id });
    if (!existing) return null;

    const merged = this.repo.merge(existing, this.normalizeInput(payload));
    return this.repo.save(merged);
  }

  async deleteDonor(id: number) {
    const res = await this.repo.delete({ id });
    return !!(res.affected && res.affected > 0);
  }

  async acceptedSnapshot(limit: number) {
    const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 1000) : 200;
    const [acceptedCount, donors] = await Promise.all([
      this.repo.count({ where: { status: 'accepted' as any } }),
      this.repo.find({
        where: { status: 'accepted' as any },
        order: { id: 'DESC' },
        take: safeLimit,
      }),
    ]);

    return {
      acceptedCount,
      donors,
    };
  }

  async stats() {
    // IMPORTANT: Avoid loading the entire donors table in memory.
    // Use DB aggregation queries (much faster as the table grows).
    const countsRaw = await this.repo
      .createQueryBuilder('d')
      .select('COUNT(*)', 'total')
      .addSelect(`SUM(CASE WHEN d.status = 'accepted' THEN 1 ELSE 0 END)`, 'accepted')
      .addSelect(`SUM(CASE WHEN d.status = 'rejected' THEN 1 ELSE 0 END)`, 'rejected')
      .addSelect(`SUM(CASE WHEN d.status = 'pending' OR d.status IS NULL THEN 1 ELSE 0 END)`, 'pending')
      .addSelect(`SUM(CASE WHEN LOWER(COALESCE(d.gender, '')) = 'male' THEN 1 ELSE 0 END)`, 'male')
      .addSelect(`SUM(CASE WHEN LOWER(COALESCE(d.gender, '')) = 'female' THEN 1 ELSE 0 END)`, 'female')
      .addSelect(
        `SUM(CASE WHEN LOWER(COALESCE(d.gender, '')) = 'male' AND d.status = 'accepted' THEN 1 ELSE 0 END)`,
        'acceptedMale'
      )
      .addSelect(
        `SUM(CASE WHEN LOWER(COALESCE(d.gender, '')) = 'female' AND d.status = 'accepted' THEN 1 ELSE 0 END)`,
        'acceptedFemale'
      )
      .getRawOne<{
        total: string;
        accepted: string;
        rejected: string;
        pending: string;
        male: string;
        female: string;
        acceptedMale: string;
        acceptedFemale: string;
      }>();

    const total = Number(countsRaw?.total || 0);
    const accepted = Number(countsRaw?.accepted || 0);
    const rejected = Number(countsRaw?.rejected || 0);
    const pending = Number(countsRaw?.pending || 0);
    const male = Number(countsRaw?.male || 0);
    const female = Number(countsRaw?.female || 0);
    const acceptedMale = Number(countsRaw?.acceptedMale || 0);
    const acceptedFemale = Number(countsRaw?.acceptedFemale || 0);

    const bloodTypeRows = await this.repo
      .createQueryBuilder('d')
      .select('d.bloodType', 'bloodType')
      .addSelect('COUNT(*)', 'count')
      .where('d.bloodType IS NOT NULL AND d.bloodType <> :empty', { empty: '' })
      .groupBy('d.bloodType')
      .getRawMany<{ bloodType: string; count: string }>();

    const byBloodType = (bloodTypeRows || []).reduce((acc: Record<string, number>, r) => {
      if (!r?.bloodType) return acc;
      acc[r.bloodType] = Number(r.count || 0);
      return acc;
    }, {} as Record<string, number>);

    const acceptedBloodTypeRows = await this.repo
      .createQueryBuilder('d')
      .select('d.bloodType', 'bloodType')
      .addSelect('COUNT(*)', 'count')
      .where('d.status = :status', { status: 'accepted' })
      .andWhere('d.bloodType IS NOT NULL AND d.bloodType <> :empty', { empty: '' })
      .groupBy('d.bloodType')
      .getRawMany<{ bloodType: string; count: string }>();

    const acceptedByBloodType = (acceptedBloodTypeRows || []).reduce((acc: Record<string, number>, r) => {
      if (!r?.bloodType) return acc;
      acc[r.bloodType] = Number(r.count || 0);
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      today: total,
      byBloodType,
      acceptedByBloodType,
      accepted,
      rejected,
      pending,
      male,
      female,
      acceptedMale,
      acceptedFemale,
    };
  }
}
