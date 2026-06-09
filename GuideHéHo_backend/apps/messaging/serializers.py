from rest_framework import serializers
from .models import ContactMessage

class ContactMessageSerializer(serializers.Serializer):
    class Meta:
        model = ContactMessage
        fields = [
            "sender",
            "receiver",
            "message"
        ]