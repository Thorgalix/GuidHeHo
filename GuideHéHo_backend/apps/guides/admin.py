from django.contrib import admin
from .models import Language, Theme, Guide, Availability


admin.site.register(Language)
admin.site.register(Theme)
admin.site.register(Guide)
admin.site.register(Availability)
