# orders/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('', views.OrderViewSet, basename='order')

urlpatterns = [
    path('create/', views.create_order, name='create-order'),
    path('<int:order_id>/track/', views.track_order, name='track-order'),
    path('<int:order_id>/cancel/', views.cancel_order, name='cancel-order'),
    path('', include(router.urls)),
]