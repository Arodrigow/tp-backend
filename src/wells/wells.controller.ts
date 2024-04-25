import { Body, ClassSerializerInterceptor, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { WellsService } from './wells.service';
import { CreateWellDto } from './dto/create-well.dto';

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

    @Get(':id')
    async findWllById(@Param('id') id:string){
        
    }
}
