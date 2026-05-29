from django.urls import path
from .views import GuideListView, GuideDetailView

urlpatterns = [
    path('', GuideListView.as_view()),
    path('<int:pk>/', GuideDetailView.as_view()),
]
