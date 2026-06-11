from rest_framework import serializers
from django.db import transaction

from apps.accounts.serializers import UserSerializer
from .services.mapbox_geocoding import geocode_city

from .models import Guide, Language, Theme, Availability


class ThemeSerializer(serializers.ModelSerializer):
    """Serializer for the `Theme` model (read/write).

    Provides the `id` and `name` fields.
    """

    class Meta:
        model = Theme
        fields = ["id" , "name"]


class LanguageSerializer(serializers.ModelSerializer):
    """Serializer for the `Language` model (read/write).

    Provides the `id` and `name` fields.
    """

    class Meta:
        model = Language
        fields = ["id", "name"]

class GuideSeralizer(serializers.ModelSerializer):
    """Read serializer for `Guide`.

    Returns nested `languages`, `themes` and the `user` (read-only).
    """

    languages = LanguageSerializer(many=True, read_only=True)
    themes = ThemeSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)
    favorites_count = serializers.SerializerMethodField()
    is_favorited = serializers.SerializerMethodField()

    class Meta:
        model = Guide
        fields = [
            "id",
            "bio",
            "city",
            "price_per_hour",
            "average_rating",
            "languages",
            "themes",
            "user",
            "favorites_count",
            "is_favorited",
            "latitude",
            "longitude",
        ]

    def get_favorites_count(self, obj):
        return obj.favorites.count()

    def get_is_favorited(self, obj):
        request = self.context.get("request")
        if not request or request.user.is_anonymous:
            return False
        return obj.favorites.filter(pk=request.user.pk).exists()


class GuideCreateSerializer(serializers.ModelSerializer):
    """Write serializer for creating/updating `Guide`.

    Accepts primary keys for `languages` and `themes` and sets the
    `user` from the request via a HiddenField.
    """
    languages = serializers.PrimaryKeyRelatedField(
        queryset=Language.objects.all(),
        many=True,
    )
    themes = serializers.PrimaryKeyRelatedField(
        queryset=Theme.objects.all(),
        many=True,
    )
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Guide
        fields = [
            "user",
            "bio",
            "city",
            "latitude",
            "longitude",
            "price_per_hour",
            "languages",
            "themes",
        ]

    def create(self, validated_data):
        languages = validated_data.pop("languages", [])
        themes = validated_data.pop("themes", [])
        latitude, longitude = geocode_city(validated_data["city"])
        user = validated_data["user"]

        with transaction.atomic():
            if user.role != "guide":
                user.role = "guide"
                user.save(update_fields=["role"])

            guide = Guide.objects.create(
                latitude=latitude,
                longitude=longitude,
                **validated_data
            )
            guide.languages.set(languages)
            guide.themes.set(themes)

        return guide

class AvailabilitySerializer(serializers.ModelSerializer):
    guide = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Availability
        fields = [
            "id",
            "guide",
            "start_datetime",
            "end_datetime",
            "is_available",
        ]
        read_only_fields = ["is_available"]