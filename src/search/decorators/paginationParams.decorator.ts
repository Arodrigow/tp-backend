import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export interface Pagination {
    page: number;
    limit: number;
    size: number;
    offset: number;
}

type MyRequest = FastifyRequest<
    {
        Querystring: {
            page: string,
            size: string,
        }
    }>

export const PaginationParams = createParamDecorator((data, ctx: ExecutionContext): Pagination => {
    const req: MyRequest = ctx.switchToHttp().getRequest();
    const page = parseInt(req.query.page);
    const size = parseInt(req.query.size);

    // check if page and size are valid
    if (isNaN(page) || page < 0 || isNaN(size) || size < 0) {
        throw new BadRequestException('Invalid pagination params');
    }
    // do not allow to fetch large slices of the dataset
    if (size > 200) {
        throw new BadRequestException('Invalid pagination params: Max size is 200');
    }

    // calculate pagination parameters
    const limit = size;
    const offset = page * limit;
    return { page, limit, size, offset };
});