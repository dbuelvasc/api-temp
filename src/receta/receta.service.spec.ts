import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/utilidades/configuracion-test';
import { faker } from '@faker-js/faker';
import { RecetaService } from './receta.service';
import { RecetaEntity } from './receta.entity';

describe('RecetaService', () => {
  let service: RecetaService;
  let repository: Repository<RecetaEntity>;
  let recipesList: RecetaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [RecetaService],
    }).compile();

    service = module.get<RecetaService>(RecetaService);
    repository = module.get<Repository<RecetaEntity>>(
      getRepositoryToken(RecetaEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    recipesList = [];
    for (let i = 0; i < 5; i++) {
      const recipe: RecetaEntity = await repository.save({
        nombre: faker.word.noun(),
        descripcion: faker.lorem.paragraph(),
        urlFoto: faker.internet.url(),
        procesoPreparacion: faker.lorem.paragraphs(),
        videoPreparacion: faker.internet.url(),
      });
      recipesList.push(recipe);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all recipes', async () => {
    const recipes: RecetaEntity[] = await service.findAll();
    expect(recipes).not.toBeNull();
    expect(recipes).toHaveLength(recipesList.length);
  });

  it('findOne should return a recipe by id', async () => {
    const storedRecipe: RecetaEntity = recipesList[0];
    const recipe: RecetaEntity = await service.findOne(storedRecipe.id);
    expect(recipe).not.toBeNull();
    expect(recipe.nombre).toEqual(storedRecipe.nombre);
    expect(recipe.descripcion).toEqual(storedRecipe.descripcion);
    expect(recipe.urlFoto).toEqual(storedRecipe.urlFoto);
    expect(recipe.procesoPreparacion).toEqual(storedRecipe.procesoPreparacion);
    expect(recipe.videoPreparacion).toEqual(storedRecipe.videoPreparacion);
  });

  it('findOne should throw an exception for an invalid recipe', async () => {
    await expect(() => service.findOne(0)).rejects.toHaveProperty(
      'mensaje',
      'Receta no encontrada',
    );
  });

  it('create should return a new recipe', async () => {
    const recipe: RecetaEntity = {
      id: 0,
      nombre: faker.word.noun(),
      descripcion: faker.lorem.paragraph(),
      urlFoto: faker.internet.url(),
      procesoPreparacion: faker.lorem.paragraphs(),
      videoPreparacion: faker.internet.url(),
      culturaGastronomica: null,
    };

    const newRecipe: RecetaEntity = await service.create(recipe);
    expect(newRecipe).not.toBeNull();

    const storedRecipe: RecetaEntity = await repository.findOne({
      where: { id: newRecipe.id },
    });
    expect(storedRecipe).not.toBeNull();
    expect(storedRecipe.nombre).toEqual(newRecipe.nombre);
    expect(storedRecipe.descripcion).toEqual(newRecipe.descripcion);
    expect(storedRecipe.urlFoto).toEqual(newRecipe.urlFoto);
    expect(storedRecipe.procesoPreparacion).toEqual(
      newRecipe.procesoPreparacion,
    );
    expect(storedRecipe.videoPreparacion).toEqual(newRecipe.videoPreparacion);
  });

  it('update should modify a recipe', async () => {
    const recipe: RecetaEntity = recipesList[0];
    recipe.nombre = 'Wonderland';
    recipe.descripcion = 'A wonderfull place';
    recipe.urlFoto = 'https://www.LaReceta.com/foto1';
    recipe.procesoPreparacion = 'Paso 1, paso 2, paso 3';
    recipe.videoPreparacion = 'https://www.LaReceta.com/video1';

    const updatedRecipe: RecetaEntity = await service.update(recipe.id, recipe);
    expect(updatedRecipe).not.toBeNull();
    const storedRecipe: RecetaEntity = await repository.findOne({
      where: { id: recipe.id },
    });
    expect(storedRecipe).not.toBeNull();
    expect(storedRecipe.nombre).toEqual(recipe.nombre);
    expect(storedRecipe.descripcion).toEqual(recipe.descripcion);
    expect(storedRecipe.urlFoto).toEqual(recipe.urlFoto);
    expect(storedRecipe.procesoPreparacion).toEqual(recipe.procesoPreparacion);
    expect(storedRecipe.videoPreparacion).toEqual(recipe.videoPreparacion);
  });

  it('update should throw an exception for an invalid recipe', async () => {
    let recipe: RecetaEntity = recipesList[0];
    recipe = {
      ...recipe,
      nombre: 'Wonderland 2',
      descripcion: 'Another magic place',
      urlFoto: 'https://www.LaReceta.com/foto12',
      procesoPreparacion: 'Paso 1, paso 2, paso 3, paso 3.1',
      videoPreparacion: 'https://www.LaReceta.com/video12',
    };
    await expect(() => service.update(0, recipe)).rejects.toHaveProperty(
      'mensaje',
      'Receta no encontrada',
    );
  });

  it('delete should remove a recipe', async () => {
    const recipe: RecetaEntity = recipesList[0];
    await service.delete(recipe.id);
    const deletedRecipe: RecetaEntity = await repository.findOne({
      where: { id: recipe.id },
    });
    expect(deletedRecipe).toBeNull();
  });

  it('delete should throw an exception for an invalid recipe', async () => {
    await expect(() => service.delete(0)).rejects.toHaveProperty(
      'mensaje',
      'Receta no encontrada',
    );
  });
});
