import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/utilidades/configuracion-test';
import { faker } from '@faker-js/faker';
import { ProductoService } from './producto.service';
import { ProductoEntity } from './producto.entity';

describe('ProductoService', () => {
  let service: ProductoService;
  let repository: Repository<ProductoEntity>;
  let productsList: ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [ProductoService],
    }).compile();

    service = module.get<ProductoService>(ProductoService);
    repository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    productsList = [];
    for (let i = 0; i < 5; i++) {
      const product: ProductoEntity = await repository.save({
        nombre: faker.word.noun(),
        descripcion: faker.lorem.paragraph(),
        historia: faker.lorem.paragraphs(2),
        culturaGastronomica: null,
        categoriaProducto: null,
      });
      productsList.push(product);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all products', async () => {
    const products: ProductoEntity[] = await service.findAll();
    expect(products).not.toBeNull();
    expect(products).toHaveLength(productsList.length);
  });

  it('findOne should return a product by id', async () => {
    const storedProduct: ProductoEntity = productsList[0];
    const product: ProductoEntity = await service.findOne(storedProduct.id);
    expect(product).not.toBeNull();
    expect(product.nombre).toEqual(storedProduct.nombre);
    expect(product.descripcion).toEqual(storedProduct.descripcion);
    expect(product.historia).toEqual(storedProduct.historia);
  });

  it('findOne should throw an exception for an invalid product', async () => {
    await expect(() => service.findOne(0)).rejects.toHaveProperty(
      'mensaje',
      'Producto no encontrado',
    );
  });

  it('create should return a new product', async () => {
    const product: ProductoEntity = {
      id: 0,
      nombre: faker.word.noun(),
      descripcion: faker.lorem.paragraph(),
      historia: faker.lorem.paragraphs(2),
      culturaGastronomica: null,
      categoriaProducto: null,
    };

    const newProduct: ProductoEntity = await service.create(product);
    expect(newProduct).not.toBeNull();

    const storedProduct: ProductoEntity = await repository.findOne({
      where: { id: newProduct.id },
    });
    expect(storedProduct).not.toBeNull();
    expect(storedProduct.nombre).toEqual(newProduct.nombre);
    expect(storedProduct.descripcion).toEqual(newProduct.descripcion);
    expect(storedProduct.historia).toEqual(newProduct.historia);
  });

  it('update should modify a product', async () => {
    const product: ProductoEntity = productsList[0];
    product.nombre = 'Wonderland';
    product.descripcion = 'A wonderfull place';
    product.historia = 'The rabbit created with magic and imagination';
    const updatedProduct: ProductoEntity = await service.update(
      product.id,
      product,
    );
    expect(updatedProduct).not.toBeNull();
    const storedProduct: ProductoEntity = await repository.findOne({
      where: { id: product.id },
    });
    expect(storedProduct).not.toBeNull();
    expect(storedProduct.nombre).toEqual(product.nombre);
    expect(storedProduct.descripcion).toEqual(product.descripcion);
    expect(storedProduct.historia).toEqual(product.historia);
  });

  it('update should throw an exception for an invalid product', async () => {
    let product: ProductoEntity = productsList[0];
    product = {
      ...product,
      nombre: 'Wonderland 2',
      descripcion: 'Another magic place',
      historia: 'This was created by the queen of hearts',
    };
    await expect(() => service.update(0, product)).rejects.toHaveProperty(
      'mensaje',
      'Producto no encontrado',
    );
  });

  it('delete should remove a product', async () => {
    const product: ProductoEntity = productsList[0];
    await service.delete(product.id);
    const deletedProduct: ProductoEntity = await repository.findOne({
      where: { id: product.id },
    });
    expect(deletedProduct).toBeNull();
  });

  it('delete should throw an exception for an invalid product', async () => {
    await expect(() => service.delete(0)).rejects.toHaveProperty(
      'mensaje',
      'Producto no encontrado',
    );
  });
});
