from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .serializers import BookingSerializer
from .models import Booking


class BookingCreateView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = BookingSerializer(data=request.data, context={"request": request})

        if serializer.is_valid():

            serializer.save(traveler=request.user)

            return Response({
                "message": "Booking created",
                "booking_id": serializer.data["id"]
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MyBookingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Récupère les réservations du voyageur connecté
        bookings = Booking.objects.filter(traveler=request.user)

        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)

class GuideBookingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        guide = getattr(request.user, "Guide_profile", None)
        if guide is None:
            return Response({"error": "Guide profile not found"}, status=status.HTTP_404_NOT_FOUND)

        bookings = Booking.objects.filter(guide=guide)


        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)

class BookingsStatusUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):

        try:
            booking = Booking.objects.get(id=pk)
        except Booking.DoesNotExist:
            return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)

        guide = getattr(request.user, "Guide_profile", None)
        if guide is None:
            return Response({"error": "Guide profile not found"}, status=status.HTTP_404_NOT_FOUND)

        if booking.guide != guide :
            return Response(

                {"error":"Unauthorized"},
                status=403
            )
        status_value = request.data.get("status")

        if status_value not in dict(Booking.STATUS_CHOICES):
            return Response(
                {"error": "Invalid status"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        booking.status = status_value

        booking.save()
        serializer = BookingSerializer(booking)

        return Response(serializer.data)

    def delete(self, request, pk):

        try:
            booking = Booking.objects.get(id=pk)
        except Booking.DoesNotExist:
            return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)

        if booking.traveler != request.user:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        booking.status = "cancelled"
        booking.save(update_fields=["status"])

        return Response(status=status.HTTP_204_NO_CONTENT)