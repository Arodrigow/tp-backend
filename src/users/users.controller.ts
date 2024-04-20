import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto){
        return createUserDto;
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
