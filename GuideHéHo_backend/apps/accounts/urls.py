from django.urls import path
from .views import VerifyEmailView
from rest_framework_simplejwt.views import (TokenObtainPairView,TokenRefreshView,)

from .views import LoginView, RegisterView, LogoutView, MeView, PasswordChangeView, PasswordResetRequestView, PasswordResetConfirmView, UploadProfilePictureView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('me/', MeView.as_view()),
    path('update/', MeView.as_view()),
    path("verify-email/", VerifyEmailView.as_view()),
    path('change-password/', PasswordChangeView.as_view()),
    path('password-reset/', PasswordResetRequestView.as_view()),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view()),
    path('upload-profile/', UploadProfilePictureView.as_view()),
    path("api/token/", TokenObtainPairView.as_view()),
    path("api/token/refresh/", TokenRefreshView.as_view()),

]
