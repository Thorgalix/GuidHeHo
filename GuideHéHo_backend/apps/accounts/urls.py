from django.urls import path
from .views import UserListView, RegisterView, LoginView


urlpatterns = [
    # List users from the accounts app root.
    path('', UserListView.as_view()),
    # Register a new account.
    path('register/',RegisterView.as_view(),name='register'),
    path('login/', LoginView.as_view()),
]
