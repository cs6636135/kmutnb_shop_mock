from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    """
    Allows access only to Admin users or Superusers.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role == 'Admin' or request.user.is_superuser


class IsStaffOrAdmin(permissions.BasePermission):
    """
    Allows access to both Admin and Staff users.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role in ['Admin', 'Staff'] or request.user.is_superuser
