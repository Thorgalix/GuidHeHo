from urllib.parse import quote

import requests
from django.conf import settings

def geocode_city(city):
    url = f"https://api.mapbox.com/geocoding/v5/mapbox.places/{quote(city)}.json"
    params = {
        "access_token": settings.MAPBOX_ACCESS_TOKEN,
        "limit": 1,
        "language": "fr",
    }

    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
    except requests.RequestException:
        return None, None

    data = response.json()
    features = data.get("features", [])

    if not features:
        return None, None

    longitude, latitude = features[0]["center"]
    return latitude, longitude
