from rest_framework import serializers
from .models import User



class UserSerializer(serializers.ModelSerializer):

    class Meta:
        # Expose the user profile fields returned by the list endpoint.
        model = User
        fields = [
            'id',
            'first_name',
            'last_name',
            'role',
            'profile_picture',
        ]


class RegisterSerializer(serializers.ModelSerializer):

    # Keep the password out of normal representation while still accepting it on input.
    password = serializers.CharField(write_only=True)

    class Meta:
        # Fields accepted by the registration endpoint.
        model = User

        fields = [
            'email',
            'first_name',
            'last_name',
            'password',
            'role',
        ]

    def create(self, validated_data):

        # Delegate password hashing and user creation to the custom manager.
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            role=validated_data.get('role', 'traveler'),
        )

        return user

