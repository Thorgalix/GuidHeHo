from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from django.core.mail import send_mail
from django.conf import settings

from apps.accounts.models import User
from apps.guides.models import Guide
from .models import ContactMessage


class ContactGuideView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        guide_id = request.data.get("guide_id")
        message = request.data.get("message")

        if not guide_id:
            return Response(
                {"error": "guide_id required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not message:
            return Response(
                {"error": "Message required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            guide_profile = Guide.objects.select_related("user").get(id=guide_id)
        except Guide.DoesNotExist:
            return Response(
                {"error": "Guide not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        guide = guide_profile.user

        if guide.role != "guide":
            return Response(
                {"error": "Selected user is not a guide"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if user.pk == guide.pk:
            return Response(
                {"error": "You cannot send a message to yourself"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if ContactMessage.objects.filter(sender=user, receiver=guide).exists():
            return Response(
        {"error": "You can only send one message to this guide."},
        status=status.HTTP_400_BAD_REQUEST
        )

        # sauvegarde DB
        contact_message = ContactMessage.objects.create(
            sender=user,
            receiver=guide,
            message=message,
        )

        # email au guide
        send_mail(
            subject="Nouveau message reçu",

            message=f"""
Vous avez reçu un nouveau message.

Informations utilisateur :

Nom : {user.first_name}
Prénom : {user.last_name}
Email : {user.email}

Message :
{message}
""",

            from_email=settings.DEFAULT_FROM_EMAIL,

            recipient_list=[guide.email],

            fail_silently=False,
        )


        return Response(
            {
                "success": True,
                "message": "Message envoyé",
                "contact_message_id": contact_message.id,
            },
            status=status.HTTP_201_CREATED

        )