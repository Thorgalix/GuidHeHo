from django.urls import path
from .views import GuideListView, GuideDetailView, ThemeListView, LanguageListView

urlpatterns = [
    path('', GuideListView.as_view()),
    path('themes/', ThemeListView.as_view()),
    path('languages/', LanguageListView.as_view()),
    path('<int:pk>/', GuideDetailView.as_view()),
]