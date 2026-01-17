import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TalentService } from './talents.service';
import { ApiResponse } from 'src/utils/responseShaper';
import { AuthGuard } from 'src/guards/auth.guard';
import { PermissionsGuard } from 'src/guards/permission.guard';
import { CreateTalentDTO, UpdateTalentDTO } from './talents.dto';

@Controller('talents')
export class TalentController {
  constructor(private readonly talentService: TalentService) {}

  @UseGuards(AuthGuard, PermissionsGuard)
  @Get()
  async getTalents() {
    const talents = await this.talentService.getTalents();
    return ApiResponse.success(talents, 'Talents retrieved Successfully');
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @Get('/:talent')
  async getTalentByTalent(@Param('talent') talent: string) {
    const talents = await this.talentService.getTalentsByTalent(talent);
    return ApiResponse.success(talents, 'Talents retrieved Successfully');
  }
  @UseGuards(AuthGuard, PermissionsGuard)
  @Get('search/:value')
  async searchTalents(@Param('value') value: string) {
    const talents = await this.talentService.searchTalents(value);
    return ApiResponse.success(talents, 'Talents retrieved Successfully');
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @Post('/create')
  async createTalent(
    @Body()
    data: CreateTalentDTO,
  ) {
    const result = await this.talentService.createTalent(data);
    return ApiResponse.success(result, 'Talent created successfully');
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @Put('/update/:userId/:id')
  async updateTalent(
    @Param('userId') userId: string,
    @Param('id') id: string,
    @Body() data: UpdateTalentDTO,
  ) {
    const result = await this.talentService.updateTalent(id, userId, data);
    return ApiResponse.success(result, 'Talent updated successfully');
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @Delete('delete/:id')
  async deleteTalent(@Param('id') id: string) {
    const result = await this.talentService.deleteTalent(id);
    return ApiResponse.success(result, 'Talent deleted successfully');
  }
}
