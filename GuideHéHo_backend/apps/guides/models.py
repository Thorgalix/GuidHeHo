from django.db import models
from apps.accounts.models import User


class Language(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Theme(models.Model):
    name = models.CharField(max_length=70)

    def __str__(self):
        return self.name

class Guide(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="Guide_profile")

    bio = models.TextField()

    city = models.CharField(max_length=100)

    price_per_hour = models.DecimalField(max_digits=8, decimal_places=2)

    languages = models.ManyToManyField(Language)
    themes = models.ManyToManyField(Theme)

    average_rating = models.FloatField(default=0)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"

class Availability(models.Model):
    guide = models.ForeignKey(Guide,on_delete=models.CASCADE,related_name="availabilities")

    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()

    is_available = models.BooleanField(default=True)