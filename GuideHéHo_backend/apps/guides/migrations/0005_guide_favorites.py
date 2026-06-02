from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("guides", "0004_guide_latitude_guide_longitude"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name="guide",
            name="favorites",
            field=models.ManyToManyField(
                blank=True,
                related_name="favorites_guides",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]