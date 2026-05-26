from rest_framework import serializers
from .models import Guide
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


