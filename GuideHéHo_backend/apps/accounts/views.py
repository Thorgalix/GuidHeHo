from datetime import timedelta

from django.contrib.auth import authenticate
from django.db import transaction
import threading
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import EmailVerification
from .utils.email import send_code_email, send_generic_email
import os
from .serializers import PasswordChangeSerializer

from .serializers import UserSerializer, LoginSerializer, RegisterSerializer, PasswordResetRequestSerializer, PasswordResetConfirmSerializer
import os
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from .serializers import PasswordResetRequestSerializer, PasswordResetConfirmSerializer
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.auth.tokens import PasswordResetTokenGenerator



class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):

        serializer = RegisterSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        verification = EmailVerification.objects.create(user=user)

        # Send verification email after DB commit in background thread
        transaction.on_commit(lambda: threading.Thread(
            target=send_code_email,
            args=(user.email, "Verify your account", verification.code),
            daemon=True,
        ).start())
        return Response(
            UserSerializer(user).data,
            status=status.HTTP_201_CREATED
        )

class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):

        serializer = LoginSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        user = authenticate(email=email, password=password)

        if user is None:
            return Response(
                {"detail": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_verified:
            return Response(
                {"detail": "Email address is not verified. Please verify your email."},
                status=status.HTTP_403_FORBIDDEN
            )

        refresh = RefreshToken.for_user(user)
        remember_me = request.data.get("remember_me", False)

        if remember_me:
            refresh.set_exp(lifetime=timedelta(days=30))

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": UserSerializer(user).data
        })


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(
                {"detail": "Logout successful"},
                status=status.HTTP_205_RESET_CONTENT
            )

        except Exception:

            return Response(
                {"detail": "Invalid token"},
                status=status.HTTP_400_BAD_REQUEST
            )

class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):

        code = request.data.get("code")

        try:
            verification = EmailVerification.objects.get(code=code)

        except EmailVerification.DoesNotExist:
            return Response(
                {"detail": "Invalid code"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = verification.user
        user.is_verified = True
        user.save()

        verification.delete()

        return Response({"detail": "Account verified"})


class PasswordChangeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        old_password = serializer.validated_data['old_password']

        if not user.check_password(old_password):
            return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)

        new_password = serializer.validated_data['new_password']
        user.set_password(new_password)
        user.save()

        return Response({"detail": "Password updated successfully."}, status=status.HTTP_200_OK)


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        from apps.accounts.models import User
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Don't reveal account existence
            return Response({"detail": "If an account with that email exists, a reset link has been sent."})

        token_generator = PasswordResetTokenGenerator()
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = token_generator.make_token(user)

        frontend = os.environ.get('FRONTEND_URL')
        if frontend:
            reset_link = f"{frontend}/reset-password?uid={uid}&token={token}"
        else:
            reset_link = f"http://127.0.0.1:8000/users/password-reset-confirm/?uid={uid}&token={token}"

        subject = "Password reset request"
        message = f"To reset your password, visit the following link:\n\n{reset_link}\n\nIf you didn't request this, ignore this email."

        send_generic_email(email, subject, message)

        return Response({"detail": "If an account with that email exists, a reset link has been sent."})


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        uid = serializer.validated_data['uid']
        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']

        try:
            uid_decoded = force_str(urlsafe_base64_decode(uid))
            from apps.accounts.models import User
            user = User.objects.get(pk=uid_decoded)
        except Exception:
            return Response({"detail": "Invalid uid"}, status=status.HTTP_400_BAD_REQUEST)

        token_generator = PasswordResetTokenGenerator()
        if not token_generator.check_token(user, token):
            return Response({"detail": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({"detail": "Password has been reset."}, status=status.HTTP_200_OK)

class UploadProfilePictureView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        if 'profile_picture' not in request.FILES:
            return Response(
                {"error": "No image provided"},
                status=status.HTTP_400_BAD_REQUEST
            )
        user.profile_picture = request.FILES['profile_picture']
        user.save()

        return Response({
            "success": True,
            "profile_picture_url": user.profile_picture.url
        })
