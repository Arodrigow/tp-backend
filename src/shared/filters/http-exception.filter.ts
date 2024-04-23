import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common"
import {FastifyReply} from 'fastify'
import { ServerResponse } from "http";

export const getErrorMessage = <T extends Error>(exception: T): string =>{
    return exception instanceof HttpException
        ? exception.message
        : String(exception);
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException>{
    catch(exception: HttpException, host: ArgumentsHost):void {
       const ctx = host.switchToHttp();
       const response = ctx.getResponse<FastifyReply>();
       const status = exception.getStatus();

       const errorResponse = exception.getResponse();
       const message = 
        typeof errorResponse === 'string'
            ? errorResponse
            : errorResponse['message'];

        response.status(status).send({
            statusCode: status,
            message: message,
            data: {}
        })
    }
}