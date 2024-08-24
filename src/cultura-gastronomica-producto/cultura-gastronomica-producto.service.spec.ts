/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/utilidades/configuracion-test';

import { CulturaGastronomicaProductoService } from './cultura-gastronomica-producto.service';
import { CulturaGastronomicaEntity } from './../cultura-gastronomica/cultura-gastronomica.entity';
import { ProductoEntity } from './../producto/producto.entity';


describe('CulturaGastronomicaProductoService', () => {
  let service: CulturaGastronomicaProductoService;
  let culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>;
  let productoRepository: Repository<ProductoEntity>;
  let cultura: CulturaGastronomicaEntity;
  let listaProductos: ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CulturaGastronomicaProductoService],
    }).compile();

    service = module.get<CulturaGastronomicaProductoService>(CulturaGastronomicaProductoService);
    culturaGastronomicaRepository = module.get<Repository<CulturaGastronomicaEntity>>(getRepositoryToken(CulturaGastronomicaEntity));
    productoRepository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    productoRepository.clear();
    culturaGastronomicaRepository.clear();

    listaProductos = [];
    for (let i = 0; i < 5; i++) {
      const producto: ProductoEntity = await productoRepository.save({
        nombre: faker.location.country.name,
        descripcion: faker.lorem.sentence(),
        historia: faker.lorem.sentence()
      })
      listaProductos.push(producto);
    }

    cultura = await culturaGastronomicaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      productos: listaProductos
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Agregar un producto a una cultura', async () => {
    const nuevoProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.location.country.name,
      descripcion: faker.lorem.sentence(),
      historia: faker.lorem.sentence()
    });

    const nuevaCultura: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
    })

    const result: CulturaGastronomicaEntity = await service.agregarProductoCulturaGastronomica(nuevaCultura.id, nuevoProducto.id);

    expect(result.productos.length).toBe(1);
    expect(result.productos[0]).not.toBeNull();
    expect(result.productos[0].nombre).toBe(nuevoProducto.nombre)

  });

  it('Lanzar error por un producto con id invalido', async () => {
    const nuevaCultura: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence()
    })

    await expect(() => service.agregarProductoCulturaGastronomica(nuevaCultura.id, -1)).rejects.toHaveProperty("mensaje", "El producto con el id dado no existe");
  });

  it('Lanzar error por una cultura con id invalido', async () => {
    const nuevoProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.location.country.name,
      descripcion: faker.lorem.sentence(),
      historia: faker.lorem.sentence()
      
    });

    await expect(() => service.agregarProductoCulturaGastronomica(-1, nuevoProducto.id)).rejects.toHaveProperty("mensaje", "La cultura gastronómica con el id dado no existe");
  });

  it('Obtener un producto a partir de su id y el id de cultura', async () => {
    const producto: ProductoEntity = listaProductos[0];
    const productoGuardado: ProductoEntity = await service.obtenerProductosPorIdCulturaidProducto(cultura.id, producto.id,)
    expect(productoGuardado).not.toBeNull();
    expect(productoGuardado.nombre).toBe(producto.nombre);

  });

  it('Se intenta obtener un producto con un id invalido', async () => {
    await expect(() => service.obtenerProductosPorIdCulturaidProducto(cultura.id, -1)).rejects.toHaveProperty("mensaje", "El producto con el id dado no existe");
  });

  it('Se intenta obtener un producto con un id cultura invalido', async () => {
    const producto: ProductoEntity = listaProductos[0];
    await expect(() => service.obtenerProductosPorIdCulturaidProducto(-1, producto.id)).rejects.toHaveProperty("mensaje", "La cultura gastronómica con el id dado no existe");
  });

  it('Se intenta obtener un producto que no se encuentra asociado a una cultura', async () => {
    const nuevoProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.location.country.name,
      descripcion: faker.lorem.sentence(),
      historia: faker.lorem.sentence()
      
    });

    await expect(() => service.obtenerProductosPorIdCulturaidProducto(cultura.id, nuevoProducto.id)).rejects.toHaveProperty("mensaje", "El producto dado no está asociado a la cultura dada");
  });

  it('Se obtienen los productos asociados a una cultura', async () => {
    const productos: ProductoEntity[] = await service.obtenerProductosPorIdCultura(cultura.id);
    expect(productos.length).toBe(5)
  });

  it('Se obtienen los productos asociados a una cultura invalida', async () => {
    await expect(() => service.obtenerProductosPorIdCultura(-1)).rejects.toHaveProperty("mensaje", "La cultura gastronómica con el id dado no existe");
  });

  it('Se actualiza la lista de productos asociados a una cultura', async () => {
    const nuevoProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.location.country.name,
      descripcion: faker.lorem.sentence(),
      historia: faker.lorem.sentence()
    });

    const culturaActualizada: CulturaGastronomicaEntity = await service.asociarProductosCulturaGastronomica(cultura.id, [nuevoProducto]);
    expect(culturaActualizada.productos.length).toBe(1);
    expect(culturaActualizada.productos[0].nombre).toBe(nuevoProducto.nombre);

  });

  it('Se actualiza la lista de productos asociados a una cultura invalida', async () => {
    const nuevoProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.location.country.name,
      descripcion: faker.lorem.sentence(),
      historia: faker.lorem.sentence()
    });

    await expect(() => service.asociarProductosCulturaGastronomica(-1, [nuevoProducto])).rejects.toHaveProperty("mensaje", "La cultura gastronómica con el id dado no existe");
  });

  it('Se actualiza la lista de productos asociados a una cultura con productos invalidos', async () => {
    const nuevoProducto: ProductoEntity = listaProductos[0];
    nuevoProducto.id = -1;

    await expect(() => service.asociarProductosCulturaGastronomica(cultura.id, [nuevoProducto])).rejects.toHaveProperty("mensaje", "El producto con el id dado no existe");
  });

  it('Se elimina un producto de una cultura', async () => {
    const producto: ProductoEntity = listaProductos[0];

    await service.eliminarProductoCultura(cultura.id, producto.id);

    const culturaAlmacenada: CulturaGastronomicaEntity = await culturaGastronomicaRepository.findOne({ where: { id: cultura.id }, relations: ["productos"] });
    const productoEliminado: ProductoEntity = culturaAlmacenada.productos.find(a => a.id === producto.id);

    expect(productoEliminado).toBeUndefined();

  });

  it('Se elimina un producto invalido de una cultura', async () => {
    await expect(() => service.eliminarProductoCultura(cultura.id, -1)).rejects.toHaveProperty("mensaje", "El producto con el id dado no existe");
  });

  it('Se elimina un producto de una cultura invalida', async () => {
    const producto: ProductoEntity = listaProductos[0];
    await expect(() => service.eliminarProductoCultura(-1, producto.id)).rejects.toHaveProperty("mensaje", "La cultura gastronómica con el id dado no existe");
  });

  it('Se elimina un producto no asociado a una cultura', async () => {
    const nuevoProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.location.country.name,
      descripcion: faker.lorem.sentence(),
      historia: faker.lorem.sentence()
    });

    await expect(() => service.eliminarProductoCultura(cultura.id, nuevoProducto.id)).rejects.toHaveProperty("mensaje",  "El producto dado no está asociado a la cultura dada");
  });

});
