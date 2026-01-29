"""
Script to update admin email and password
Run this script with: python manage.py shell < update_admin.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import CustomUser

# Find the admin user (superuser)
try:
    admin = CustomUser.objects.filter(is_superuser=True).first()
    if admin:
        old_email = admin.email
        admin.email = 'admin1251@gmail.com'
        admin.set_password('adminclothwebsite')
        admin.save()
        print(f"✅ Admin credentials updated successfully!")
        print(f"   Old email: {old_email}")
        print(f"   New email: admin1251@gmail.com")
        print(f"   New password: adminclothwebsite")
    else:
        # Create new superuser if none exists
        admin = CustomUser.objects.create_superuser(
            email='admin1251@gmail.com',
            password='adminclothwebsite',
            first_name='Admin',
            last_name='User'
        )
        print(f"✅ New admin user created!")
        print(f"   Email: admin1251@gmail.com")
        print(f"   Password: adminclothwebsite")
except Exception as e:
    print(f"❌ Error: {e}")
