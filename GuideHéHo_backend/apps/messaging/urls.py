from django.urls import path
from .views import ContactGuideView

urlpatterns = [
    path('contact-guide/', ContactGuideView.as_view()),
]