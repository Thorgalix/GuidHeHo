from django.urls import path
from .views import BookingCreateView, MyBookingsView, GuideBookingsView, BookingsStatusUpdateView

urlpatterns = [
    path("", BookingCreateView.as_view()),
    path("my/", MyBookingsView.as_view()),
    path("guide/", GuideBookingsView.as_view()),
    path("<int:pk>/", BookingsStatusUpdateView.as_view()),
]