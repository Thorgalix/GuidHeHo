from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .pagination import GuidePagination, AvaibilityPagination, FavoritesPagination
from .filters import GuideFilter
from .models import Guide, Availability, Theme, Language
from .permissions import IsAvailabilityOwnerOrReadOnly
from .serializers import GuideCreateSerializer, GuideSeralizer, AvailabilitySerializer, ThemeSerializer, LanguageSerializer


class GuideViewSet(viewsets.ModelViewSet):
    queryset = Guide.objects.all()
    serializer_class = GuideSeralizer
    filter_backends = [DjangoFilterBackend]
    filterset_class = GuideFilter
    pagination_class = GuidePagination

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return GuideCreateSerializer
        return GuideSeralizer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

    @action(detail=False, methods=["get"])
    def themes(self, request):
        return Response(ThemeSerializer(Theme.objects.all(), many=True).data)

    @action(detail=False, methods=["get"])
    def languages(self, request):
        return Response(LanguageSerializer(Language.objects.all(), many=True).data)

    @action(detail=True, methods=["POST"], permission_classes=[IsAuthenticated])
    def favorite(self, request, pk=None):
        guide = self.get_object()
        user = request.user

        # use exists() to avoid loading the whole relation
        is_favorited = guide.favorites.filter(pk=user.pk).exists()
        if is_favorited:
            guide.favorites.remove(user)
            is_favorited = False
            status_text = "removed"
        else:
            guide.favorites.add(user)
            is_favorited = True
            status_text = "added"

        favorites_count = guide.favorites.count()
        return Response({
            "status": f"{status_text} to favorites",
            "is_favorited": is_favorited,
            "favorites_count": favorites_count,
        })


    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def favorites(self, request):
        guides = request.user.favorites_guides.all()
        original_pagination_class = self.pagination_class
        self.pagination_class = FavoritesPagination
        page = self.paginate_queryset(guides)
        self.pagination_class = original_pagination_class
        if page is not None:
            serializer = self.get_serializer(page, many=True, context={"request": request})
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(guides, many=True, context={"request": request})
        return Response(serializer.data)


class GuideMeView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]

    def get_object(self):
        guide = getattr(self.request.user, "Guide_profile", None)
        if guide is None:
            raise NotFound("Guide profile not found")
        return guide

    def get_serializer_class(self):
        if self.request.method == "PATCH":
            return GuideCreateSerializer
        return GuideSeralizer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

class AvailabilityViewSet(viewsets.ModelViewSet):
    queryset = Availability.objects.select_related("guide", "guide__user").all()
    serializer_class = AvailabilitySerializer
    pagination_class = AvaibilityPagination
    permission_classes = [IsAvailabilityOwnerOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        guide_id = self.request.query_params.get("guide")
        if guide_id:
            queryset = queryset.filter(guide_id=guide_id)
        return queryset

    def perform_create(self, serializer):
        guide = getattr(self.request.user, "Guide_profile", None)
        if guide is None:
            raise PermissionDenied("Guide profile not found")
        serializer.save(guide=guide)


