# admin_panel/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Sum, Count, Avg, F
from django.db.models.functions import TruncMonth, TruncDate
from django.utils import timezone
from datetime import timedelta
from orders.models import Order
from products.models import Product, Category
from users.models import CustomUser
from payments.models import Payment
from .serializers import AdminLoginSerializer, DashboardStatsSerializer, SalesReportSerializer

@api_view(['POST'])
@permission_classes([])
def admin_login(request):
    """
    Admin-specific login via /auth/admin-login/
    Only allows users with role='admin' or is_staff=True
    """
    serializer = AdminLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': 'admin' if user.is_staff else 'user',
                'profile_image': user.profile_image.url if user.profile_image else None,
            }
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def dashboard_stats(request):
    """Get comprehensive dashboard statistics with inventory and analytics data"""
    try:
        today = timezone.now().date()
        
        # Basic stats
        total_users = CustomUser.objects.count()
        total_products = Product.objects.count()
        total_orders = Order.objects.count()
        total_revenue = Order.objects.aggregate(Sum('total'))['total__sum'] or 0
        
        today_orders = Order.objects.filter(created_at__date=today).count()
        today_revenue = Order.objects.filter(created_at__date=today).aggregate(Sum('total'))['total__sum'] or 0
        
        pending_orders = Order.objects.filter(status='pending').count()
        avg_order_value = Order.objects.aggregate(Avg('total'))['total__avg'] or 0
        
        # Inventory stats
        total_stock = Product.objects.aggregate(Sum('total_stock'))['total_stock__sum'] or 0
        out_of_stock = Product.objects.filter(total_stock__lte=0).count()
        low_stock = Product.objects.filter(total_stock__gt=0, total_stock__lte=10).count()
        
        # Calculate sold units from completed orders (approximate)
        completed_orders = Order.objects.filter(status__in=['completed', 'delivered']).count()
        
        # Inventory percentages for pie chart
        in_stock_count = total_products - out_of_stock
        sold_percentage = min(int((completed_orders / max(total_products, 1)) * 100), 100) if total_products > 0 else 0
        
        # Top selling products by order count
        top_products = []
        try:
            from orders.models import OrderItem
            top_products_qs = OrderItem.objects.values('product__name').annotate(
                sales=Count('id'),
                revenue=Sum(F('price') * F('quantity'))
            ).order_by('-sales')[:10]
            top_products = list(top_products_qs)
        except Exception:
            # Fallback if OrderItem doesn't exist
            top_products = []
        
        # Top categories by product count
        top_categories = list(Category.objects.annotate(
            product_count=Count('products')
        ).values('name', 'product_count').order_by('-product_count')[:10])
        
        # Monthly revenue for last 6 months
        six_months_ago = today - timedelta(days=180)
        monthly_revenue = list(Order.objects.filter(
            created_at__date__gte=six_months_ago
        ).annotate(
            month=TruncMonth('created_at')
        ).values('month').annotate(
            revenue=Sum('total'),
            orders=Count('id')
        ).order_by('month'))
        
        # Convert datetime to string for JSON
        for item in monthly_revenue:
            if item.get('month'):
                item['month'] = item['month'].strftime('%b')
                item['revenue'] = float(item.get('revenue') or 0)
        
        stats = {
            # Basic stats
            'total_users': total_users,
            'total_products': total_products,
            'total_orders': total_orders,
            'total_revenue': float(total_revenue),
            'today_orders': today_orders,
            'today_revenue': float(today_revenue),
            'pending_orders': pending_orders,
            'avg_order_value': float(avg_order_value),
            
            # Inventory stats
            'total_stock': total_stock,
            'out_of_stock': out_of_stock,
            'low_stock': low_stock,
            'in_stock_count': in_stock_count,
            'sold_percentage': sold_percentage,
            'available_percentage': 100 - sold_percentage,
            
            # Analytics data
            'top_products': top_products,
            'top_categories': top_categories,
            'monthly_revenue': monthly_revenue,
        }
        
        return Response(stats)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def sales_report(request):
    """Get sales report for specified period"""
    try:
        period = request.query_params.get('period', 'monthly')  # daily, weekly, monthly
        days = 30 if period == 'monthly' else (7 if period == 'weekly' else 1)
        
        start_date = timezone.now().date() - timedelta(days=days)
        
        orders = Order.objects.filter(
            created_at__date__gte=start_date
        ).annotate(
            date=TruncDate('created_at')
        ).values('date').annotate(
            sales=Sum('total'),
            count=Count('id')
        ).order_by('date')
        
        # Convert dates to strings
        result = []
        for order in orders:
            result.append({
                'date': order['date'].strftime('%Y-%m-%d') if order['date'] else '',
                'sales': float(order['sales'] or 0),
                'count': order['count']
            })
        
        return Response(result)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_check(request):
    """Check if user is admin"""
    return Response({
        'is_admin': request.user.is_staff,
        'user': {
            'id': request.user.id,
            'email': request.user.email,
            'first_name': request.user.first_name,
        }
    })
