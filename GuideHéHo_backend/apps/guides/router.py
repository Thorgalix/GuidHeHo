from rest_framework.routers import DefaultRouter
from .views import GuideViewSet, AvailabilityViewSet

router = DefaultRouter()
router.register(r"guides", GuideViewSet, basename="guide")
router.register(r"availabilities", AvailabilityViewSet, basename="availability")

urlpatterns = router.urls
