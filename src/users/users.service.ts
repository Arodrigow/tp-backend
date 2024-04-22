import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users) private readonly userRepository: Repository<Users>
    ){}

    async createUser(createUserDto: CreateUserDto){
        const newUser = this.userRepository.create({...createUserDto});

        const user = this.userRepository.save(newUser);
    }

    async findUserById(id: string): Promise<Users>{
        const user = await this.userRepository.findOneBy({id});
        return user;
    }

    async findAll():Promise<Array<Users>>{
        const result = await this.userRepository.find();
        return result;
    }

    async updateUser(id: string, updateUserDto:UpdateUserDto){
       const userUpdated = await this.userRepository.update(id, updateUserDto);
        return userUpdated;
    }

    async softDeleteUser(id:string){
        const result = await this.userRepository.softDelete(id);
        return result;
    }

    async restoreUser(id:string){
        const result = await this.userRepository.restore(id);
        return result
    }
}
