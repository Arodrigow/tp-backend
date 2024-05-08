import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AccessModule } from 'src/access/access.module';

@Module({
    imports: [TypeOrmModule.forFeature([Users]), AccessModule],
    exports: [UsersService],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule { }
