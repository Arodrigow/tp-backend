import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { Users } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {

    constructor(
        private readonly usersService: UsersService 
    ){}

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto){
       return await this.usersService.createUser(createUserDto);
    }

    @Get()
    async findAll(){
        return await this.usersService.findAll();
    }

    @Get(':id')
    async findById(@Param('id') id: string){
        return await this.usersService.findUserById(id);
    }

    @Patch(':id')
    async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto){
        return await this.usersService.updateUser(id, updateUserDto);
    }

}
