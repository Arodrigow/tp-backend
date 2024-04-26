import { HttpStatus, InternalServerErrorException, Logger } from "@nestjs/common"
import customMessage from "../responses/customMessage.response"

export default function InternalServerExcp(error: any) {    
    Logger.error('Erro encontrado: ', error)
    throw new InternalServerErrorException(
        customMessage(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'Um erro foi encontrado! Tente mais tarde, por favor - teste',
            {}
        )
    )
}