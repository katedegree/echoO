build:
	docker compose build
	docker compose run api composer install
	docker compose run web npm install

up:
	docker compose up -d --build

down:
	docker compose down

exec:
	docker compose exec $(filter-out $@,$(MAKECMDGOALS)) bash

logs:
	docker compose logs $(filter-out $@,$(MAKECMDGOALS)) -f

%:
	@:
