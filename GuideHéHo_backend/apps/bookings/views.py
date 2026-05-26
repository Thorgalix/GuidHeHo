from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .serializers import BookingSerializer


class BookingCreateView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = BookingSerializer(data=request.data)

        if serializer.is_valid():

            serializer.save(traveler=request.user)

            return Response({
                "message": "Booking created",
                "booking_id": serializer.data["id"]
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


