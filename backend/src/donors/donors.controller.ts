import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { DonorsService } from './donors.service';
import { CreateDonorDto } from './dto/create-donor.dto';
import { AuthGuard } from '../auth/jwt-auth.guard';

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
  async findAll(@Query('status') status: string, @Query('page') page = '1', @Query('pageSize') pageSize = '10') {
    const p = parseInt(page as any, 10) || 1;
    const ps = parseInt(pageSize as any, 10) || 10;
    return this.donorsService.findAll({ status, page: p, pageSize: ps });
  }

  @Get('stats')
  async stats() {
    return this.donorsService.stats();
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
}
