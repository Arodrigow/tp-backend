import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activities.dto';
import { ActivitiesService } from './activities.service';
import { UpdateActivityDto } from './dto/update-activities.dto';
import { Role } from 'src/auth/enums/roles.enum';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Pagination, PaginationParams } from 'src/search/decorators/paginationParams.decorator';
import { Sorting, SortingParams } from 'src/search/decorators/sortParams.decorator';
import { Filtering, FilteringParams } from 'src/search/decorators/filterParams.decorator';
import { Activities } from './entities/activities.entity';
import { PaginatedResource } from 'src/search/dto/paginated-resources.dto';
import { activitySearchConst } from './const/searchConst';

@Controller('activities')
export class ActivitiesController {

    constructor(
        private readonly activitiesService: ActivitiesService
    ){}


    @Post()
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    async createActivity(@Body() createActivityDto: CreateActivityDto){
        return await this.activitiesService.createActivity(createActivityDto);
    }

    @Get()
    async findAll(){
        return await this.activitiesService.findAll();
    }

    @Get(':id')
    async findActivity(@Param('id') id:string, @Query('activityIds') activityIds:string){
        return await this.activitiesService.findActivity(id,activityIds);
    }

    @Get('admin/:id')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    async adminFindActivity(@Param('id') id:string){
        return await this.activitiesService.adminFindActivity(id);
    }

    @Patch(':id')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    async updateActivity(@Param('id') id:string, @Body() updateActivityDto:UpdateActivityDto){
        return await this.activitiesService.updateActivity(id, updateActivityDto);
    }

    @Delete('delete/:id')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    async deleteActivity(@Param('id') id:string){
        return await this.activitiesService.deleteActivity(id);
    }

    @Patch('restore/:id')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    async restoreActivity(@Param('id') id:string){
        return await this.activitiesService.restoreActivity(id);
    }

    @Get('search')
    async getActivities(
        @PaginationParams() paginationParams: Pagination,
        @SortingParams(activitySearchConst) sort?: Sorting,
        @FilteringParams(activitySearchConst)  filter?: Filtering
    ):Promise<PaginatedResource<Partial<Activities>>>{
        return await this.activitiesService.searchActivities(paginationParams, sort, filter);
    }

    @Get('/admin/search')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    async adminGetActivities(
        @PaginationParams() paginationParams: Pagination,
        @SortingParams(activitySearchConst) sort?: Sorting,
        @FilteringParams(activitySearchConst)  filter?: Filtering
    ):Promise<PaginatedResource<Partial<Activities>>>{
        return await this.activitiesService.adminSearchActivities(paginationParams, sort, filter);
    }
}
