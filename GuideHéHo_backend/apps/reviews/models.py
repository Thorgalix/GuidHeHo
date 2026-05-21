from django.db import models
from apps.accounts.models import User
from apps.guides.models import GuideProfile


class Review(models.Model):

    traveler = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='reviews'
    )

    guide = models.ForeignKey(
        GuideProfile,
        on_delete=models.CASCADE,
        related_name='reviews'
    )

    rating = models.PositiveIntegerField()

    comment = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.rating}⭐ - {self.guide.user.username}"