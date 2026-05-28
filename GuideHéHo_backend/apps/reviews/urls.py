from django.urls import path
from .views import CreateReviewView, GuideReviewsView

urlpatterns = [
    path("", CreateReviewView.as_view()),
    path("<int:guide_id>/", GuideReviewsView.as_view()),
]