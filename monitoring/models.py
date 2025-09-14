from django.db import models

class EnergyData(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    solar_output = models.FloatField()   # in kW
    battery_level = models.FloatField()  # %
    diesel_usage = models.FloatField()   # liters/hour

    def __str__(self):
        return f"{self.timestamp} - Solar: {self.solar_output} kW"
