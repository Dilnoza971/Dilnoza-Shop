from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer

class MyTokenObtainPairView(TokenObtainPairView):
    """
    Moslashtirilgan serialayzerdan foydalanadigan login view'i.
    """
    serializer_class = MyTokenObtainPairSerializer