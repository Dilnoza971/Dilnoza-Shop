from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """Foydalanuvchi ma'lumotlarini ko'rsatish uchun serialayzer"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email'] # 'username'ni ham qo'shdim

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Login javobiga qo'shimcha foydalanuvchi ma'lumotlarini qo'shish uchun
    TokenObtainPairSerializer'ni moslashtirish.
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

      
        token['username'] = user.username
        token['email'] = user.email

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

      
        serializer = UserSerializer(self.user).data
        for k, v in serializer.items():
            data[k] = v

        return data