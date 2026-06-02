from django.core.management.base import BaseCommand

from apps.guides.models import Guide
from apps.guides.services.mapbox_geocoding import geocode_city


class Command(BaseCommand):
    help = "Backfill latitude and longitude for existing guides using their city."

    def handle(self, *args, **options):
        guides = Guide.objects.all().order_by("id")
        updated_count = 0
        skipped_count = 0

        for guide in guides:
            latitude, longitude = geocode_city(guide.city)

            if latitude is None or longitude is None:
                skipped_count += 1
                self.stdout.write(
                    self.style.WARNING(
                        f"Skipped guide #{guide.id} ({guide.city}): geocoding failed."
                    )
                )
                continue

            guide.latitude = latitude
            guide.longitude = longitude
            guide.save(update_fields=["latitude", "longitude"])
            updated_count += 1

            self.stdout.write(
                self.style.SUCCESS(
                    f"Updated guide #{guide.id} ({guide.city}) -> {latitude}, {longitude}"
                )
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"Done. Updated {updated_count} guide(s), skipped {skipped_count}."
            )
        )