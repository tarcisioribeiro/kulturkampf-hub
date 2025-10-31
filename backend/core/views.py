from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import WriterProfile, Post, Metric
from .serializers import (
    WriterProfileSerializer, PostSerializer, MetricSerializer
)


class WriterProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar perfis de escrita.

    Endpoints:
        GET    /api/perfis/          - Lista todos os perfis
        POST   /api/perfis/          - Cria novo perfil
        GET    /api/perfis/{id}/     - Detalhes de um perfil
        PUT    /api/perfis/{id}/     - Atualiza perfil completo
        PATCH  /api/perfis/{id}/     - Atualiza perfil parcial
        DELETE /api/perfis/{id}/     - Remove perfil

    Filtros disponíveis:
        - search: busca por nick, perfil_valete, perfil_substack
        - ordering: ordena por qualquer campo (ex: -created_at)
    """
    queryset = WriterProfile.objects.all()
    serializer_class = WriterProfileSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    search_fields = ['nick', 'valete_profile', 'substack_profile', 'topics']
    ordering_fields = ['nick', 'created_at', 'updated_at']
    ordering = ['-created_at']


class PostViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar postagens.

    Endpoints:
        GET    /api/postagens/          - Lista todas as postagens
        POST   /api/postagens/          - Cria nova Post
        GET    /api/postagens/{id}/     - Detalhes de uma Post
        PUT    /api/postagens/{id}/     - Atualiza Post completa
        PATCH  /api/postagens/{id}/     - Atualiza Post parcial
        DELETE /api/postagens/{id}/     - Remove Post

    Filtros disponíveis:
        - perfil: filtra por ID do perfil
        - plataforma: filtra por plataforma (valete, substack)
        - topico: filtra por tópico exato
        - search: busca por título, tópico, nick do autor
        - ordering: ordena por qualquer campo (ex: -data_publicacao)
    """
    queryset = Post.objects.select_related(
        'profile'
    ).prefetch_related(
        'coauthors'
    )
    serializer_class = PostSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    filterset_fields = ['profile', 'platform', 'topic']
    search_fields = ['title', 'topic', 'profile__nick', 'content_preview']
    ordering_fields = ['publish_date', 'created_at', 'title']
    ordering = ['-publish_date']


class MetricViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar métricas.

    Endpoints:
        GET    /api/metricas/          - Lista todas as métricas
        POST   /api/metricas/          - Cria nova métrica
        GET    /api/metricas/{id}/     - Detalhes de uma métrica
        PUT    /api/metricas/{id}/     - Atualiza métrica completa
        PATCH  /api/metricas/{id}/     - Atualiza métrica parcial
        DELETE /api/metricas/{id}/     - Remove métrica

    Filtros disponíveis:
        - perfil: filtra por ID do perfil
        - mes_referencia: filtra por mês (formato YYYY-MM)
        - search: busca por nick do autor, mês de referência
        - ordering: ordena por qualquer campo (ex: -mes_referencia)
    """
    queryset = Metric.objects.select_related('profile')
    serializer_class = MetricSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    filterset_fields = ['profile', 'month']
    search_fields = ['profile__nick', 'month']
    ordering_fields = ['month', 'month_posts', 'created_at']
    ordering = ['-month']
