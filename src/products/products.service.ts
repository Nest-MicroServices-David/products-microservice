import { BadRequestException, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

	private readonly logger = new Logger("ProductsService");

	onModuleInit() {
		this.$connect();
		this.logger.log("Base de datos connected!");
	}


	async create(createProductDto: CreateProductDto) {
		//Una vez extendidos de PrismaClient tenemos nuestra tabla product como una propiedad
		const product = await this.product.create({
			data:createProductDto
		}); 
		return {
			data:{
				product
			},
			message:"Product created successfully!"
		};
  	}

  	async findAll(paginationDto:PaginationDto) {
		const { limit,page } = paginationDto;

		const totalProducts = await this.product.count({
			where:{
				avaible:true
			}
		});
		const totalPages = Math.ceil(totalProducts / limit);

		const products = await this.product.findMany({
			skip:( page -1 ) * limit,
			take:limit,
			where:{
				avaible:true
			}
		});


		if(products.length === 0){
			throw new BadRequestException(`Page ${page} doesn't exist!`);
		}

		return {
			data:{
				products
			},
			meta:{
				page,
				limit,
				totalPages,
				totalProducts
			}
		};
  	}

  	async findOne(id: number) {
		
		const product = await this.product.findUnique({
			where:{
				id,
				avaible:true
			}
		});

		if(!product) throw new NotFoundException(`Product with id not found ${id}`);
		
		return {
			data:{
				product
			},
		};
  	}

  	async update(id: number, updateProductDto: UpdateProductDto) {

		const { id:_ ,...data }  = updateProductDto;

		//Checar si las propiedades del updateProductDto no son nulas
		if(Object.keys(updateProductDto).length === 0){
			throw new BadRequestException(`Not values to update...`);
		}


		await this.findOne(id);

		const product = await this.product.update({
			where:{
				id
			},
			data
		});

		return {
			data:{
				product
			},
			message:"Product updated successfully!"
		};

  	}

	/* 
		No borrar la data en MS(MicroServices o Monolitico)	
		Por que? no sabemos cuantos microservicios o entidades
		tienen referencia al ID del producto, por que recordando
		que nuestras ordenes estan en otra DB, en otro lugar
		fisicamente del mundo.
		Es decir tendremos problemas de integridad referencial y 
		entidades huerfanas!
	*/
  	async remove(id: number) {
	
		await this.findOne(id);

		const product = await this.product.delete({
			where:{
				id
			}
		});

		return {
			data:{
				product
			},
			message:"Product delete successfully!"
		};

  	}

	async softRemove(id:number){

		await this.findOne(id);

		const product = await this.product.update({
			where:{id},
			data:{
				avaible:false
			}
		});

		return {
			data:{
				product
			},
			message:"Product deleted successfully!"
		};

	}

}
