from rest_framework import serializers
from apps.guides.models import Availability, Guide
from .models import Booking


class BookingSerializer(serializers.ModelSerializer):

    booking_date = serializers.DateField(source="Booking_date")
    guide = serializers.PrimaryKeyRelatedField(queryset=Guide.objects.all(), required=False)

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

    def validate(self, attrs):
        booking_date = attrs.get("Booking_date")
        guide = attrs.get("guide")
        availability = attrs.get("availability")

        if availability is None:
            raise serializers.ValidationError({"availability": "This field is required."})

        if not availability.is_available:
            raise serializers.ValidationError({"availability": "This availability is no longer available."})

        availability_start = availability.start_datetime.date()
        availability_end = availability.end_datetime.date()

        if booking_date is None:
            raise serializers.ValidationError({"booking_date": "This field is required."})

        if not (availability_start <= booking_date <= availability_end):
            raise serializers.ValidationError({
                "booking_date": "The booking date must be inside the selected availability window."
            })

        if guide is None:
            attrs["guide"] = availability.guide
        elif availability.guide_id != guide.id:
            raise serializers.ValidationError({
                "guide": "The selected availability does not belong to this guide."
            })

        return attrs

    def create(self, validated_data):
        return Booking.objects.create(
            traveler=validated_data["traveler"],
            guide=validated_data["guide"],
            availability=validated_data["availability"],
            Booking_date=validated_data["Booking_date"],
            number_of_people=validated_data["number_of_people"],
            message=validated_data.get("message"),
        )

