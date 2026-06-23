from django.db.models.signals import post_delete
from django.dispatch import receiver

from apps.accounts.models import User

from .models import Guide


@receiver(post_delete, sender=Guide)
def reset_user_role_on_guide_delete(sender, instance, **kwargs):
    if instance.user_id:
        User.objects.filter(pk=instance.user_id).update(role="traveler")