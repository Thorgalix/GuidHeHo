from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Guide
from .serializers import GuideSeralizer


class GuideListView(APIView):

    def get(self, request):

        guides = Guide.objects.all()

        # FILTERS
        city = request.query_params.get("city")
        price_max = request.query_params.get("price_max")
        language = request.query_params.get("language")
        theme = request.query_params.get("theme")

        if city:
            guides = guides.filter(city__icontains=city)

        if price_max:
            guides = guides.filter(price_per_hour__lte=price_max)

        if language:
            guides = guides.filter(languages__id=language)

        if theme:
            guides = guides.filter(themes__id=theme)

        guides = guides.distinct()

        serializer = GuideSeralizer(guides, many=True)

        return Response(serializer.data)


class GuideDetailView(APIView):

    def get(self, request, pk):

        guide = get_object_or_404(Guide, id=pk)
        serializer = GuideSeralizer(guide)

        return Response(serializer.data)




