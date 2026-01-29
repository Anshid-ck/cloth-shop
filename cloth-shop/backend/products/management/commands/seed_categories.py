# products/management/commands/seed_categories.py
from django.core.management.base import BaseCommand
from products.models import Category

class Command(BaseCommand):
    help = 'Seed initial categories for the cloth shop'

    def handle(self, *args, **options):
        categories = [
            {
                'name': 'Hoodies',
                'slug': 'hoodies',
                'category_type': 'hoodies',
                'description': 'Comfortable and stylish hoodies for all seasons',
            },
            {
                'name': 'T-Shirts',
                'slug': 'tshirts',
                'category_type': 'tshirts',
                'description': 'Premium quality t-shirts in various styles',
            },
            {
                'name': 'Jeans',
                'slug': 'jeans',
                'category_type': 'bottomwear',
                'description': 'Classic and modern jeans for everyday wear',
            },
            {
                'name': 'Pants',
                'slug': 'pants',
                'category_type': 'bottomwear',
                'description': 'Formal and casual pants collection',
            },
            {
                'name': 'Shoes',
                'slug': 'shoes',
                'category_type': 'shoes',
                'description': 'Footwear for every occasion',
            },
            {
                'name': 'Accessories',
                'slug': 'accessories',
                'category_type': 'accessories',
                'description': 'Belts, caps, and more to complete your look',
            },
        ]

        created_count = 0
        for cat_data in categories:
            category, created = Category.objects.get_or_create(
                slug=cat_data['slug'],
                defaults=cat_data
            )
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f'Created category: {category.name}'))
            else:
                self.stdout.write(self.style.WARNING(f'Category already exists: {category.name}'))

        self.stdout.write(self.style.SUCCESS(f'\nDone! Created {created_count} new categories.'))
