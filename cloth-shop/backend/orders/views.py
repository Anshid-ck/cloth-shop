# orders/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.utils import timezone
from django.db import transaction
from decimal import Decimal
from .models import Order, OrderItem, OrderTracking
from .serializers import OrderListSerializer, OrderDetailSerializer, OrderCreateSerializer
from cart.models import Cart, CartItem
from products.models import Product
from payments.models import Payment

class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderDetailSerializer

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all().order_by('-created_at')
        return self.request.user.orders.all().order_by('-created_at')

    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'my_orders':
            return OrderListSerializer
        return OrderDetailSerializer

    @action(detail=False, methods=['get'], url_path='my-orders')
    def my_orders(self, request):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def create_order(request):
    try:
        cart, created = Cart.objects.get_or_create(user=request.user)
        if not cart.items.exists():
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
        
        address_id = request.data.get('address_id')
        payment_method = request.data.get('payment_method', 'cod')
        
        if not address_id:
            return Response({'error': 'Address required'}, status=status.HTTP_400_BAD_REQUEST)
        
        address = request.user.addresses.get(id=address_id)
        
        # Calculate totals (matching CartItem.get_total_price logic)
        subtotal = sum(item.get_total_price() for item in cart.items.all())
        # Apply same discount logic as frontend if needed, but for now just match basic calc
        shipping_charge = Decimal('0') if subtotal >= 1000 else Decimal('100')
        tax = round(subtotal * Decimal('0.05'), 2) # Sync with frontend 5%
        total = subtotal + shipping_charge + tax
        
        # Create order
        order = Order.objects.create(
            user=request.user,
            shipping_address=address,
            shipping_name=address.name,
            shipping_phone=address.phone,
            shipping_email=request.user.email,
            subtotal=subtotal,
            shipping_charge=shipping_charge,
            tax=tax,
            total=total,
            payment_method=payment_method,
            status='pending'  # Both COD and Card start as pending
        )
        
        # Add items to order
        for cart_item in cart.items.all():
            # Calculate actual unit price including adjustments
            unit_price = cart_item.get_total_price() / cart_item.quantity
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                variant=cart_item.variant,
                color_variant=cart_item.color_variant,
                size=cart_item.size,
                quantity=cart_item.quantity,
                price=unit_price,
                total=cart_item.get_total_price()
            )
        
        # Add tracking
        OrderTracking.objects.create(
            order=order,
            status='order_placed',
            description='Your order has been placed successfully'
        )
        
        # Clear cart
        cart.items.all().delete()
        
        serializer = OrderDetailSerializer(order)
        return Response({
            'message': 'Order created successfully',
            'order': serializer.data
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def track_order(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
        if order.user != request.user and not request.user.is_staff:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        tracking = order.tracking.all().order_by('-created_at')
        from .serializers import OrderTrackingSerializer
        serializer = OrderTrackingSerializer(tracking, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_order(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
        if order.user != request.user and not request.user.is_staff:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        if order.status in ['cancelled', 'delivered', 'shipped']:
            return Response({'error': 'Cannot cancel this order'}, status=status.HTTP_400_BAD_REQUEST)
        
        order.status = 'cancelled'
        order.save()
        
        OrderTracking.objects.create(
            order=order,
            status='cancelled',
            description='Order has been cancelled'
        )
        
        serializer = OrderDetailSerializer(order)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)