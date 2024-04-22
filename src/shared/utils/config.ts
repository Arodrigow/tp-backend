import * as dotenv from 'dotenv'
import * as fs from 'fs'

export function loadConfig(){
    const enviroment = process.env.NODE_ENV || 'local';

    const data: any = dotenv.parse(fs.readFileSync(`.env.${enviroment}`));

    for(const key in data){
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            process.env[key] = data[key];
        }
    }
}