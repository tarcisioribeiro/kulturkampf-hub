# KulturKampf

Hub de conteúdo para escritores (valeteiros) das comunidades Valete e Substack. Plataforma para centralizar, analisar e compartilhar perfis de autores e suas publicações, com métricas de produção e interação via bot de grupo.

## Stack Tecnológica

- **Backend**: Django 5.0 + Django REST Framework
- **Frontend**: React 18 + Vite
- **Banco de Dados**: PostgreSQL 16
- **Orquestração**: Docker + Docker Compose
- **Proxy**: Nginx

## Arquitetura

```
kulturkampf/
├── backend/              # Django API
│   ├── kulturkampf/     # Configuração do projeto
│   ├── core/            # App principal com models e API
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/            # React SPA
│   ├── src/
│   │   ├── pages/      # Componentes de página
│   │   ├── api/        # Cliente axios
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── Dockerfile
├── nginx/              # Configuração do proxy reverso
│   └── nginx.conf
├── docker-compose.yml  # Orquestração dos serviços
├── .env               # Variáveis de ambiente (não commitado)
└── .env.example       # Template de variáveis
```

## Modelos de Dados

### PerfilEscrita
Representa o perfil de um autor na plataforma:
- Nick/Pseudônimo
- Perfil e URL do Valete
- Perfil e URL do Substack
- Tópicos abordados
- Biografia

### Postagem
Armazena publicações dos autores:
- Título e tópico
- Data e horário de publicação
- Plataforma (Valete/Substack)
- URL da postagem original
- Preview do conteúdo
- Coautores (para futura integração)

### Métrica
Consolida estatísticas de produção:
- Mês de referência
- Postagens no mês
- Frequência média entre postagens
- Total acumulado de postagens

## Configuração e Execução

### Pré-requisitos

- Docker 20+
- Docker Compose 2+

### Primeira Execução

1. Clone o repositório:
```bash
git clone <repo-url>
cd kulturkampf
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o .env e altere os valores de produção
```

3. Inicie os containers:
```bash
docker-compose up -d
```

4. Aguarde a inicialização (pode levar alguns minutos na primeira vez)

5. Crie um superusuário Django:
```bash
docker-compose exec backend python manage.py createsuperuser
```

### Acessando a Aplicação

- **Frontend**: http://localhost:5173
- **API**: http://localhost:8000/api/
- **Admin Django**: http://localhost:8000/admin/
- **Nginx (produção)**: http://localhost

### Endpoints da API

Todos os endpoints seguem o padrão REST:

#### Perfis
- `GET /api/perfis/` - Lista todos os perfis
- `POST /api/perfis/` - Cria novo perfil
- `GET /api/perfis/{id}/` - Detalhes de um perfil
- `PUT /api/perfis/{id}/` - Atualiza perfil completo
- `PATCH /api/perfis/{id}/` - Atualiza perfil parcial
- `DELETE /api/perfis/{id}/` - Remove perfil

#### Postagens
- `GET /api/postagens/` - Lista todas as postagens
- `POST /api/postagens/` - Cria nova postagem
- `GET /api/postagens/{id}/` - Detalhes de uma postagem
- `PUT /api/postagens/{id}/` - Atualiza postagem completa
- `PATCH /api/postagens/{id}/` - Atualiza postagem parcial
- `DELETE /api/postagens/{id}/` - Remove postagem

Filtros disponíveis:
- `?perfil=<id>` - Filtra por autor
- `?plataforma=<valete|substack>` - Filtra por plataforma
- `?topico=<topico>` - Filtra por tópico
- `?search=<termo>` - Busca em título, tópico, autor

#### Métricas
- `GET /api/metricas/` - Lista todas as métricas
- `POST /api/metricas/` - Cria nova métrica
- `GET /api/metricas/{id}/` - Detalhes de uma métrica
- `PUT /api/metricas/{id}/` - Atualiza métrica completa
- `PATCH /api/metricas/{id}/` - Atualiza métrica parcial
- `DELETE /api/metricas/{id}/` - Remove métrica

Filtros disponíveis:
- `?perfil=<id>` - Filtra por autor
- `?mes_referencia=<YYYY-MM>` - Filtra por mês

## Comandos Úteis

### Gerenciamento dos Containers

```bash
# Iniciar serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down

# Parar e remover volumes (CUIDADO: apaga o banco de dados)
docker-compose down -v

# Reconstruir containers após mudanças
docker-compose up -d --build
```

### Django

```bash
# Acessar shell Django
docker-compose exec backend python manage.py shell

# Criar migrações
docker-compose exec backend python manage.py makemigrations

# Aplicar migrações
docker-compose exec backend python manage.py migrate

# Coletar arquivos estáticos
docker-compose exec backend python manage.py collectstatic --noinput
```

### Frontend

```bash
# Instalar dependências
docker-compose exec frontend npm install

# Rebuild do frontend
docker-compose exec frontend npm run build
```

## Desenvolvimento

### Backend

O backend utiliza Django com hot-reload. Alterações em arquivos `.py` são detectadas automaticamente.

Para adicionar novas dependências:
1. Adicione ao `backend/requirements.txt`
2. Reconstrua o container: `docker-compose up -d --build backend`

### Frontend

O frontend utiliza Vite com HMR (Hot Module Replacement). Alterações são refletidas instantaneamente.

Para adicionar novas dependências:
```bash
docker-compose exec frontend npm install <pacote>
```

## Variáveis de Ambiente

### Backend (Django)
- `DJANGO_SECRET_KEY`: Chave secreta do Django (OBRIGATÓRIO em produção)
- `DJANGO_DEBUG`: Modo debug (True/False)
- `DJANGO_ALLOWED_HOSTS`: Hosts permitidos (separados por vírgula)

### Banco de Dados
- `POSTGRES_DB`: Nome do banco de dados
- `POSTGRES_USER`: Usuário do PostgreSQL
- `POSTGRES_PASSWORD`: Senha do PostgreSQL (MUDE em produção)
- `POSTGRES_HOST`: Host do banco (nome do serviço docker)
- `POSTGRES_PORT`: Porta do PostgreSQL

### Frontend
- `VITE_API_URL`: URL base da API backend

## Produção

Para deploy em produção:

1. **Altere as credenciais** no `.env`:
   - `DJANGO_SECRET_KEY`: Use uma chave forte e única
   - `POSTGRES_PASSWORD`: Use senha forte
   - `DJANGO_DEBUG`: Defina como `False`

2. **Configure HTTPS** no nginx

3. **Use build de produção do frontend**:
```bash
docker-compose exec frontend npm run build
```

4. **Configure backup automático** do PostgreSQL

5. **Monitore logs**:
```bash
docker-compose logs -f --tail=100
```

## Próximos Passos

- [ ] Implementar scrapers para Valete e Substack
- [ ] Adicionar sistema de agendamento para compartilhamento automático
- [ ] Integrar bot de grupo (Telegram/Discord)
- [ ] Implementar integração com LLM para análises
- [ ] Adicionar autenticação de usuários
- [ ] Criar dashboard com visualizações de métricas
- [ ] Implementar busca avançada e filtros

## Licença

[Definir licença]

## Contribuindo

[Definir guidelines de contribuição]
