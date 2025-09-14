from django.shortcuts import render

from rest_framework import generics
from .models import EnergyData
from .serializers import EnergyDataSerializer

class EnergyDataList(generics.ListCreateAPIView):
    queryset = EnergyData.objects.all().order_by('-timestamp')[:50]
    serializer_class = EnergyDataSerializer

