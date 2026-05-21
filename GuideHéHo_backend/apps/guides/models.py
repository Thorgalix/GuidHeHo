from django.db import models
from apps.accounts.models import User


class GuideProfile(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='guide_profile'
    )

    bio = models.TextField()

    city = models.CharField(max_length=100)

    price_per_hour = models.DecimalField(
        max_digits=8,
        decimal_places=2
    )

    average_rating = models.FloatField(default=0)

    languages = models.CharField(max_length=255)

    profile_picture = models.ImageField(
        upload_to='guides/',
        blank=True,
        null=True
    )

    def __str__(self):
        return f"{self.user.username}"

class Availability(models.Model):

    guide = models.ForeignKey(
        GuideProfile,
        on_delete=models.CASCADE,
        related_name='availabilities'
    )

    start_date = models.DateField()
    end_date = models.DateField()

    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.guide.user.username} ({self.start_date} - {self.end_date})"