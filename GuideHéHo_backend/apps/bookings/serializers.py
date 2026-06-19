from django.db import transaction

from rest_framework import serializers

from apps.guides.serializers import GuideSeralizer
from apps.guides.models import Availability, Guide
from .models import Booking

class BookingTravelerSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()

class BookingSerializer(serializers.ModelSerializer):

    guide = GuideSeralizer(read_only=True)
    traveler = BookingTravelerSerializer(read_only=True)
    # Frontend envoie booking_date
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

    def validate(self, attrs):

        booking_date = attrs.get("Booking_date")
        availability = attrs.get("availability")
        guide = attrs.get("guide")
        number_of_people = attrs.get("number_of_people")

        request_user = self.context["request"].user

        # Vérifie availability
        if availability is None:
            raise serializers.ValidationError({
                "availability": "This field is required."
            })

        # Vérifie si déjà réservé
        if not availability.is_available:
            raise serializers.ValidationError({
                "availability": "This availability is already booked."
            })

        # Empêche auto-réservation
        if availability.guide.user == request_user:
            raise serializers.ValidationError({
                "guide": "You cannot book yourself."
            })

        # Vérifie date
        if booking_date is None:
            raise serializers.ValidationError({
                "booking_date": "This field is required."
            })

        if not (
            availability.start_datetime.date()
            <= booking_date
            <= availability.end_datetime.date()
        ):
            raise serializers.ValidationError({
                "booking_date": "Date must be inside availability window."
            })

        # Guide auto ou vérification
        if guide is None:
            attrs["guide"] = availability.guide

        elif availability.guide_id != guide.id:
            raise serializers.ValidationError({
                "guide": "Guide mismatch with availability."
            })

        # Capacité max (optionnelle selon le modèle Availability)
        max_people = getattr(availability, "max_people", None)
        if max_people is not None and number_of_people > max_people:
            raise serializers.ValidationError({
                "number_of_people":
                f"Maximum allowed is {max_people}."
            })

        return attrs

# Création de la réservation
    def create(self, validated_data):

        with transaction.atomic():

            availability = Availability.objects.select_for_update().get(
                pk=validated_data["availability"].pk
            )
            booking_date = validated_data["Booking_date"]

            if not (
                availability.start_datetime.date()
                <= booking_date
                <= availability.end_datetime.date()
            ):
                raise serializers.ValidationError({
                    "booking_date": "Date must be inside availability window."
                })

            if not availability.is_available:
                raise serializers.ValidationError({
                    "availability": "Already booked."
                })

            booking = Booking.objects.create(
                traveler=validated_data["traveler"],
                guide=validated_data["guide"],
                availability=availability,
                Booking_date=booking_date,
                number_of_people=validated_data["number_of_people"],
                message=validated_data.get("message"),
            )

            return booking

