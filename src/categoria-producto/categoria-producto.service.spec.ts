/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/utilidades/configuracion-test';
import { faker } from '@faker-js/faker';
import { CategoriaProductoService } from  './categoria-producto.service';
import { CategoriaProductoEntity } from  './categoria-producto.entity';

describe('ProductoService', () => {
  let service: CategoriaProductoService;
  let repository: Repository<CategoriaProductoEntity>;
  let CategoriaProductosList: CategoriaProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [CategoriaProductoService],
    }).compile();

    service = module.get<CategoriaProductoService>(CategoriaProductoService);
    repository = module.get<Repository<CategoriaProductoEntity>>(
      getRepositoryToken(CategoriaProductoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    CategoriaProductosList = [];
    for (let i = 0; i < 5; i++) {
      const categoriaProducto: CategoriaProductoEntity = await repository.save({
        nombre: faker.word.noun(),
        productos: []
      });
      CategoriaProductosList.push(categoriaProducto);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all categorias de productos', async () => {
    const categoriaProductos: CategoriaProductoEntity[] = await service.findAll();
    expect(categoriaProductos).not.toBeNull();
    expect(categoriaProductos).toHaveLength(CategoriaProductosList.length);
  });

  it('findOne should return a product by id', async () => {
    const storedCategoriaProducto: CategoriaProductoEntity = CategoriaProductosList[0];
    const categoriaProducto: CategoriaProductoEntity = await service.findOne(storedCategoriaProducto.id);
    expect(categoriaProducto).not.toBeNull();
    expect(categoriaProducto.nombre).toEqual(storedCategoriaProducto.nombre);
  });

  it('findOne should throw an exception for an invalid product', async () => {
    await expect(() => service.findOne(0)).rejects.toHaveProperty(
      'mensaje',
      'Categoría de productos no encontrada',
    );
  });

  it('create should return a new CategoriaProducto', async () => {
    const categoriaProducto: CategoriaProductoEntity = {
      id: 0,
      nombre: faker.word.noun(),
      productos: []
    };

    const newProduct: CategoriaProductoEntity = await service.create(categoriaProducto);
    expect(newProduct).not.toBeNull();

    const storedCategoriaProducto: CategoriaProductoEntity = await repository.findOne({
      where: { id: newProduct.id },
    });
    expect(storedCategoriaProducto).not.toBeNull();
    expect(storedCategoriaProducto.nombre).toEqual(newProduct.nombre);
  });

  it('update should modify a CategoriaProducto', async () => {
    const categoriaProducto: CategoriaProductoEntity = CategoriaProductosList[0];
    categoriaProducto.nombre = 'Wonderland';
    const updatedProduct: CategoriaProductoEntity = await service.update(
      categoriaProducto.id,
      categoriaProducto,
    );
    expect(updatedProduct).not.toBeNull();
    const storedCategoriaProducto: CategoriaProductoEntity = await repository.findOne({
      where: { id: categoriaProducto.id },
    });
    expect(storedCategoriaProducto).not.toBeNull();
    expect(storedCategoriaProducto.nombre).toEqual(categoriaProducto.nombre);
  });

  it('update should throw an exception for an invalid CategoriaProducto', async () => {
    let categoriaProducto: CategoriaProductoEntity = CategoriaProductosList[0];
    categoriaProducto = {
      ...categoriaProducto,
      nombre: 'Wonderland 2',
    };
    await expect(() => service.update(0, categoriaProducto)).rejects.toHaveProperty(
      'mensaje',
      'Categoría de productos no encontrada',
    );
  });

  it('delete should remove a CategoriaProducto', async () => {
    const categoriaProducto: CategoriaProductoEntity = CategoriaProductosList[0];
    await service.delete(categoriaProducto.id);
    const deletedProduct: CategoriaProductoEntity = await repository.findOne({
      where: { id: categoriaProducto.id },
    });
    expect(deletedProduct).toBeNull();
  });

  it('delete should throw an exception for an invalid CategoriaProducto', async () => {
    await expect(() => service.delete(0)).rejects.toHaveProperty(
      'mensaje',
      'Categoría de productos no encontrada',
    );
  });
});
