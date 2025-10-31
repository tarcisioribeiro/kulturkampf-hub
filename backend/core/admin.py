from django.contrib import admin
from .models import WriterProfile, Post, Metric


@admin.register(WriterProfile)
class WriterProfileAdmin(admin.ModelAdmin):
    list_display = ['nick', 'valete_profile', 'substack_profile', 'created_at']
    search_fields = ['nick', 'valete_profile', 'substack_profile']
    list_filter = ['created_at']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['title', 'profile', 'topic', 'platform', 'publish_date']
    search_fields = ['title', 'topic', 'profile__nick']
    list_filter = ['platform', 'publish_date', 'topic']
    readonly_fields = ['created_at']
    filter_horizontal = ['coauthors']


@admin.register(Metric)
class MetricaAdmin(admin.ModelAdmin):
    list_display = [
        'profile',
        'month',
        'month_posts',
        'days_frequency',
        'total_posts'
    ]
    search_fields = ['profile__nick', 'month']
    list_filter = ['month']
    readonly_fields = ['created_at', 'updated_at']
