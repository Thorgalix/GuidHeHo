from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.accounts.models import User
from apps.guides.models import Guide


class Review(models.Model):

    traveler = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='reviews'
    )

    guide = models.ForeignKey(Guide,on_delete=models.CASCADE,related_name='reviews')

    rating = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])

    comment = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("traveler", "guide")