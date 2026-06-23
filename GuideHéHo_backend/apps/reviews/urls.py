from django.urls import path
from .views import CreateReviewView, GuideReviewsView, TravelerReviewsView

urlpatterns = [
    path("", CreateReviewView.as_view()),
    path("<int:guide_id>/", GuideReviewsView.as_view()),
    path("traveler/<int:traveler_id>/", TravelerReviewsView.as_view()),
]