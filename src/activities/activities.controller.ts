import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activities.dto';
import { ActivitiesService } from './activities.service';
import { UpdateActivityDto } from './dto/update-activities.dto';
import { Role } from 'src/auth/enums/roles.enum';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';

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
    async findActivity(@Param('id') id:string){
        return await this.activitiesService.findActivity(id);
    }

    @Patch(':id')
    async updateActivity(@Param('id') id:string, @Body() updateActivityDto:UpdateActivityDto){
        return await this.activitiesService.updateActivity(id, updateActivityDto);
    }

    @Delete('delete/:id')
    async deleteActivity(@Param('id') id:string){
        return await this.activitiesService.deleteActivity(id);
    }

    @Patch('restore/:id')
    async restoreActivity(@Param('id') id:string){
        return await this.activitiesService.restoreActivity(id);
    }
}
