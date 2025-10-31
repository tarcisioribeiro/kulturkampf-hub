#!/bin/bash

echo "======================================"
echo "   KulturKampf - Inicialização"
echo "======================================"
echo ""

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado!"
    echo "Instale o Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado!"
    echo "Instale o Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker e Docker Compose instalados"
echo ""

# Verificar se arquivo .env existe
if [ ! -f .env ]; then
    echo "⚠️  Arquivo .env não encontrado"
    echo "📝 Copiando .env.example para .env..."
    cp .env.example .env
    echo "✅ Arquivo .env criado"
    echo ""
    echo "⚠️  IMPORTANTE: Edite o arquivo .env antes de usar em produção!"
    echo ""
fi

echo "🚀 Iniciando containers..."
docker-compose up -d

echo ""
echo "⏳ Aguardando containers iniciarem..."
sleep 10

echo ""
echo "📊 Status dos containers:"
docker-compose ps

echo ""
echo "======================================"
echo "   Aplicação inicializada!"
echo "======================================"
echo ""
echo "🌐 URLs disponíveis:"
echo "   Frontend:  http://localhost:5173"
echo "   API:       http://localhost:8000/api/"
echo "   Admin:     http://localhost:8000/admin/"
echo ""
echo "📝 Próximos passos:"
echo "   1. Crie um superusuário Django:"
echo "      docker-compose exec backend python manage.py createsuperuser"
echo ""
echo "   2. Acesse o Admin em http://localhost:8000/admin/"
echo ""
echo "   3. Visualize os logs:"
echo "      docker-compose logs -f"
echo ""
echo "   4. Para parar a aplicação:"
echo "      docker-compose down"
echo ""
