from django.apps import AppConfig


class GuidesConfig(AppConfig):
    name = "apps.guides"

    def ready(self):
        from . import signals  # noqa: F401
