from unittest.mock import patch

from datetime import datetime

from django.test import TestCase
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate

from apps.accounts.models import User

from .models import Guide, Language, Theme
from .views import GuideMeView, GuideViewSet

# Create your tests here.


class GuideMeViewTests(TestCase):
	def setUp(self):
		self.factory = APIRequestFactory()
		self.guide_user = User.objects.create_user(
			email="guide@example.com",
			password="password123",
			first_name="Guide",
			last_name="One",
			role="guide",
		)
		self.language = Language.objects.create(name="French")
		self.new_language = Language.objects.create(name="English")
		self.theme = Theme.objects.create(name="City tours")
		self.new_theme = Theme.objects.create(name="Food tours")
		self.guide = Guide.objects.create(
			user=self.guide_user,
			bio="Original bio",
			city="Paris",
			latitude=48.856600,
			longitude=2.352200,
			price_per_hour="50.00",
		)
		self.guide.languages.add(self.language)
		self.guide.themes.add(self.theme)

	def test_connected_guide_can_get_profile(self):
		request = self.factory.get("/api/guides/me/")
		force_authenticate(request, user=self.guide_user)

		response = GuideMeView.as_view()(request)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data["bio"], "Original bio")
		self.assertEqual(response.data["city"], "Paris")

	@patch("apps.guides.serializers.geocode_city", return_value=(45.7640, 4.8357))
	def test_connected_guide_can_patch_profile(self, mocked_geocode):
		request = self.factory.patch(
			"/api/guides/me/",
			{
				"bio": "Updated bio",
				"city": "Lyon",
				"price_per_hour": "75.00",
				"languages": [self.new_language.id],
				"themes": [self.new_theme.id],
			},
			format="json",
		)
		force_authenticate(request, user=self.guide_user)

		response = GuideMeView.as_view()(request)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.guide.refresh_from_db()
		self.assertEqual(self.guide.bio, "Updated bio")
		self.assertEqual(self.guide.city, "Lyon")
		self.assertEqual(float(self.guide.latitude), 45.7640)
		self.assertEqual(float(self.guide.longitude), 4.8357)
		self.assertEqual(list(self.guide.languages.values_list("id", flat=True)), [self.new_language.id])
		self.assertEqual(list(self.guide.themes.values_list("id", flat=True)), [self.new_theme.id])
		mocked_geocode.assert_called_once_with("Lyon")


class GuideFilterTests(TestCase):
	def setUp(self):
		self.factory = APIRequestFactory()
		self.user = User.objects.create_user(
			email="guide2@example.com",
			password="password123",
			first_name="Guide",
			last_name="Two",
			role="guide",
		)
		self.language = Language.objects.create(name="French")
		self.theme = Theme.objects.create(name="City tours")
		self.matching_guide = Guide.objects.create(
			user=self.user,
			bio="Matching guide",
			city="Paris",
			latitude=48.856600,
			longitude=2.352200,
			price_per_hour="50.00",
		)
		self.matching_guide.languages.add(self.language)
		self.matching_guide.themes.add(self.theme)

		other_user = User.objects.create_user(
			email="guide3@example.com",
			password="password123",
			first_name="Guide",
			last_name="Three",
			role="guide",
		)
		self.other_guide = Guide.objects.create(
			user=other_user,
			bio="Other guide",
			city="Lyon",
			latitude=45.764000,
			longitude=4.835700,
			price_per_hour="40.00",
		)
		self.other_guide.languages.add(self.language)
		self.other_guide.themes.add(self.theme)

		self.matching_guide.availabilities.create(
			start_datetime=timezone.make_aware(datetime(2026, 6, 10, 9, 0)),
			end_datetime=timezone.make_aware(datetime(2026, 6, 12, 18, 0)),
			max_people=5,
			is_available=True,
		)
		self.other_guide.availabilities.create(
			start_datetime=timezone.make_aware(datetime(2026, 6, 15, 9, 0)),
			end_datetime=timezone.make_aware(datetime(2026, 6, 16, 18, 0)),
			max_people=2,
			is_available=True,
		)

	def test_list_filters_by_date_and_number_of_people(self):
		request = self.factory.get("/api/guides/", {"date": "2026-06-11", "number_of_people": 4})

		response = GuideViewSet.as_view({"get": "list"})(request)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data["count"], 1)
		self.assertEqual(response.data["results"][0]["id"], self.matching_guide.id)
