from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User

from .serializers import UserSerializer
from .serializers import RegisterSerializer

class UserListView(APIView):

    def get(self, request):
        # Return the full list of users serialized as JSON.
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)

        return Response(serializer.data)

class RegisterView(APIView):

    def post(self, request):

        # Validate the incoming payload before creating the user.
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():

            # Save uses RegisterSerializer.create() to persist the user.
            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        # Return serializer validation errors to the client.
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(email=email, password=password)

        if user is None :
            return Response(
                status=status.HTTP_401_UNAUTHORIZED
            )
        refresh = RefreshToken.for_user(user)

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "email": user.email,
                "firstname": user.first_name,
                "lastname": user.last_name,
                "role": user.role
            }
        })

