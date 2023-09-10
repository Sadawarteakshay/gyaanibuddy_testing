import django_filters
from .models import GyaaniBlog
from django_filters.filterset import FilterSet
from django.db.models import Q

class BlogListFilter(FilterSet):
    q = django_filters.CharFilter(method='all_blog_filter')

    class Meta:
        model = GyaaniBlog
        fields = ['q','writer__username']

    def all_blog_filter(self, queryset, name, value):
        return GyaaniBlog.objects.filter(public=True).filter(
            Q(title__icontains=value) | Q(tags__name__in=[value])
        ).distinct()