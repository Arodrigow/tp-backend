import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { WellsService } from './wells.service';
import { CreateWellDto } from './dto/create-well.dto';
import { UpdateUserOwnershipDto } from './dto/updateOwnership-well.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { UpdateWellDto } from './dto/update-well.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('wells')
export class WellsController {

    constructor(
        private readonly wellService:WellsService
    ){}

    @Post()
    async craeteWell(@Body() createWellDto: CreateWellDto){
        return await this.wellService.createWell(createWellDto);
    }

    @Get()
    async findAll(){
        return await this.wellService.findAllWells();
    }
    
    @Get(':ordinance')
    async findWllById(@Param('ordinance') ordinance:number){
        return await this.wellService.findWellByOrdinance(ordinance);
    }

    @Get('ordinance/:ordinance')
    async findWellByOrdinanceNotOwn(@Param('ordinance') ordinance:number){
        return await this.wellService.findWellByOrdinanceNotOwn(ordinance);
    }

    @Get('user/:userId')
    async listWellsByUser(@Param('userId') userId: string){
        return await this.wellService.listWellsByUser(userId);
    }

    @Patch('user/:ordinance')
    async updateUserOwnership(@Param('ordinance') ordinance:number, @Body() updateUserOwnershipDto:UpdateUserOwnershipDto){
        return await this.wellService.updateUserOwnership(ordinance, updateUserOwnershipDto);
    }

    @Patch(':ordinance')
    async updateWell(@Param('ordinance') ordinance:number, @Body() updateWellDto:UpdateWellDto){
        return await this.wellService.updateWell(ordinance, updateWellDto);
    }

    @Delete('delete/:ordinance')
    async deleteWell(@Param('ordinance') ordinance:number){
        return await this.wellService.deleteWell(ordinance);
    }

    @Patch('restore/:ordinance')
    async restoreWell(@Param('ordinance') ordinance:number){
        return await this.wellService.restoreWell(ordinance);
    }
}
