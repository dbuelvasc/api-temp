/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/utilidades/configuracion-test';

import { CategoriaProductoProductoService } from './categoria-producto-producto.service';
import { CategoriaProductoEntity } from '../categoria-producto/categoria-producto.entity';
import { ProductoEntity } from '../producto/producto.entity';


describe('CategoriaProductoProductoService', () => {
  let service: CategoriaProductoProductoService;
  let categoriaProductoRepository: Repository<CategoriaProductoEntity>;
  let productoRepository: Repository<ProductoEntity>;
  let categoriaProducto: CategoriaProductoEntity;
  let listaProductos: ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CategoriaProductoProductoService],
    }).compile();

    service = module.get<CategoriaProductoProductoService>(CategoriaProductoProductoService);
    categoriaProductoRepository = module.get<Repository<CategoriaProductoEntity>>(getRepositoryToken(CategoriaProductoEntity));
    productoRepository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    productoRepository.clear();
    categoriaProductoRepository.clear();

    listaProductos = [];
    for (let i = 0; i < 5; i++) {
      const producto: ProductoEntity = await productoRepository.save({
        nombre: faker.location.country.name,
        descripcion: faker.lorem.sentence(),
        historia: faker.lorem.sentence()
      })
      listaProductos.push(producto);
    }

    categoriaProducto = await categoriaProductoRepository.save({
      nombre: faker.company.name(),
      productos: listaProductos
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Agregar un producto a una categoria', async () => {
    const nuevoProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.location.country.name,
      descripcion: faker.lorem.sentence(),
      historia: faker.lorem.sentence()
    });

    const nuevaCategoria: CategoriaProductoEntity = await categoriaProductoRepository.save({
      nombre: faker.company.name(),
    })

    const result: CategoriaProductoEntity = await service.agregarProductoCategoriaProducto(nuevaCategoria.id, nuevoProducto.id);

    expect(result.productos.length).toBe(1);
    expect(result.productos[0]).not.toBeNull();
    expect(result.productos[0].nombre).toBe(nuevoProducto.nombre)

  });

  it('Lanzar error por un producto con id invalido', async () => {
    const nuevaCategoriaProducto: CategoriaProductoEntity = await categoriaProductoRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence()
    })

    await expect(() => service.agregarProductoCategoriaProducto(nuevaCategoriaProducto.id, -1)).rejects.toHaveProperty("mensaje", "El producto con el id dado no existe");
  });

  it('Lanzar error por una categoria de producto con id invalido', async () => {
    const nuevoProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.location.country.name,
      descripcion: faker.lorem.sentence(),
      historia: faker.lorem.sentence()
      
    });

    await expect(() => service.agregarProductoCategoriaProducto(-1, nuevoProducto.id)).rejects.toHaveProperty("mensaje", "La categoria de producto con el id dado no existe");
  });

  it('Obtener un producto a partir de su id y el id de categoria de producto', async () => {
    const producto: ProductoEntity = listaProductos[0];
    const productoGuardado: ProductoEntity = await service.obtenerProductosPorIdCategoriaProductoidProducto(categoriaProducto.id, producto.id,)
    expect(productoGuardado).not.toBeNull();
    expect(productoGuardado.nombre).toBe(producto.nombre);

  });

  it('Se intenta obtener un producto con un id invalido', async () => {
    await expect(() => service.obtenerProductosPorIdCategoriaProductoidProducto(categoriaProducto.id, -1)).rejects.toHaveProperty("mensaje", "El producto con el id dado no existe");
  });

  it('Se intenta obtener un producto con un id categoria de producto invalido', async () => {
    const producto: ProductoEntity = listaProductos[0];
    await expect(() => service.obtenerProductosPorIdCategoriaProductoidProducto(-1, producto.id)).rejects.toHaveProperty("mensaje", "La categoria de producto con el id dado no existe");
  });

  it('Se intenta obtener un producto que no se encuentra asociado a una categoria de producto', async () => {
    const nuevoProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.location.country.name,
      descripcion: faker.lorem.sentence(),
      historia: faker.lorem.sentence()
      
    });

    await expect(() => service.obtenerProductosPorIdCategoriaProductoidProducto(categoriaProducto.id, nuevoProducto.id)).rejects.toHaveProperty("mensaje", "El producto dado no está asociado a la categoria de producto dada");
  });

  it('Se obtienen los productos asociados a una categoria de producto', async () => {
    const productos: ProductoEntity[] = await service.obtenerProductosPorIdCategoriaProducto(categoriaProducto.id);
    expect(productos.length).toBe(5)
  });

  it('Se obtienen los productos asociados a una categoria de producto invalida', async () => {
    await expect(() => service.obtenerProductosPorIdCategoriaProducto(-1)).rejects.toHaveProperty("mensaje", "La categoria de producto con el id dado no existe");
  });

  it('Se actualiza la lista de productos asociados a una categoria de producto', async () => {
    const nuevoProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.location.country.name,
      descripcion: faker.lorem.sentence(),
      historia: faker.lorem.sentence()
    });

    const categoriaProductoActualizada: CategoriaProductoEntity = await service.asociarProductosCategoriaProducto(categoriaProducto.id, [nuevoProducto]);
    expect(categoriaProductoActualizada.productos.length).toBe(1);
    expect(categoriaProductoActualizada.productos[0].nombre).toBe(nuevoProducto.nombre);

  });

  it('Se actualiza la lista de productos asociados a una categoria de producto invalida', async () => {
    const nuevoProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.location.country.name,
      descripcion: faker.lorem.sentence(),
      historia: faker.lorem.sentence()
    });

    await expect(() => service.asociarProductosCategoriaProducto(-1, [nuevoProducto])).rejects.toHaveProperty("mensaje", "La categoria de producto con el id dado no existe");
  });

  it('Se actualiza la lista de productos asociados a una categoria de producto con productos invalidos', async () => {
    const nuevoProducto: ProductoEntity = listaProductos[0];
    nuevoProducto.id = -1;

    await expect(() => service.asociarProductosCategoriaProducto(categoriaProducto.id, [nuevoProducto])).rejects.toHaveProperty("mensaje", "El producto con el id dado no existe");
  });

  it('Se elimina un producto de una categoria de producto', async () => {
    const producto: ProductoEntity = listaProductos[0];

    await service.eliminarProductoCategoriaProducto(categoriaProducto.id, producto.id);

    const categoriaProductoAlmacenada: CategoriaProductoEntity = await categoriaProductoRepository.findOne({ where: { id: categoriaProducto.id }, relations: ["productos"] });
    const productoEliminado: ProductoEntity = categoriaProductoAlmacenada.productos.find(a => a.id === producto.id);

    expect(productoEliminado).toBeUndefined();

  });

  it('Se elimina un producto invalido de una categoria de producto', async () => {
    await expect(() => service.eliminarProductoCategoriaProducto(categoriaProducto.id, -1)).rejects.toHaveProperty("mensaje", "El producto con el id dado no existe");
  });

  it('Se elimina un producto de una categoria de producto invalida', async () => {
    const producto: ProductoEntity = listaProductos[0];
    await expect(() => service.eliminarProductoCategoriaProducto(-1, producto.id)).rejects.toHaveProperty("mensaje", "La categoria de producto con el id dado no existe");
  });

  it('Se elimina un producto no asociado a una categoria de producto', async () => {
    const nuevoProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.location.country.name,
      descripcion: faker.lorem.sentence(),
      historia: faker.lorem.sentence()
    });

    await expect(() => service.eliminarProductoCategoriaProducto(categoriaProducto.id, nuevoProducto.id)).rejects.toHaveProperty("mensaje",  "El producto dado no está asociado a la categoria de producto dada");
  });

});
