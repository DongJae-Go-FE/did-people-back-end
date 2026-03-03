import { Module } from '@nestjs/common';
import { ChurchgoersController } from './churchgoers.controller';
import { ChurchgoersService } from './churchgoers.service';

@Module({
  controllers: [ChurchgoersController],
  providers: [ChurchgoersService],
})
export class ChurchgoersModule {}
