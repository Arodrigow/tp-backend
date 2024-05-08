import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Logger, Param, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
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

@UseInterceptors(ClassSerializerInterceptor)
@Controller('wells')
export class WellsController {

    constructor(
        private readonly wellService:WellsService
    ){}

    @Post()
    @Roles(Role.USER)
    @UseGuards(AuthGuard, RoleGuard)
    async craeteWell(@Body() createWellDto: CreateWellDto){
        return await this.wellService.createWell(createWellDto);
    }

    @Get()
    async findAll(){
        return await this.wellService.findAllWells();
    }
    
    @Get(':ordinance')
    async findWllById(@Param('ordinance') ordinance:number, @Query('portarias') ordinances:string){
        return await this.wellService.findWellByOrdinance(ordinance,ordinances);
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

    @Roles(Role.USER)
    @UseGuards(AuthGuard, RoleGuard)
    @Patch('user/:ordinance')
    async updateUserOwnership(@Param('ordinance') ordinance:number, @Body() updateUserOwnershipDto:UpdateUserOwnershipDto){
        return await this.wellService.updateUserOwnership(ordinance, updateUserOwnershipDto);
    }

    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    @Patch(':ordinance')
    async updateWell(@Param('ordinance') ordinance:number, @Body() updateWellDto:UpdateWellDto){
        return await this.wellService.updateWell(ordinance, updateWellDto);
    }

    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    @Delete('delete/:ordinance')
    async deleteWell(@Param('ordinance') ordinance:number){
        return await this.wellService.deleteWell(ordinance);
    }

    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    @Patch('restore/:ordinance')
    async restoreWell(@Param('ordinance') ordinance:number){
        return await this.wellService.restoreWell(ordinance);
    }

    @Get('search')
    async getWells(
        @PaginationParams() paginationParams: Pagination,
        @SortingParams(['NE', 'ND', 'profPc', 'chNome']) sort?: Sorting,
        @FilteringParams(['NE', 'ND', 'profPc', 'chNome'])  filter?: Filtering
    ):Promise<PaginatedResource<Partial<Wells>>>{
        return await this.wellService.searchWells(paginationParams, sort, filter);
    }

}
