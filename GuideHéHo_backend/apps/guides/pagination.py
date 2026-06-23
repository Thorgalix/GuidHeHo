from rest_framework.pagination import PageNumberPagination

class GuidePagination(PageNumberPagination):
    page_size = 1
    page_size_query_param = "page_size"
    max_page_size = 50

class AvaibilityPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = "page_size"
    max_page_size = 150


class FavoritesPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = "page_size"
    max_page_size = 10