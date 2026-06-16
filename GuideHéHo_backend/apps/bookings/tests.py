from datetime import date, datetime

from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIRequestFactory, force_authenticate
from rest_framework import status

from apps.accounts.models import User
from apps.guides.models import Availability, Guide

from .models import Booking
from .views import BookingsStatusUpdateView
from .serializers import BookingSerializer


class BookingAvailabilityTests(TestCase):
	def setUp(self):
		self.factory = APIRequestFactory()

		self.traveler = User.objects.create_user(
			email="traveler@example.com",
			password="password123",
			first_name="Traveler",
			last_name="One",
			role="traveler",
		)

		self.guide_user = User.objects.create_user(
			email="guide@example.com",
			password="password123",
			first_name="Guide",
			last_name="One",
			role="guide",
		)

		self.guide = Guide.objects.create(
			user=self.guide_user,
			bio="Guide bio",
			city="Paris",
			price_per_hour="50.00",
		)

		self.availability = Availability.objects.create(
			guide=self.guide,
			start_datetime=timezone.make_aware(datetime(2026, 6, 10, 9, 0)),
			end_datetime=timezone.make_aware(datetime(2026, 6, 12, 18, 0)),
			is_available=True,
		)

		self.second_traveler = User.objects.create_user(
			email="traveler2@example.com",
			password="password123",
			first_name="Traveler",
			last_name="Two",
			role="traveler",
		)

	def _create_booking(self, traveler, status_value="pending"):
		return Booking.objects.create(
			traveler=traveler,
			guide=self.guide,
			availability=self.availability,
			Booking_date=timezone.localdate(),
			number_of_people=2,
			status=status_value,
			message="Test booking",
		)

	def test_multiple_bookings_same_date_are_allowed_and_availability_stays_open(self):
		request = self.factory.post("/bookings/")
		request.user = self.traveler

		serializer = BookingSerializer(
			data={
				"availability": self.availability.id,
				"booking_date": date(2026, 6, 11).isoformat(),
				"number_of_people": 2,
				"message": "See you soon",
			},
			context={"request": request},
		)

		self.assertTrue(serializer.is_valid(), serializer.errors)
		first_booking = serializer.save(traveler=self.traveler)

		request2 = self.factory.post("/bookings/")
		request2.user = self.second_traveler

		serializer2 = BookingSerializer(
			data={
				"availability": self.availability.id,
				"booking_date": date(2026, 6, 11).isoformat(),
				"number_of_people": 1,
				"message": "Second request",
			},
			context={"request": request2},
		)

		self.assertTrue(serializer2.is_valid(), serializer2.errors)
		second_booking = serializer2.save(traveler=self.second_traveler)

		self.assertNotEqual(first_booking.id, second_booking.id)
		self.assertEqual(first_booking.Booking_date, date(2026, 6, 11))
		self.assertEqual(second_booking.Booking_date, date(2026, 6, 11))

		self.availability.refresh_from_db()
		self.assertTrue(self.availability.is_available)
		self.assertEqual(self.availability.start_datetime, timezone.make_aware(datetime(2026, 6, 10, 9, 0)))
		self.assertEqual(self.availability.end_datetime, timezone.make_aware(datetime(2026, 6, 12, 18, 0)))

	def test_traveler_can_cancel_booking_with_delete(self):
		booking = self._create_booking(self.traveler)

		request = self.factory.delete(f"/bookings/{booking.id}/")
		force_authenticate(request, user=self.traveler)

		response = BookingsStatusUpdateView.as_view()(request, pk=booking.id)

		self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
		booking.refresh_from_db()
		self.assertEqual(booking.status, "cancelled")

	def test_only_traveler_can_cancel_booking(self):
		booking = self._create_booking(self.traveler)

		request = self.factory.delete(f"/bookings/{booking.id}/")
		force_authenticate(request, user=self.second_traveler)

		response = BookingsStatusUpdateView.as_view()(request, pk=booking.id)

		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
		booking.refresh_from_db()
		self.assertEqual(booking.status, "pending")
