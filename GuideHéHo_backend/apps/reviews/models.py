from django.db import models
from apps.accounts.models import User
from apps.guides.models import Guide


class Review(models.Model):

    traveler = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='reviews'
    )

    guide = models.ForeignKey(Guide,on_delete=models.CASCADE,related_name='reviews')

    rating = models.PositiveIntegerField()

    comment = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("traveler", "guide")