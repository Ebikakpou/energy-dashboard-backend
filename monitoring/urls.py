from django.urls import path
from .views import EnergyDataList

urlpatterns = [
    path('energy/', EnergyDataList.as_view(), name='energy-data'),
]
