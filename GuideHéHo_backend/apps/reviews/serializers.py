from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):

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

