from rest_framework import serializers

from .models import Suggestion, KNUser, ThemeSuggestion, Favorite


class SuggestionSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Suggestion
        fields = '__all__'


class SuggestionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Suggestion
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = KNUser
        fields = 'id', 'username', 'first_name', 'last_name', 'email', 'birthday', 'middle_name', 'bio', 'gender', 'avatar'


class ThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = KNUser
        fields = 'id', 'username', 'first_name', 'last_name', 'email', 'birthday', 'middle_name', 'bio', 'gender', 'avatar'


class ThemeSuggestionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ThemeSuggestion
        fields = '__all__'


class FavoriteSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    class Meta:
        model = Favorite
        fields = '__all__'


class FavoriteListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = '__all__'