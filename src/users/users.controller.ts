import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpExceptionFilter } from 'src/shared/filters/http-exception.filter';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Pagination, PaginationParams } from 'src/search/decorators/paginationParams.decorator';
import { Sorting, SortingParams } from 'src/search/decorators/sortParams.decorator';
import { Filtering, FilteringParams } from 'src/search/decorators/filterParams.decorator';
import { Users } from './entities/user.entity';
import { PaginatedResource } from 'src/search/dto/paginated-resources.dto';


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

    @Delete('delete/:id')
    async softDeleteUser(@Param('id') id:string){
        return await this.usersService.softDeleteUser(id);
    }

    @Patch('restore/:id')
    async restoreUser(@Param('id') id:string){
        return await this.usersService.restoreUser(id);
    }

    @Get('search')
    async searchUsers(
        @PaginationParams() paginationParams: Pagination,
        @SortingParams(['cpf', 'email', 'name', 'deleteAt']) sort?: Sorting,
        @FilteringParams(['cpf', 'email', 'name', 'deleteAt'])  filter?: Filtering
    ):Promise<PaginatedResource<Partial<Users>>>{
        return await this.usersService.searchUsers(paginationParams, sort, filter);
    }
}
