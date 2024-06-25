import { Module } from '@nestjs/common';
import { ShapesService } from './shapes.service';
import { ShapesController } from './shapes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShapesData } from './entities/shape.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ShapesData])],
  providers: [ShapesService],
  controllers: [ShapesController]
})
export class ShapesModule {}
