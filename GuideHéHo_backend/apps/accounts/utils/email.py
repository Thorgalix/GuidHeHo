from django.core.mail import send_mail, get_connection
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


def send_code_email(email, subject, code):
    """Send a verification code by email.

    Tries the configured email backend first. On failure, logs the error and
    falls back to the console backend so the verification code is still
    accessible during development.

    Returns True if the code was delivered or printed, False otherwise.
    """

    message = f"Your verification code is: {code}"

    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )
        return True

    except Exception:
        logger.exception("Primary email send failed for %s, falling back to console backend", email)

        # Fallback: print to console so developer/user can still see the code.
        try:
            conn = get_connection(backend='django.core.mail.backends.console.EmailBackend')
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                connection=conn,
                fail_silently=False,
            )
            return True

        except Exception:
            logger.exception("Fallback console email also failed for %s", email)
            return False


def send_generic_email(email, subject, message):
    """Send an arbitrary email body with the same fallback behavior as send_code_email."""
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )
        logger.info("Email sent to %s", email)
        return True
    except Exception:
        logger.exception("Primary email send failed for %s, falling back to console backend", email)
        try:
            conn = get_connection(backend='django.core.mail.backends.console.EmailBackend')
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                connection=conn,
                fail_silently=False,
            )
            return True
        except Exception:
            logger.exception("Fallback console email also failed for %s", email)
            return False


def send_generic_email(email, subject, message):
    """Send a generic email with the same fallback behavior as send_code_email."""
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )
        logger.info("Email sent to %s", email)
        return True

    except Exception:
        logger.exception("Primary email send failed for %s, falling back to console backend", email)
        try:
            conn = get_connection(backend='django.core.mail.backends.console.EmailBackend')
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                connection=conn,
                fail_silently=False,
            )
            return True
        except Exception:
            logger.exception("Fallback console email also failed for %s", email)
            return False
