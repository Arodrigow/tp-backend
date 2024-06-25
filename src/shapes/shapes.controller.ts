import { Controller, Get, Param } from '@nestjs/common';
import { ShapesService } from './shapes.service';

@Controller('siimasapi/shapes')
export class ShapesController {

    constructor(
        private readonly shapesService:ShapesService
    ){}

    @Get(':name')
    async getShape(@Param('name') name: string){
        return await this.shapesService.getShapeByName(name);
    }
}
