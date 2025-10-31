from django.db import models


class WriterProfile(models.Model):
    """
    Representa o perfil de um autor (valeteiro) na plataforma.

    Attributes:
        nick: Pseudônimo usado na comunidade
        perfil_valete: Identificador do perfil no Valete
        url_valete: Link para o perfil no Valete
        perfil_substack: Identificador do perfil no Substack
        url_substack: Link para o perfil no Substack
        topicos_abordados: Tópicos recorrentes nas postagens do autor
        bio: Biografia do autor
        created_at: Data de criação do perfil
        updated_at: Data da última atualização
    """
    nick = models.CharField(
        max_length=100,
        unique=True,
        verbose_name='Pseudônimo'
    )
    valete_profile = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name='Perfil Valete'
    )
    valete_link = models.URLField(
        blank=True,
        null=True,
        verbose_name='URL Valete'
    )
    substack_profile = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name='Perfil Substack'
    )
    substack_url = models.URLField(
        blank=True,
        null=True,
        verbose_name='URL Substack'
    )
    topics = models.TextField(
        blank=True,
        help_text='Tópicos separados por vírgula',
        verbose_name='Tópicos Abordados'
    )
    bio = models.TextField(
        blank=True,
        verbose_name='Biografia'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Criado em'
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Atualizado em'
    )

    class Meta:
        verbose_name = 'Perfil de Escrita'
        verbose_name_plural = 'Perfis de Escrita'
        ordering = ['-created_at']

    def __str__(self):
        return self.nick

    @property
    def topicos_lista(self):
        """Retorna tópicos como lista."""
        if self.topics:
            return [t.strip() for t in self.topics.split(',')]
        return []


class Post(models.Model):
    """
    Representa uma publicação de um autor.

    Attributes:
        perfil: Perfil do autor da postagem
        titulo: Título da publicação
        topico: Tópico principal da postagem
        data_publicacao: Data e horário da publicação
        url: Link para a postagem original
        plataforma: Plataforma onde foi publicada (Valete ou Substack)
        coautores: Perfis de coautores (para futura integração)
        conteudo_preview: Preview do conteúdo
        created_at: Data de criação do registro
    """
    PLATAFORMA_CHOICES = [
        ('valete', 'Valete'),
        ('substack', 'Substack'),
    ]

    profile = models.ForeignKey(
        WriterProfile,
        on_delete=models.CASCADE,
        related_name='postagens',
        verbose_name='Perfil'
    )
    title = models.CharField(
        max_length=300,
        verbose_name='Título'
    )
    topic = models.CharField(
        max_length=100,
        verbose_name='Tópico'
    )
    publish_date = models.DateTimeField(
        verbose_name='Data de Publicação'
    )
    url = models.URLField(
        verbose_name='URL'
    )
    platform = models.CharField(
        max_length=20,
        choices=PLATAFORMA_CHOICES,
        verbose_name='Plataforma'
    )
    coauthors = models.ManyToManyField(
        WriterProfile,
        blank=True,
        related_name='postagens_como_coautor',
        verbose_name='Coautores'
    )
    content_preview = models.TextField(
        blank=True,
        verbose_name='Preview do Conteúdo'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Criado em'
    )

    class Meta:
        verbose_name = 'Postagem'
        verbose_name_plural = 'Postagens'
        ordering = ['-publish_date']
        unique_together = ['profile', 'url']

    def __str__(self):
        return f"{self.title} - {self.profile.nick}"


class Metric(models.Model):
    """
    Consolida estatísticas de produção e frequência de escrita de um autor.

    Attributes:
        perfil: Perfil do autor
        mes_referencia: Mês de referência (formato YYYY-MM)
        postagens_mes: Quantidade de postagens no mês
        frequencia_media_dias: Frequência média em dias entre postagens
        total_postagens: Total acumulado de postagens
        created_at: Data de criação do registro
        updated_at: Data da última atualização
    """
    profile = models.ForeignKey(
        WriterProfile,
        on_delete=models.CASCADE,
        related_name='metricas',
        verbose_name='Perfil'
    )
    month = models.CharField(
        max_length=7,
        help_text='Formato: YYYY-MM',
        verbose_name='Mês de Referência'
    )
    month_posts = models.IntegerField(
        default=0,
        verbose_name='Postagens no Mês'
    )
    days_frequency = models.FloatField(
        null=True,
        blank=True,
        help_text='Média de dias entre postagens',
        verbose_name='Frequência Média (dias)'
    )
    total_posts = models.IntegerField(
        default=0,
        verbose_name='Total de Postagens'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Criado em'
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Atualizado em'
    )

    class Meta:
        verbose_name = 'Métrica'
        verbose_name_plural = 'Métricas'
        ordering = ['-month']
        unique_together = ['profile', 'month']

    def __str__(self):
        return f"{self.profile.nick} - {self.month}"

    @property
    def week_posts(self):
        """Calcula postagens por semana baseado na frequência mensal."""
        if self.month_posts > 0:
            return round(self.month_posts / 4.33, 2)
        return 0
