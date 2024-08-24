-- Script para insertar 100.000 culturas	
INSERT INTO public.cultura_gastronomica_entity(nombre, descripcion)
SELECT
    'Cultura ' || (row_number() OVER ()) AS nombre,
    'Descripción de la cultura ' || (row_number() OVER ()) AS descripcion
FROM generate_series(1, 100000);	
	
	
-- Script para insertar 100.000 paises	
INSERT INTO public.pais_entity(nombre)
SELECT
    'País ' || (row_number() OVER ()) AS nombre
FROM generate_series(1, 100000);	


-- Script para insertar 100.000 productos	
INSERT INTO public.producto_entity(nombre, descripcion, historia)
SELECT
    'Producto ' || (row_number() OVER ()) AS nombre,
    'Descripcion del producto ' || (row_number() OVER ()) AS descripcion,
    'Historia del producto ' || (row_number() OVER ()) AS historia
FROM generate_series(1, 100000);


-- Script para insertar 100.000 recetas	
INSERT INTO public.receta_entity(nombre, descripcion, "urlFoto", "procesoPreparacion", "videoPreparacion")
SELECT
    'Receta ' || (row_number() OVER ()) AS nombre,
    'Descripcion de la receta ' || (row_number() OVER ()) AS descripcion,
    'www.recetasdelmundo.com/fotorecetas/' || (row_number() OVER ()) AS urlFoto,
    'Proceso de preparacion receta ' || (row_number() OVER ()) AS procesoPreparacion,
    'www.recetasdelmundo.com/videorecetas/' || (row_number() OVER ()) AS videoPreparacion

-- Script para incluir 100.000 restaurantes
INSERT INTO public.restaurante_entity(nombre, ciudad)
SELECT
    'Restaurante ' || (row_number() OVER ()) AS nombre,
    'Ciudad ' || (row_number() OVER ()) AS ciudad
FROM generate_series(1, 100000);

-- Script para incluir 100.000 estrellas michelines
INSERT INTO public.restaurante_estrella_michelin_entity(fecha_consecucion, restaurante_id)
SELECT
    NOW() - (interval '1 day' * (row_number() OVER ())),
    (row_number() OVER ()) % (SELECT COUNT(*) FROM restaurante_entity) + 1 AS restaurante_id
FROM generate_series(1, 100000);

-- Script para incluir 100.000 relaciones entre culturas gastronomicas y restaurantes
INSERT INTO public.cultura_gastronomica_restaurante_entity(cultura_gastronomica_id, restaurante_id)
SELECT
    (row_number() OVER ()) % (SELECT COUNT(*) FROM cultura_gastronomica_entity) + 1 AS cultura_gastronomica_id,
    (row_number() OVER ()) % (SELECT COUNT(*) FROM restaurante_entity) + 1 AS restaurante_id
FROM generate_series(1, 100000);

-- Script para insertar 100.000 categorias de productos	
INSERT INTO public.categoria_producto_entity(nombre)
SELECT
    'Producto ' || (row_number() OVER ()) AS nombre
FROM generate_series(1, 100000);