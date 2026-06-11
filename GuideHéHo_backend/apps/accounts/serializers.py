from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password

from .models import User


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User

        fields = [
            "id",
            "first_name",
            "last_name",
            "role",
            "profile_picture",
        ]

        read_only_fields = ["id"]


class RegisterSerializer(serializers.ModelSerializer):

    # Vérifie qu'aucun autre user n'utilise déjà cet email
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all())]
    )

    # Password invisible dans les réponses + validation Django
    password = serializers.CharField(
        write_only=True,
        validators=[validate_password]
    )

    class Meta:
        model = User

        fields = [
            "email",
            "first_name",
            "last_name",
            "password",
        ]

    def create(self, validated_data):

        # Création user avec rôle par défaut traveler
        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            role="traveler",
        )
        return user



class UserUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            "email",
            "first_name",
            "last_name",
        ]

class LoginSerializer(serializers.Serializer):

    email = serializers.EmailField()

    password = serializers.CharField(write_only=True)


class PasswordChangeSerializer(serializers.Serializer):

    old_password = serializers.CharField(write_only=True)

    new_password = serializers.CharField(
        write_only=True,
        validators=[validate_password]
    )

    new_password2 = serializers.CharField(write_only=True)

    def validate(self, attrs):

        # Vérifie que les 2 passwords sont identiques
        if attrs["new_password"] != attrs["new_password2"]:

            raise serializers.ValidationError({
                "new_password2": "The two password fields didn't match."
            })

        return attrs


class PasswordResetRequestSerializer(serializers.Serializer):

    # Utilisé pour demander un reset password
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):

    # Infos reçues dans le lien email
    uid = serializers.CharField()

    token = serializers.CharField()

    # Nouveau password
    new_password = serializers.CharField(
        write_only=True,
        validators=[validate_password]
    )

    new_password2 = serializers.CharField(write_only=True)

    def validate(self, attrs):

        # Vérifie que les 2 nouveaux passwords correspondent
        if attrs["new_password"] != attrs["new_password2"]:

            raise serializers.ValidationError({
                "new_password2": "The two password fields didn't match."
            })

        return attrs