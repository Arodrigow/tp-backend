import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wells } from './entities/well.entity'
import { WellsService } from './wells.service';
import { WellsController } from './wells.controller';
import { UsersModule } from 'src/users/users.module';
import { AccessModule } from 'src/access/access.module';

@Module({
    imports: [TypeOrmModule.forFeature([Wells]), UsersModule, AccessModule],
    exports: [WellsService],
    controllers: [WellsController],
    providers: [WellsService],
})
export class WellsModule { }
