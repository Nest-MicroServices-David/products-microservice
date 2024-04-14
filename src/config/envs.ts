import "dotenv/config";
import * as joi from "joi";


interface EnvVars {
    PORT:number;
    DATABASE_URL:string;
};

const envsSchema = joi.object({
    PORT:joi.number().required(),
    DATABASE_URL:joi.string().required(),
}).unknown(true); // Muchas mas .env que estaran flotando (Dentro de un proyecto de node hay muchas mas .env)


const { error,value } = envsSchema.validate(process.env);

if(error){
    // Falta el puerto
    throw new Error(`Config validation error: ${error.message}`);
}

const envVars:EnvVars = value;

export const envs = {
    port:envVars.PORT,
    databaseUrl:envVars.DATABASE_URL
};