from django.core import mail
from django.test import override_settings
from rest_framework import status
from rest_framework.test import APITestCase

from apps.accounts.models import User
from apps.guides.models import Guide
from .models import ContactMessage


@override_settings(EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend")
class ContactGuideViewTests(APITestCase):
	def setUp(self):
		self.traveler = User.objects.create_user(
			email="traveler@example.com",
			password="TestPass123!",
			first_name="Traveler",
			last_name="User",
			role="traveler",
		)
		self.guide_user = User.objects.create_user(
			email="guide@example.com",
			password="TestPass123!",
			first_name="Guide",
			last_name="User",
			role="guide",
		)
		self.guide = Guide.objects.create(
			user=self.guide_user,
			bio="Certified local guide",
			city="Marrakech",
			price_per_hour="25.00",
		)
		self.url = "/contact/contact-guide/"

	def test_contact_guide_sends_email_and_creates_message(self):
		self.client.force_authenticate(user=self.traveler)

		payload = {
			"guide_id": self.guide.id,
			"message": "Bonjour, je voudrais reserver une visite.",
		}
		response = self.client.post(self.url, payload, format="json")

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertTrue(response.data.get("success"))
		self.assertEqual(ContactMessage.objects.count(), 1)

		contact_message = ContactMessage.objects.first()
		self.assertEqual(contact_message.sender, self.traveler)
		self.assertEqual(contact_message.receiver, self.guide_user)
		self.assertEqual(contact_message.message, payload["message"])

		self.assertEqual(len(mail.outbox), 1)
		self.assertIn(self.guide_user.email, mail.outbox[0].to)
		self.assertIn(payload["message"], mail.outbox[0].body)

	def test_contact_guide_returns_404_when_guide_not_found(self):
		self.client.force_authenticate(user=self.traveler)

		payload = {
			"guide_id": 999999,
			"message": "Bonjour",
		}
		response = self.client.post(self.url, payload, format="json")

		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
		self.assertEqual(ContactMessage.objects.count(), 0)
		self.assertEqual(len(mail.outbox), 0)
