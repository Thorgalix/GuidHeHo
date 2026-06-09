from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models import Avg
from django.shortcuts import get_object_or_404
from django.db import IntegrityError

from rest_framework.pagination import PageNumberPagination

from .models import Review
from .serializers import ReviewSerializer
from apps.bookings.models import Booking
from apps.guides.models import Guide

class CreateReviewView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        guide_id = request.data.get("guide")

        guide = get_object_or_404(Guide, id=guide_id)

        # CHECK: user must have booking accepted
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

        serializer = ReviewSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            # ensure traveler is the requesting user and guide instance used
            serializer.save(traveler=request.user, guide=guide)
        except IntegrityError:
            return Response({"error": "You have already reviewed this guide."}, status=status.HTTP_400_BAD_REQUEST)

        # Met à jour la moyenne du guide après création d'un avis
        reviews = Review.objects.filter(guide=guide)
        result = reviews.aggregate(avg=Avg('rating'))
        average = result['avg'] or 0
        guide.average_rating = round(average, 1)
        guide.save()

        return Response(serializer.data, status=201)

class GuideReviewsView(APIView):

    def get(self, request, guide_id):

        reviews = Review.objects.filter(guide_id=guide_id).order_by('-created_at')

        paginator = PageNumberPagination()
        paginator.page_size = 10
        result_page = paginator.paginate_queryset(reviews, request)

        serializer = ReviewSerializer(result_page, many=True)

        return paginator.get_paginated_response(serializer.data)