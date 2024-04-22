import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(
        private readonly usersService: UsersService 
    ){}

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto){
        await this.usersService.createUser(createUserDto);
    }

    @Get()
    async findAll(): Promise<string>{
        return "Rota funcinando."
    }

    @Get(':id')
    async findById(){

    }

    @Put()
    async updateUser(){

    }

    @Delete()
    async deleteUser(){}
}
