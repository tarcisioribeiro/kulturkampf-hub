from rest_framework import serializers
from .models import WriterProfile, Post, Metric


class WriterProfileSerializer(serializers.ModelSerializer):
    topicos_lista = serializers.ReadOnlyField(source='topicos_lista')
    total_posts = serializers.SerializerMethodField()

    class Meta:
        model = WriterProfile
        fields = [
            'id',
            'nick',
            'valete_profile',
            'valete_link',
            'substack_profile',
            'substack_url',
            'topics',
            'topicos_lista',
            'bio',
            'total_posts',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_total_posts(self, obj):
        return obj.postagens.count()


class PostSerializer(serializers.ModelSerializer):
    profile_nick = serializers.ReadOnlyField(source='profile.nick')
    coauthors_details = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id',
            'profile',
            'profile_nick',
            'title',
            'topic',
            'publish_date',
            'url',
            'platform',
            'coauthors',
            'coauthors_details',
            'content_preview',
            'created_at',
        ]
        read_only_fields = ['created_at']

    def get_coauthors_details(self, obj):
        return [{'id': c.id, 'nick': c.nick} for c in obj.coauthors.all()]


class MetricSerializer(serializers.ModelSerializer):
    profile_nick = serializers.ReadOnlyField(source='profile.nick')
    week_posts = serializers.ReadOnlyField()

    class Meta:
        model = Metric
        fields = [
            'id',
            'profile',
            'profile_nick',
            'month',
            'month_posts',
            'days_frequency',
            'week_posts',
            'total_posts',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']
