from django.contrib import admin
from .models import Language, Theme, Guide, Availability
from .services.mapbox_geocoding import geocode_city

class GuideAdmin(admin.ModelAdmin):
    list_display = ("user", "city", "latitude", "longitude", "price_per_hour")
    filter_horizontal = ("languages", "themes")

    def save_model(self, request, obj, form, change):
        latitude, longitude = geocode_city(obj.city)
        obj.latitude = latitude
        obj.longitude = longitude
        super().save_model(request, obj, form, change)

admin.site.register(Language)
admin.site.register(Theme)
admin.site.register(Guide, GuideAdmin)
admin.site.register(Availability)
