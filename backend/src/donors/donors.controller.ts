import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { DonorsService } from './donors.service';
import { CreateDonorDto } from './dto/create-donor.dto';
import { AuthGuard } from '../auth/jwt-auth.guard';
import { UpdateDonorDto } from './dto/update-donor.dto';

@Controller('donors')
export class DonorsController {
  constructor(private readonly donorsService: DonorsService) {}

  @Post()

  async create(@Body() payload: CreateDonorDto) {
    // Basic validation (typed keys so TS can index payload safely)
    const required: (keyof CreateDonorDto)[] = ['fullName', 'phone', 'age', 'bloodType', 'city'];
    for (const r of required) {
      if (!payload[r]) {
        throw new HttpException(`${String(r)} is required`, HttpStatus.BAD_REQUEST);
      }
    }
    return this.donorsService.create(payload);
  }

  @Get()

  async findAll(
    @Query('status') status: string,
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '10',
    @Query('gender') gender?: string,
    @Query('nirankarType') nirankarType?: string,
    @Query('minAge') minAge?: string,
    @Query('maxAge') maxAge?: string,
    @Query('q') q?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortDir') sortDir?: string
  ) {
    const p = parseInt(page as any, 10) || 1;
    const ps = parseInt(pageSize as any, 10) || 10;
    const minA = minAge != null ? parseInt(minAge as any, 10) : undefined;
    const maxA = maxAge != null ? parseInt(maxAge as any, 10) : undefined;
    return this.donorsService.findAll({
      status,
      page: p,
      pageSize: ps,
      gender,
      nirankarType,
      minAge: Number.isFinite(minA as any) ? (minA as any) : undefined,
      maxAge: Number.isFinite(maxA as any) ? (maxA as any) : undefined,
      q,
      sortBy,
      sortDir,
    });
  }

  @Get('stats')
  async stats() {
    return this.donorsService.stats();
  }

  // Lightweight endpoint to keep BloodDrop page perfectly in-sync:
  // returns acceptedCount + latest accepted donors (ordered by newest first).
  @Get('accepted/snapshot')
  async acceptedSnapshot(@Query('limit') limit = '200') {
    const l = Math.max(1, Math.min(parseInt(limit as any, 10) || 200, 1000));
    return this.donorsService.acceptedSnapshot(l);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const d = await this.donorsService.findOne(Number(id));
    if (!d) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    return d;
  }

  @UseGuards(AuthGuard)
  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    if (!['accepted', 'rejected', 'pending'].includes(status)) {
      throw new HttpException('Invalid status', HttpStatus.BAD_REQUEST);
    }
    const ok = await this.donorsService.updateStatus(Number(id), status as any);
    if (!ok) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    return { success: true };
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateDonor(@Param('id') id: string, @Body() payload: UpdateDonorDto) {
    const updated = await this.donorsService.updateDonor(Number(id), payload);
    if (!updated) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    return updated;
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteDonor(@Param('id') id: string) {
    const ok = await this.donorsService.deleteDonor(Number(id));
    if (!ok) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    return { success: true };
  }
}
