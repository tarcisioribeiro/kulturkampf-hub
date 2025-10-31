.PHONY: help up down build logs shell-backend shell-frontend migrate makemigrations createsuperuser test clean

help:
	@echo "Comandos disponíveis:"
	@echo "  make up              - Inicia todos os containers"
	@echo "  make down            - Para todos os containers"
	@echo "  make build           - Reconstrói os containers"
	@echo "  make logs            - Exibe logs dos containers"
	@echo "  make shell-backend   - Acessa shell Python do Django"
	@echo "  make shell-frontend  - Acessa shell do container frontend"
	@echo "  make migrate         - Aplica migrações do banco de dados"
	@echo "  make makemigrations  - Cria novas migrações"
	@echo "  make createsuperuser - Cria usuário admin do Django"
	@echo "  make test            - Roda testes"
	@echo "  make clean           - Remove containers e volumes"

up:
	docker-compose up -d

down:
	docker-compose down

build:
	docker-compose up -d --build

logs:
	docker-compose logs -f

shell-backend:
	docker-compose exec backend python manage.py shell

shell-frontend:
	docker-compose exec frontend sh

migrate:
	docker-compose exec backend python manage.py migrate

makemigrations:
	docker-compose exec backend python manage.py makemigrations

createsuperuser:
	docker-compose exec backend python manage.py createsuperuser

test:
	docker-compose exec backend python manage.py test

clean:
	docker-compose down -v
