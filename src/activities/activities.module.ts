import { Module } from '@nestjs/common';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activities } from './entities/activities.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Activities])],
  controllers: [ActivitiesController],
  providers: [ActivitiesService]
})
export class ActivitiesModule {}
