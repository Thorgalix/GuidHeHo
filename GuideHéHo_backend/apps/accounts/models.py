from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email, password=None, **extra_fields):
        # Require an email because it is the login identifier.
        if not email:
            raise ValueError("The Email field must be set.")

        # Normalize the email before persisting the user.
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        # Hash the password instead of storing it in plain text.
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        # Force the admin flags required by Django.
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):

    # Role values used by the UI and business logic.
    ROLE_CHOICES = (
        ("traveler", "Traveler"),
        ("guide", "Guide"),
    )

    # Replace the default username login with email.
    username = None
    email = models.EmailField(unique=True)

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

    role = models.CharField(max_length=20, choices= ROLE_CHOICES, default="traveler")

    profile_picture = models.ImageField(upload_to="profiles/",blank=True,null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    is_verified = models.BooleanField(default=False)

    objects = UserManager()

    # Email becomes the authentication field for this custom user model.
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    def __str__(self):
        return self.email


import random
from django.conf import settings


class EmailVerification(models.Model):

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    code = models.CharField(max_length=6)

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):

        if not self.code:
            self.code = str(random.randint(100000, 999999))

        super().save(*args, **kwargs)

