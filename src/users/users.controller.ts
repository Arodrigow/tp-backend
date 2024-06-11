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
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/enums/roles.enum';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { CreateAdminUserDto } from './dto/create-useradmin.dto';
import { userSearchConst } from './const/searchConstants';


@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(HttpExceptionFilter)
@Controller('api/users')
export class UsersController {

    constructor(
        private readonly usersService: UsersService 
    ){}

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto){
       return await this.usersService.createUser(createUserDto);
    }

    @Post('admin')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    async adminCreateUser(@Body() createAdminUserDto: CreateAdminUserDto){
       return await this.usersService.adminCreateUser(createAdminUserDto);
    }

    @Get(':id')
    @Roles(Role.USER)
    @UseGuards(AuthGuard, RoleGuard)
    async findById(@Param('id') id: string){
        return await this.usersService.findUserById(id);
    }
    @Get('admin/:id')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    async adminFindById(@Param('id') id: string){
        return await this.usersService.adminFindUserById(id);
    }

    @Patch(':id')
    @Roles(Role.USER)
    @UseGuards(AuthGuard, RoleGuard)
    async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto){
        return await this.usersService.updateUser(id, updateUserDto);
    }

    @Patch('resetp/:id')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    async adminResetPassword(@Param('id') id: string){
        return await this.usersService.adminResetPassword(id);
    }

    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    @Delete('delete/:id')
    async softDeleteUser(@Param('id') id:string){
        return await this.usersService.softDeleteUser(id);
    }

    @Patch('restore/:id')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    async restoreUser(@Param('id') id:string){
        return await this.usersService.restoreUser(id);
    }

    @Get('admin/search')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    async adminSearchUsers(
        @PaginationParams() paginationParams: Pagination,
        @SortingParams(userSearchConst) sort?: Sorting,
        @FilteringParams(userSearchConst)  filter?: Filtering
    ):Promise<PaginatedResource<Partial<Users>>>{
        return await this.usersService.adminSearchUsers(paginationParams, sort, filter);
    }
}
