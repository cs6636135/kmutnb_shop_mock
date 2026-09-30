from django.core.management.base import BaseCommand
from django.utils import timezone
from shop_api.models import Reservation, ProductLocation

class Command(BaseCommand):
    help = 'Check for expired reservations (exceeding 4 hours) and refund stock to ProductLocation.'

    def handle(self, *args, **options):
        now = timezone.now()
        expired_reservations = Reservation.objects.filter(status='reserved', expires_at__lt=now)
        count = 0

        for res in expired_reservations:
            res.status = 'expired'
            res.save()

            # Return stock
            try:
                pl = ProductLocation.objects.get(product=res.product, location=res.location)
                pl.stock += res.quantity
                pl.save()
            except ProductLocation.DoesNotExist:
                pass
            
            count += 1
            self.stdout.write(self.style.SUCCESS(f"Reservation {res.reservation_code} marked EXPIRED. Refunded {res.quantity} stock."))

        self.stdout.write(self.style.SUCCESS(f"Successfully processed {count} expired reservations."))
