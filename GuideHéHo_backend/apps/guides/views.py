from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets


from .models import Guide, Theme, Language
from .serializers import GuideCreateSerializer, GuideSeralizer, ThemeSerializer, LanguageSerializer


class GuideListView(APIView):
    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]
        return [AllowAny()]

    def get(self, request):
        guides = Guide.objects.all()

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

        serializer = GuideSeralizer(guides.distinct(), many=True)
        return Response(serializer.data)

    def post(self, request):
        if request.user.role != "guide":
            return Response(
                {"error": "Only guide accounts can create a guide profile."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if getattr(request.user, "Guide_profile", None) is not None:
            return Response(
                {"error": "Guide profile already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = GuideCreateSerializer(
            data=request.data,
            context={"request": request},
        )

        if serializer.is_valid():
            guide = serializer.save()
            return Response(GuideSeralizer(guide).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GuideDetailView(APIView):
    def get(self, request, pk):
        guide = get_object_or_404(Guide, id=pk)
        serializer = GuideSeralizer(guide)
        return Response(serializer.data)




