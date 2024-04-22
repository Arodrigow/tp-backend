import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { Users } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

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
    async findAll(): Promise<Array<Users>>{
        const users = await this.usersService.findAll();
        return users;
    }

    @Get(':id')
    async findById(@Param('id') id: string):Promise<Users>{
        const userById = await this.usersService.findUserById(id);
        return userById;
    }

    @Patch(':id')
    async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto){
        const result = await this.usersService.updateUser(id, updateUserDto);
        return result;
    }

    @Delete(':id')
    async deleteUser(@Param('id') id:string){
        const result = await this.usersService.softDeleteUser(id);
        return result;
    }

    @Patch('recover/:id')
    async restoreUser(@Param('id') id:string){
        const result = await this.usersService.restoreUser(id);
    }
}
