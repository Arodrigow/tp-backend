import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { WellsService } from './wells.service';
import { CreateWellDto } from './dto/create-well.dto';
import { UpdateUserOwnershipDto } from './dto/updateOwnership-well.dto';
import { UpdateWellDto } from './dto/update-well.dto';
import { Pagination, PaginationParams } from '../search/decorators/paginationParams.decorator';
import { Sorting, SortingParams } from '../search/decorators/sortParams.decorator';
import { Filtering, FilteringParams } from '../search/decorators/filterParams.decorator';
import { Wells } from './entities/well.entity';
import { PaginatedResource } from '../search/dto/paginated-resources.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/enums/roles.enum';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { adminWellSearchConst, wellSearchConst } from './const/searchConstants';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('siimasapi/wells')
export class WellsController {

    constructor(
        private readonly wellService:WellsService
    ){}

    @Post('admin')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    async craeteWell(@Body() createWellDto: CreateWellDto){
        return await this.wellService.createWell(createWellDto);
    }

    @Get()
    async findAll(){
        return await this.wellService.findAllWells();
    }
    
    @Get(':wellId')
    async findWellById(@Param('wellId') wellId:string, @Query('wellIds') wellIds:string){
        return await this.wellService.findWellById(wellId ,wellIds);
    }

    @Get('admin/:wellId')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    async adminFindWellById(@Param('wellId') wellId:string){
        return await this.wellService.adminFindWellById(wellId);
    }

    @Roles(Role.USER)
    @UseGuards(AuthGuard, RoleGuard)
    @Get('ordinance/:ordinance')
    async findWellByOrdinanceNotOwn(@Param('ordinance') ordinance:number){
        return await this.wellService.findWellByOrdinanceNotOwn(ordinance);
    }

    @Roles(Role.USER)
    @UseGuards(AuthGuard, RoleGuard)
    @Get('user/:userId')
    async listWellsByUser(@Param('userId') userId: string){
        return await this.wellService.listWellsByUser(userId);
    }

    @Get('categories')
    async findUniqueCategories(){
        return await this.wellService.findUniqueCategories();
    }

    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    @Get('admin/categories')
    async adminFindUniqueCategories(){
        return await this.wellService.adminFindUniqueCategories();
    }

    @Roles(Role.USER)
    @UseGuards(AuthGuard, RoleGuard)
    @Patch('user/:wellId')
    async updateUserOwnership(@Param('wellId') wellId:string, @Body() updateUserOwnershipDto:UpdateUserOwnershipDto){
        return await this.wellService.updateUserOwnership(wellId, updateUserOwnershipDto);
    }

    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    @Patch(':wellId')
    async updateWell(@Param('wellId') wellId:string, @Body() updateWellDto:UpdateWellDto){
        return await this.wellService.updateWell(wellId, updateWellDto);
    }

    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    @Delete('delete/:wellId')
    async deleteWell(@Param('wellId') wellId:string){
        return await this.wellService.deleteWell(wellId);
    }

    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    @Patch('restore/:wellId')
    async restoreWell(@Param('wellId') wellId:string){
        return await this.wellService.restoreWell(wellId);
    }

    
    @Get('search')
    async getWells(
        @PaginationParams() paginationParams: Pagination,
        @SortingParams(wellSearchConst) sort?: Sorting,
        @FilteringParams(wellSearchConst)  filter?: Filtering
    ):Promise<PaginatedResource<Partial<Wells>>>{
        return await this.wellService.searchWells(paginationParams, sort, filter);
    }

    @Get('admin/search')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    async adminGetWells(
        @PaginationParams() paginationParams: Pagination,
        @SortingParams(adminWellSearchConst) sort?: Sorting,
        @FilteringParams(adminWellSearchConst)  filter?: Filtering
    ):Promise<PaginatedResource<Partial<Wells>>>{
        return await this.wellService.adminSearchWells(paginationParams, sort, filter);
    }
}
