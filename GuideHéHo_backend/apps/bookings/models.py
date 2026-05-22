from django.db import models
from apps.accounts.models import User
from apps.guides.models import Availability, Guide


class Booking(models.Model):

    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('cancelled', 'Cancelled'),
    )

    traveler = models.ForeignKey(User,on_delete=models.CASCADE,related_name='bookings')

    guide = models.ForeignKey(Guide,on_delete=models.CASCADE,related_name='bookings')

    availability = models.ForeignKey(Availability,on_delete=models.CASCADE,related_name='bookings')

    Booking_date = models.DateField()

    number_of_people = models.PositiveIntegerField()

    status = models.CharField(max_length=20,choices=STATUS_CHOICES,default='pending')

    message = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.traveler.username} -> {self.guide.user.username}"