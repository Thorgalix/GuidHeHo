from django.test import TestCase
from rest_framework.test import APIClient
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import get_user_model
from decimal import Decimal

from apps.guides.models import Guide, Availability
from apps.bookings.models import Booking
from apps.reviews.models import Review


class ReviewAPITests(TestCase):

	def setUp(self):
		User = get_user_model()
		# traveler who will post reviews
		self.traveler = User.objects.create_user(username="traveler", password="pass")

		# guide user and profile
		self.guide_user = User.objects.create_user(username="guideuser", password="pass")
		self.guide = Guide.objects.create(
			user=self.guide_user,
			bio="Guide bio",
			city="City",
			price_per_hour=Decimal('10.00')
		)

		# availability for booking
		start = timezone.now()
		end = start + timedelta(hours=1)
		self.availability = Availability.objects.create(
			guide=self.guide,
			start_datetime=start,
			end_datetime=end
		)

		# accepted booking linking traveler and guide
		self.booking = Booking.objects.create(
			traveler=self.traveler,
			guide=self.guide,
			availability=self.availability,
			Booking_date=timezone.now().date(),
			number_of_people=1,
			status='accepted'
		)

		self.client = APIClient()

	def test_create_review_success(self):
		self.client.force_authenticate(user=self.traveler)
		data = {"guide": self.guide.id, "rating": 5, "comment": "Great"}
		resp = self.client.post('/reviews/', data, format='json')
		self.assertEqual(resp.status_code, 201)
		self.assertEqual(Review.objects.count(), 1)
		review = Review.objects.first()
		self.assertEqual(review.traveler, self.traveler)
		self.assertEqual(float(self.guide.average_rating), 5.0)

	def test_create_review_without_booking_forbidden(self):
		# new user without booking
		User = get_user_model()
		other = User.objects.create_user(username="other", password="pass")
		self.client.force_authenticate(user=other)
		data = {"guide": self.guide.id, "rating": 4, "comment": "Nice"}
		resp = self.client.post('/reviews/', data, format='json')
		self.assertEqual(resp.status_code, 403)
		self.assertEqual(Review.objects.count(), 0)

	def test_double_review_is_rejected(self):
		self.client.force_authenticate(user=self.traveler)
		data = {"guide": self.guide.id, "rating": 5, "comment": "Nice"}
		resp1 = self.client.post('/reviews/', data, format='json')
		self.assertEqual(resp1.status_code, 201)
		resp2 = self.client.post('/reviews/', data, format='json')
		self.assertIn(resp2.status_code, (400,))
