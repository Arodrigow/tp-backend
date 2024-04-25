import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wells } from './entities/well.entity'
import { WellsService } from './wells.service';
import { WellsController } from './wells.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [TypeOrmModule.forFeature([Wells]), UsersModule],
    exports: [WellsService],
    controllers: [WellsController],
    providers: [WellsService],
})
export class WellsModule { }
