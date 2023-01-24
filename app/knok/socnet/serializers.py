from requests import Response
from rest_framework import serializers, status
from rest_framework.serializers import raise_errors_on_nested_writes
from rest_framework.utils import model_meta
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Suggestion, KNUser, ThemeSuggestion, Favorite, Photo, InfoUser, InfoTitle, Price, InfoValue, \
    PriceObject, TransferKnok, WalletKnok, Storage, HistoryTransfer, TransferBetweenPeople, Adversting, Dialog, \
    MessageText, BlackList


class SuggestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Suggestion
        fields = '__all__'


class SuggestionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Suggestion
        fields = '__all__'
        depth = 1


class AddAvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = KNUser
        fields = 'avatar', 'username'


class UserSerializer1(serializers.ModelSerializer):
    class Meta:
        model = KNUser
        fields = 'username', 'first_name', 'last_name', 'email', 'birthday', 'middle_name', 'bio', 'gender', 'city'


class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = KNUser
        fields = 'phone', 'email', 'password', 'username'
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = KNUser(
            phone=validated_data['phone'],
            username='',
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class CharacteristicSerializer(serializers.ModelSerializer):
    class Meta:
        model = InfoUser
        fields = '__all__'


class BlackListSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlackList
        fields = '__all__'


class BlackListForListSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlackList
        fields = '__all__'
        depth=1


class CharacteristicTitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = InfoTitle
        fields = '__all__'


class CharacteristicValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = InfoValue
        fields = '__all__'


class PhotoListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = '__all__'


class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = '__all__'


class PriceListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Price
        fields = '__all__'


class PriceObjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = PriceObject
        fields = '__all__'


class PriceSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Price
        fields = '__all__'


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


class FavoriteUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = '__all__'


class CharacteristicsUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = InfoUser
        fields = '__all__'


class WalletSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = WalletKnok
        fields = '__all__'


class WalletUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = WalletKnok
        fields = '__all__'


class TransferSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransferKnok
        fields = '__all__'


class StorageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Storage
        fields = '__all__'


class HistoryTransferSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoryTransfer
        fields = '__all__'


class TransferBetweenPeopleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransferBetweenPeople
        fields = '__all__'


class AdverstingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Adversting
        fields = '__all__'


class DialogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dialog
        fields = '__all__'


class FavoriteListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = '__all__'
        depth = 1


class FavoriteListForCount(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = '__all__'


class MessageTextSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageText
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = KNUser
        fields = (
            'phone', 'id', 'username', 'first_name', 'last_name', 'email', 'birthday', 'middle_name', 'bio', 'gender',
            'avatar', 'city', 'country')

    def get_token(self, user):
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
            instance.save()
            return instance
