from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models import Avg

from .models import Review
from .serializers import ReviewSerializer
from apps.bookings.models import Booking
from apps.guides.models import Guide

class CreateReviewView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        guide_id = request.data.get("guide")
        rating = request.data.get("rating")
        comment = request.data.get("comment")

        guide = Guide.objects.get(id=guide_id)

        # CHECK: user must have booking
        has_booking = Booking.objects.filter(
            traveler=request.user,
            guide=guide,
            status="accepted"
        ).exists()

        if not has_booking:
            return Response(
                {"error": "You can only review after a completed booking"},
                status=status.HTTP_403_FORBIDDEN
            )

        review = Review.objects.create(
            traveler=request.user,
            guide=guide,
            rating=rating,
            comment=comment
        )

        # Met à jour la moyenne du guide après création d'un avis
        reviews = Review.objects.filter(guide=guide)
        result = reviews.aggregate(avg=Avg('rating'))
        average = result['avg'] or 0
        guide.average_rating = round(average, 1)
        guide.save()

        serializer = ReviewSerializer(review)

        return Response(serializer.data, status=201)

class GuideReviewsView(APIView):

    def get(self, request, guide_id):

        reviews = Review.objects.filter(guide_id=guide_id)

        serializer = ReviewSerializer(reviews, many=True)

        return Response(serializer.data)