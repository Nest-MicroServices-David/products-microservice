import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';

@Module({
  	imports: [ProductsModule],
  	controllers: [],
  	providers: [],
})
export class AppModule {}

/* 
	Notes:

	1.-Creamos nuestros schemas utilizando la syntaxis de prisma
	y este convierte mediante migraciones los schemas a tablas

	npx prisma migrate dev --name init
	
	Este comando lo tenemos que ejecutar cada vez que cambiemos 
	nuestros schemas en prisma

	2.-Despues instalamos el cliente de prisma el cual nos dejara
	introducir en la DB en nuestros servicios

	npm i @prisma/client





*/
