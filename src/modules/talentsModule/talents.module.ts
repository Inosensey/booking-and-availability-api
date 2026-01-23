// talents.module.ts
import { Module } from '@nestjs/common';
import { TalentController } from './talents.controller';
import { TalentService } from './talents.service';

@Module({
  controllers: [TalentController],
  providers: [TalentService],
  exports: [TalentService],
})
export class TalentModule {}
