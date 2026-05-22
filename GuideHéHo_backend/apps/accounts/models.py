from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    ROLE_CHOICES = (
        ("traveler", "Traveler"),
        ("guide", "Guide"),
    )

    username = None
    email = models.CharField(max_length=254, unique=True)

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

    role = models.CharField(max_length=20, choices= ROLE_CHOICES, default="traveler")

    profile_picture = models.ImageField(upload_to="profiles/",blank=True,null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email





