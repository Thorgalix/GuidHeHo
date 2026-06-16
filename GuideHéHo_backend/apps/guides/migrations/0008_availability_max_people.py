from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("guides", "0006_merge_20260602_0819"),
    ]

    operations = [
        migrations.AddField(
            model_name="availability",
            name="max_people",
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
    ]