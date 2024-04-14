import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {

	const logger = new Logger("ProductsMS Bootstrap");
	// const app = await NestFactory.create(AppModule);

	const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,{
		transport:Transport.TCP,
		options:{
			port:envs.port
		}
	});

	app.useGlobalPipes(
	 	new ValidationPipe({
 			whitelist: true, // Que las propertys tienen que venir exactamente como yo digo (Si vienen mas lanza errores)
 			forbidNonWhitelisted: true, 
 		})
	);
  	await app.listen();
	//await app.startAllMicroservices(); 
	/* 
		Iniciar todos los microservicios dentro de la app 
		esto haria que la aplicacion sea hibrida entre
		el REST API que tenemos y los microservicios
	*/
	logger.log(`Products MS running on PORT ${envs.port}`);
}
bootstrap();
