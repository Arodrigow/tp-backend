import { Module } from '@nestjs/common';
import { MonitoringController } from './monitoring.controller';
import { MonitoringService } from './monitoring.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Monitoring } from './entities/monitoring.entity';
import { WellsModule } from 'src/wells/wells.module';

@Module({
  imports:[TypeOrmModule.forFeature([Monitoring]), WellsModule],
  controllers: [MonitoringController],
  providers: [MonitoringService]
})
export class MonitoringModule {}
