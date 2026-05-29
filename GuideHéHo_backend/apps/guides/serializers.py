from rest_framework import serializers
from .models import Guide, Language, Theme
from apps.accounts.serializers import UserSerializer

class GuideSeralizer(serializers.ModelSerializer):
    languages = serializers.StringRelatedField(many=True)
    themes = serializers.StringRelatedField(many=True)
    user = UserSerializer(read_only=True)

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
        ]


class GuideCreateSerializer(serializers.ModelSerializer):
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
            "price_per_hour",
            "languages",
            "themes",
        ]

    def create(self, validated_data):
        languages = validated_data.pop("languages", [])
        themes = validated_data.pop("themes", [])
        guide = Guide.objects.create(**validated_data)
        guide.languages.set(languages)
        guide.themes.set(themes)
        return guide

class ThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theme
        fields = ["id", "name"]
        
class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ["id", "name"]
