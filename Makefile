build:
	docker compose build

build-no-cache:
	docker compose build --no-cache

up:
	docker compose up

run:
	docker compose up -d

prune:
	docker compose down --remove-orphans --volumes --rmi local

run-tests:
	@docker compose up -d
	@sleep 1
	@docker compose run app npm run test

cli:
	@docker run -it --rm -v .:/workspace nestjs/cli