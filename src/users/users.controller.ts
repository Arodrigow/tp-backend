import { Body, ClassSerializerInterceptor, Controller, Get, Param, Patch, Post, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpExceptionFilter } from 'src/shared/filters/http-exception.filter';
import { AuthGuard } from 'src/auth/guards/auth.guard';


@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(HttpExceptionFilter)
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

    @UseGuards(AuthGuard)
    @Get(':id')
    async findById(@Param('id') id: string){
        return await this.usersService.findUserById(id);
    }

    @UseGuards(AuthGuard)
    @Patch(':id')
    async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto){
        return await this.usersService.updateUser(id, updateUserDto);
    }

}
