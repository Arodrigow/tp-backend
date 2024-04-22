import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users) private readonly userRepository: Repository<Users>
    ){}

    async createUser(createUserDto: CreateUserDto){
        const newUser = this.userRepository.create({...createUserDto});

        const user = this.userRepository.save(newUser);

    }
}
