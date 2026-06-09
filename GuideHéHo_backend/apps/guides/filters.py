import django_filters

from .models import Guide, Language, Theme


class GuideFilter(django_filters.FilterSet):
    city = django_filters.CharFilter(field_name="city", lookup_expr="icontains")
    min_price = django_filters.NumberFilter(field_name="price_per_hour", lookup_expr="gte")
    max_price = django_filters.NumberFilter(field_name="price_per_hour", lookup_expr="lte")
    min_rating = django_filters.NumberFilter(field_name="average_rating", lookup_expr="gte")
    

    language = django_filters.ModelChoiceFilter(
        field_name="languages",
        queryset=Language.objects.all(),
    )

    theme = django_filters.ModelChoiceFilter(
        field_name="themes",
        queryset=Theme.objects.all(),
    )

    class Meta:
        model = Guide
        fields = []