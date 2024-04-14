import { Type } from "class-transformer";
import { IsNumber, IsString, Min } from "class-validator";

export class CreateProductDto {

    @IsString()
    public name:string;

    @IsNumber({
        maxDecimalPlaces:4 // Solo 4 decimales
    })
    @Min(0)
    @Type(() => Number) //Quiero que transformer el string a number (Lo intentara si no puede lanza un error)
    public price:number;

};
