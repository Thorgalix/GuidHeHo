from rest_framework import serializers
from .models import Review
from apps.accounts.serializers import UserSerializer
from apps.guides.serializers import GuideSeralizer


class ReviewSerializer(serializers.ModelSerializer):
    traveler = UserSerializer(read_only=True)
    guide = GuideSeralizer(read_only=True)
    
    def validate_rating(self, value):
        if value is None:
            raise serializers.ValidationError("Rating is required")
        try:
            rating = int(value)
        except (TypeError, ValueError):
            raise serializers.ValidationError("Rating must be an integer")
        if rating < 1 or rating > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return rating

    class Meta:
        model = Review
        fields = [
            "id",
            "traveler",
            "guide",
            "rating",
            "comment",
            "created_at",
        ]
        read_only_fields = ["traveler", "created_at"]

