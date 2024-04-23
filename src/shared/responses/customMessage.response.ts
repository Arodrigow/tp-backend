import { RespondeMessageInterface } from "../utils/interfaces";

export default function customMessage(
    statusCode: number,
    message: string,
    data: {}
): RespondeMessageInterface {
    return {
        statusCode: statusCode,
        message: [message],
        data: data,
    }
}