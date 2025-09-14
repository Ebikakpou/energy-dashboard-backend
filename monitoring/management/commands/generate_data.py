from django.core.management.base import BaseCommand
from monitoring.models import EnergyData
import random, time

class Command(BaseCommand):
    help = "Continuously generate simulated energy data"

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING("Starting continuous data generation... (Ctrl+C to stop)"))
        while True:
            solar_output = round(random.uniform(5.0, 50.0), 2)
            battery_level = round(random.uniform(20.0, 100.0), 2)
            diesel_usage = round(random.uniform(0.0, 5.0), 2)

            entry = EnergyData.objects.create(
                solar_output=solar_output,
                battery_level=battery_level,
                diesel_usage=diesel_usage
            )

            self.stdout.write(self.style.SUCCESS(f"Generated: {entry}"))
            time.sleep(5)  # wait 5 seconds before next reading
