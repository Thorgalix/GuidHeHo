from rest_framework.permissions import BasePermission, SAFE_METHODS

ROLE_GUIDE = "guide"


class IsGuideOrReadOnly(BasePermission):
    """Allow read-only methods for anyone. Unsafe methods allowed only for
    authenticated users with role 'guide' or for staff/superusers.

    Also provides an object-level check via `has_object_permission`.
    """

    def _is_guide_or_admin(self, user):
        return getattr(user, "is_authenticated", False) and (
            getattr(user, "role", None) == ROLE_GUIDE
            or getattr(user, "is_staff", False)
            or getattr(user, "is_superuser", False)
        )

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return self._is_guide_or_admin(request.user)

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return self._is_guide_or_admin(request.user)


class IsAvailabilityOwnerOrReadOnly(BasePermission):
    """Allow read-only access to everyone.

    Unsafe actions are allowed only for the owner guide of the availability
    or for staff/superusers.
    """

    def _is_owner_or_admin(self, user, obj):
        return getattr(user, "is_authenticated", False) and (
            getattr(user, "is_staff", False)
            or getattr(user, "is_superuser", False)
            or getattr(obj, "guide", None) is not None
            and getattr(obj.guide, "user_id", None) == getattr(user, "id", None)
        )

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return getattr(request.user, "is_authenticated", False)

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return self._is_owner_or_admin(request.user, obj)
