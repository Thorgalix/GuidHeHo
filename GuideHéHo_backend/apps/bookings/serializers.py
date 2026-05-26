from rest_framework import serializers
from .models import Booking


class BookingSerializer(serializers.ModelSerializer):

    booking_date = serializers.DateField(source="Booking_date")

    class Meta:
        model = Booking
        fields = [
            "id",
            "traveler",
            "guide",
            "booking_date",
            "number_of_people",
            "status",
            "availability",
            "message",
        ]
        read_only_fields = ["traveler", "status"]