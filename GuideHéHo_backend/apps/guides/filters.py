import django_filters

from .models import Guide, Language, Theme


class GuideFilter(django_filters.FilterSet):
    city = django_filters.CharFilter(field_name="city", lookup_expr="icontains")
    min_price = django_filters.NumberFilter(field_name="price_per_hour", lookup_expr="gte")
    max_price = django_filters.NumberFilter(field_name="price_per_hour", lookup_expr="lte")
    min_rating = django_filters.NumberFilter(field_name="average_rating", lookup_expr="gte")
    date = django_filters.DateFilter(method="filter_by_date")
    number_of_people = django_filters.NumberFilter(method="filter_by_number_of_people")


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

    def filter_by_date(self, queryset, name, value):
        if not value:
            return queryset

        return queryset.filter(
            availabilities__start_datetime__date__lte=value,
            availabilities__end_datetime__date__gte=value,
            availabilities__is_available=True,
        ).distinct()

    def filter_by_number_of_people(self, queryset, name, value):
        if not value:
            return queryset

        return queryset.filter(
            availabilities__max_people__gte=value,
            availabilities__is_available=True,
        ).distinct()