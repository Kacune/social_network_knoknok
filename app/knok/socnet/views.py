import datetime
import json
import os
from datetime import date, datetime
from time import time

import requests
from django.http import request, JsonResponse
from django.shortcuts import render, redirect
from rest_framework.decorators import api_view, action, permission_classes
from rest_framework.exceptions import ValidationError
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import ListModelMixin, CreateModelMixin
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics, status, permissions, serializers, viewsets

from .serializers import SuggestionSerializer, SuggestionListSerializer, UserSerializer, ThemeSuggestionListSerializer, \
    FavoriteSerializer, FavoriteListSerializer, UserCreateSerializer, PhotoListSerializer, FavoriteUpdateSerializer, \
    CharacteristicSerializer, CharacteristicTitleSerializer, PriceListSerializer, PriceSerializer, PhotoSerializer, \
    CharacteristicsUpdateSerializer, CharacteristicValueSerializer, PriceObjectSerializer, TransferSerializer, \
    WalletSerializer, WalletUpdateSerializer, StorageSerializer, HistoryTransferSerializer, \
    TransferBetweenPeopleSerializer, AdverstingSerializer, DialogSerializer, MessageTextSerializer, UserSerializer1, \
    AddAvatarSerializer, FavoriteListForCount, BlackListSerializer, BlackListForListSerializer
from .utils import DataMixin
from .forms import ImageForm
from django.http import HttpResponseRedirect
from django.views.generic.edit import FormView
from django.views import View
from django.views.generic import ListView, DetailView
from socnet.models import Suggestion, Price, Photo, Dialog, InfoUser, Favorite, KNUser, ThemeSuggestion, InfoTitle, \
    InfoValue, PriceObject, WalletKnok, TransferKnok, Storage, HistoryTransfer, Adversting, MessageText, BlackList
from .forms import ImageForm


class MyPage(DataMixin, ListView):
    model = KNUser
    template_name = 'social_network/mypage.html'

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        photos = Photo.objects.filter(user_id=self.request.user.pk)
        count_photo_all = photos.count()
        count_photo_paid = photos.filter(paid=1).count()
        count_photo_free = photos.filter(paid=0).count()
        characteristics = InfoUser.objects.filter(user_id=self.request.user.pk)
        c_def = self.get_user_context(title='Моя страница',
                                      mypage='active_page',
                                      photos=photos,
                                      count_photo_all=count_photo_all,
                                      count_photo_paid=count_photo_paid,
                                      count_photo_free=count_photo_free,
                                      characteristics=characteristics,
                                      # age=age
                                      )
        return dict(list(context.items()) + list(c_def.items()))


class Main(DataMixin, ListView):
    model = KNUser
    template_name = 'social_network/main_page.html'

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        c_def = self.get_user_context(title='Моя страница')
        return dict(list(context.items()) + list(c_def.items()))


class Page(DataMixin, DetailView):
    model = KNUser
    template_name = 'social_network/page.html'

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        c_def = self.get_user_context(title='Пользователь')
        return dict(list(context.items()) + list(c_def.items()))


class Messages(DataMixin, ListView):
    model = KNUser
    template_name = 'social_network/messages.html'

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        c_def = self.get_user_context(title='Мои сообщения',
                                      messages='active_page')
        return dict(list(context.items()) + list(c_def.items()))


class AddAdvirsting(DataMixin, ListView):
    model = KNUser
    template_name = 'social_network/add_advirsting.html'

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        c_def = self.get_user_context(title='Добавить рекламу',
                                      add_advirsting='active_page')
        return dict(list(context.items()) + list(c_def.items()))


class Setting(DataMixin, ListView):
    model = Suggestion
    template_name = 'social_network/setting.html'
    queryset = Suggestion.objects.all()
    context_object_name = 'suggestions'

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        c_def = self.get_user_context(title='Мои настройки',
                                      setting='active_page')
        return dict(list(context.items()) + list(c_def.items()))


class News(DataMixin, ListView):
    model = KNUser
    template_name = 'social_network/news.html'

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        c_def = self.get_user_context(title='Новости сайта',
                                      news='active_page')
        return dict(list(context.items()) + list(c_def.items()))


class UpdateAvatar(generics.UpdateAPIView):
    queryset = KNUser.objects.all()
    serializer_class = AddAvatarSerializer
    parser_classes = (JSONParser, FormParser, MultiPartParser)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance=instance, data={'avatar': request.data.get("avatar"), 'username': instance.username})

        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)


class Finance(DataMixin, ListView):
    model = KNUser
    template_name = 'social_network/finance.html'

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        c_def = self.get_user_context(title='Мои финансы',
                                      finance='active_page')
        return dict(list(context.items()) + list(c_def.items()))


class SuggestionsPage(DataMixin, ListView):
    model = KNUser
    template_name = 'social_network/suggestions_page.html'

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        suggestions = Suggestion.objects.exclude(pk=self.request.user.pk)
        c_def = self.get_user_context(title='Предложения',
                                      suggestions_page='active_page',
                                      suggestions_list=suggestions,
                                      suggestions_count=suggestions.count())
        return dict(list(context.items()) + list(c_def.items()))


class MySuggestionsPage(DataMixin, ListView):
    model = KNUser
    template_name = 'social_network/my_suggestions.html'

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        suggestions = Suggestion.objects.filter(pk=self.request.user.pk)
        c_def = self.get_user_context(title='Мои предложения',
                                      my_suggestions=suggestions)
        return dict(list(context.items()) + list(c_def.items()))


class Favorites(DataMixin, ListView):
    model = KNUser
    template_name = 'social_network/favorites.html'

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        c_def = self.get_user_context(title='Избранное',
                                      favorites='active_button')
        return dict(list(context.items()) + list(c_def.items()))


class WhoCame(DataMixin, ListView):
    model = KNUser
    template_name = 'social_network/who_came.html'

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        context['title'] = 'Кто заходил'
        context['who_came'] = 'active_button'
        c_def = self.get_user_context(title='Кто заходил',
                                      who_came='active_button')
        return dict(list(context.items()) + list(c_def.items()))


class PriceList(DataMixin, ListView):
    model = KNUser
    template_name = 'social_network/price_list.html'

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        c_def = self.get_user_context(title='Мои подарки',
                                      price_list='active_button',
                                      prices=Price.objects.filter(user_id=self.request.user.pk))
        return dict(list(context.items()) + list(c_def.items()))


class Search(DataMixin, ListView):
    model = KNUser
    template_name = 'social_network/search.html'

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        context['title'] = 'Поиск людей'
        context['search'] = 'active_page'
        c_def = self.get_user_context(title='Поиск людей',
                                      search='active_button')
        return dict(list(context.items()) + list(c_def.items()))


class AddPhoto(DataMixin, ListView):
    model = KNUser
    template_name = 'social_network/add_photo.html'

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        photos = Photo.objects.filter(user_id=self.request.user.id)
        c_def = self.get_user_context(title='Добавление фото',
                                      photos=photos,
                                      count_photo_all=photos.count(),
                                      count_photo_paid=photos.filter(paid=1).count(),
                                      count_photo_free=photos.filter(paid=0).count())
        return dict(list(context.items()) + list(c_def.items()))


class Map(DataMixin, ListView):
    model = KNUser
    template_name = 'social_network/map.html'

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        photos = Photo.objects.filter(user_id=self.request.user.id)
        c_def = self.get_user_context(title='Карта')
        return dict(list(context.items()) + list(c_def.items()))


class Correct(DataMixin, ListView):
    model = KNUser
    template_name = 'social_network/correct_anketa.html'

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        c_def = self.get_user_context(title='Редактировать анкету')
        return dict(list(context.items()) + list(c_def.items()))


class SuggestionViewAPI(generics.CreateAPIView):
    serializer_class = SuggestionSerializer


class SuggestionListViewAPI(generics.ListAPIView):
    serializer_class = SuggestionListSerializer
    queryset = Suggestion.objects.all()


class PhotoListViewAPI(generics.ListAPIView):
    serializer_class = PhotoListSerializer

    def get_queryset(self):
        """
        Optionally restricts the returned purchases to a given user,
        by filtering against a `username` query parameter in the URL.
        """
        user = self.request.query_params.get('user')
        if user is not None:
            queryset = Photo.objects.filter(user=user)
        return queryset


class PhotoAPI(viewsets.ModelViewSet):
    serializer_class = PhotoSerializer
    parser_classes = (JSONParser, FormParser, MultiPartParser)


    @action(detail=False, methods=['post'])
    def post(self, request):
        print(request.data)
        serializer = PhotoSerializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            except ValidationError as e:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserListViewAPI(generics.ListAPIView):
    serializer_class = UserSerializer
    queryset = KNUser.objects.all()
    permission_classes = [permissions.IsAuthenticated]


class CharacteristicsList(generics.ListAPIView):
    serializer_class = CharacteristicSerializer
    queryset = InfoUser.objects.all()
    permission_classes = [permissions.IsAuthenticated]


class CharacteristicsTitleList(generics.ListAPIView):
    serializer_class = CharacteristicTitleSerializer
    queryset = InfoTitle.objects.all()


class CharacteristicsValueList(generics.ListAPIView):
    serializer_class = CharacteristicValueSerializer
    queryset = InfoValue.objects.all()


class PriceListAPI(generics.ListAPIView):
    serializer_class = PriceListSerializer
    queryset = Price.objects.all()


class MessagesListAPI(generics.ListAPIView):
    serializer_class = MessageTextSerializer
    queryset = MessageText.objects.all()


class UserCreateAPI(generics.CreateAPIView):
    serializer_class = UserCreateSerializer


class PriceAPI(generics.CreateAPIView):
    serializer_class = PriceSerializer


class DialogAPI(generics.CreateAPIView):
    serializer_class = DialogSerializer


class MessageTextAPI(generics.CreateAPIView):
    serializer_class = MessageTextSerializer


class PriceObjectAPI(generics.ListAPIView):
    serializer_class = PriceObjectSerializer
    queryset = PriceObject.objects.all()


class ThemeSuggestionListViewAPI(generics.ListAPIView):
    serializer_class = ThemeSuggestionListSerializer
    queryset = ThemeSuggestion.objects.all()


class BlacklistListViewAPI(generics.ListAPIView):
    serializer_class = BlackListForListSerializer

    def get_queryset(self):
        """
        Optionally restricts the returned purchases to a given user,
        by filtering against a `username` query parameter in the URL.
        """
        user = self.request.query_params.get('user')
        if user is not None:
            queryset = BlackList.objects.filter(user=user)
        return queryset
    
    
class BlacklistIsExictViewAPI(generics.ListAPIView):
    serializer_class = BlackListForListSerializer
    queryset = BlackList.objects.all()


class HistoryTransferListAPI(generics.ListAPIView):
    serializer_class = HistoryTransferSerializer
    queryset = HistoryTransfer.objects.all()


class AdverstingListAPI(generics.ListAPIView):
    serializer_class = AdverstingSerializer
    queryset = Adversting.objects.all()


class DialogListAPI(generics.ListAPIView):
    serializer_class = DialogSerializer
    queryset = Dialog.objects.all()


class FavoriteViewAPI(generics.CreateAPIView):
    serializer_class = FavoriteSerializer


class HistoryTransferAPI(generics.CreateAPIView):
    serializer_class = HistoryTransferSerializer


class TransferBetweenPeopleAPI(generics.CreateAPIView):
    serializer_class = TransferBetweenPeopleSerializer


class BlackListAPI(generics.CreateAPIView):
    serializer_class = BlackListSerializer


class WalletListAPI(generics.ListAPIView):
    serializer_class = WalletSerializer
    queryset = WalletKnok.objects.all()


class InfoUsersAPI(generics.ListAPIView):
    serializer_class = CharacteristicSerializer
    queryset = InfoUser.objects.all()

class TransferAPI(generics.CreateAPIView):
    serializer_class = TransferSerializer


class WalletCreateAPI(generics.CreateAPIView):
    serializer_class = WalletSerializer


class InfoUserCreate(generics.CreateAPIView):
    serializer_class = CharacteristicSerializer


class AdverstingAPI(viewsets.ModelViewSet):
    serializer_class = AdverstingSerializer
    parser_classes = (JSONParser, FormParser, MultiPartParser)

    @action(detail=False, methods=['post'])
    def post(self, request):
        print(request.data)
        serializer = AdverstingSerializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            except ValidationError as e:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def adverstingSelf(request, pk):
    addversting = Adversting.objects.get(pk=pk)
    serializer = AdverstingSerializer(instance=addversting)
    return Response(serializer.data)


class MessageGet(generics.ListAPIView):
    serializer_class = MessageTextSerializer

    def get_queryset(self):
        """
        Optionally restricts the returned purchases to a given user,
        by filtering against a `username` query parameter in the URL.
        """
        queryset = MessageText.objects.all()
        roomId = self.request.query_params.get('roomId')
        if roomId is not None:
            queryset = queryset.filter(roomId=roomId)
        return queryset


#I am is favorite user
class FavoriteUserIGet(generics.ListAPIView):
    serializer_class = FavoriteListForCount

    def get_queryset(self):
        """
        Optionally restricts the returned purchases to a given user,
        by filtering against a `username` query parameter in the URL.
        """
        favorite_user = self.request.query_params.get('favorite_user')
        if favorite_user is not None:
            queryset = Favorite.objects.filter(favorite_user=favorite_user)
        return queryset


class FavoriteUserGet(generics.ListAPIView):
    serializer_class = FavoriteListForCount

    def get_queryset(self):
        """
        Optionally restricts the returned purchases to a given user,
        by filtering against a `username` query parameter in the URL.
        """
        user = self.request.query_params.get('user')
        if user is not None:
            queryset = Favorite.objects.filter(user=user)
        return queryset


@api_view(['GET'])
def get_messsages(request, roomId):
    print(roomId)
    queryset = MessageText.objects.filter(roomId=roomId)
    print(queryset)
    return JsonResponse(queryset)


@api_view(['GET'])
def get_favorite_favorite_user_i(request, favorite_user):
    queryset = Favorite.objects.filter(favorite_user=favorite_user)
    print(favorite_user)
    if (queryset.count() > 0):
        return JsonResponse(queryset)
    else:
        return JsonResponse({'error': 'Возникла ошибка при поиске избранных'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_favorite_user_i(request, user):
    queryset = Favorite.objects.filter(user=user)
    if (queryset.count() > 0):
        return JsonResponse(queryset)
    else:
        return JsonResponse({'error': 'Возникла ошибка при поиске избранных'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def suggestionSelf(request, pk):
    suggest = Suggestion.objects.get(pk=pk)
    serializer = SuggestionListSerializer(instance=suggest)
    return Response(serializer.data)


@api_view(['GET'])
def walletSelf(request, pk):
    wallet = WalletKnok.objects.get(user=pk)
    serializer = WalletSerializer(instance=wallet)
    return Response(serializer.data)


@api_view(['GET'])
def dialogSelf(request, pk):
    dialog = Dialog.objects.get(pk=pk)
    serializer = DialogSerializer(instance=dialog)
    return Response(serializer.data)


@api_view(['GET'])
def blacklistSelf(request, pk):
    blacklist = BlackList.objects.get(pk=pk)
    serializer = BlackListSerializer(instance=blacklist)
    return Response(serializer.data)


@api_view(['GET'])
def priceSelf(request, pk):
    price = Price.objects.get(pk=pk)
    serializer = PriceListSerializer(instance=price)
    return Response(serializer.data)


@api_view(['GET'])
def userSelf(request, pk):
    user = KNUser.objects.get(pk=pk)
    serializer = UserSerializer(instance=user)
    return Response(serializer.data)


@api_view(['GET'])
def historyTransferSelf(request, pk):
    history = HistoryTransfer.objects.get(pk=pk)
    serializer = HistoryTransferSerializer(instance=history)
    return Response(serializer.data)


@api_view(['GET'])
def storageSelf(request, pk):
    storage = Storage.objects.get(pk=pk)
    serializer = StorageSerializer(instance=storage)
    return Response(serializer.data)


@api_view(['GET'])
def priceObjectOne(request, pk):
    price_obj = PriceObject.objects.get(id=pk)
    serializer = PriceObjectSerializer(instance=price_obj)
    return Response(serializer.data)


@api_view(['GET'])
def characteristicsSelf(request, pk):
    info = InfoUser.objects.get(user=pk)
    serializer = CharacteristicSerializer(instance=info)
    return Response(serializer.data)


@api_view(['POST'])
def adverstingUpdate(request, pk):
    addversting = Adversting.objects.get(pk=pk)
    serializer = AdverstingSerializer(instance=addversting)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)


@api_view(['POST'])
def favoriteUpdate(request, pk):
    favorite = Favorite.objects.get(id=pk)
    serializer = FavoriteUpdateSerializer(instance=favorite, data=request.data)
    print(serializer.is_valid())
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)


@api_view(['POST'])
def userUpdate(request, pk):
    user = KNUser.objects.get(id=pk)
    serializer = UserSerializer1(instance=user, data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.is_valid())



@api_view(['POST'])
def characteristicsUpdate(request, pk):
    info = InfoUser.objects.get(user=pk)
    serializer = CharacteristicsUpdateSerializer(instance=info, data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)


@api_view(['POST'])
def storageUpdate(request, pk):
    storage = Storage.objects.get(pk=pk)
    serializer = StorageSerializer(instance=storage, data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)


@api_view(['POST'])
def historyTransferUpdate(request, pk):
    history = HistoryTransfer.objects.get(id=pk)
    serializer = HistoryTransferSerializer(instance=history, data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)


@api_view(['POST'])
def suggestionDelete(request, pk):
    suggest = Suggestion.objects.get(pk=pk)
    if suggest:
        suggest.delete()
        return JsonResponse({"status": "ok"}, status=status.HTTP_200_OK)
    return JsonResponse(serializers.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def black_listDelete(request, pk):
    black_list = BlackList.objects.get(pk=pk)
    if black_list:
        black_list.delete()
        return JsonResponse({"status": "ok"}, status=status.HTTP_200_OK)
    return JsonResponse(serializers.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def suggestionUpdate(request, pk):
    suggest = Suggestion.objects.get(pk=pk)
    serializer = SuggestionSerializer(instance=suggest, data=request.data)
    print(serializer.is_valid())
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)


@api_view(['POST'])
def favoriteDelete(request, pk):
    favorite = Favorite.objects.get(pk=pk)
    if favorite:
        favorite.delete()
        return JsonResponse({"status": "ok"}, status=status.HTTP_200_OK)
    return JsonResponse(serializers.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def dialogDelete(request, pk):
    dialog = Dialog.objects.get(pk=pk)
    if dialog:
        dialog.delete()
        return JsonResponse({"status": "ok"}, status=status.HTTP_200_OK)
    return JsonResponse(serializers.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def walletUpdate(request, pk):
    wallet = WalletKnok.objects.get(user=pk)
    serializer = WalletUpdateSerializer(instance=wallet, data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)


@api_view(['POST'])
def priceUpdate(request, pk):
    price = Price.objects.get(pk=pk)
    serializer = PriceListSerializer(instance=price, data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def navbar_data(request, pk):
    suggestions = Suggestion.objects.all()
    my_suggestons_count = suggestions.filter(pk=pk, duration__gte=datetime.datetime.now()).count()
    suggestons_count = suggestions.filter(duration__gte=datetime.datetime.now()).count()
    favaorite_count_i = Favorite.objects.filter(favorite_user=pk).count()
    favaorite_count_he = Favorite.objects.filter(user=pk).count()
    favorite_count = favaorite_count_i + favaorite_count_he
    price_count = Price.objects.filter(who=pk, isActive=True).count()
    themes = ThemeSuggestion.objects.all()
    wallet_sum = WalletKnok.objects.get(user=pk).money
    return Response({'my_suggestons_count': my_suggestons_count, 'suggestons_count': suggestons_count, 'favorite_count': favorite_count, 'price_count': price_count, 'themes': themes, 'wallet_sum': wallet_sum})



class FavoriteListViewAPI(generics.ListAPIView):
    serializer_class = FavoriteListSerializer
    queryset = Favorite.objects.all()


class UserActivationView(APIView):
    permission_classes = [permissions.AllowAny]

    def get (self, request, uid, token):
        post_url = os.getenv('HOST') + '/auth/users/activation/'
        print(post_url)
        r = requests.post(os.getenv('HOST') + '/auth/users/activation/', data={'uid': uid, 'token': token})
        content = r.text
        return Response(content)


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def request_user_activation(request, uid, token):
    """
    Intermediate view to activate a user's email.
    """
    post_url = os.getenv('HOST')+'/auth/users/activation/'
    r = requests.post(os.getenv('HOST')+'/auth/users/activation/', headers={'Content-Type': 'application/json'}, data=json.dumps({'uid': uid, 'token': token}))
    if r.status_code > 199 and r.status_code < 300:
        content = 'Аккаунт успешно активирован'
    else:
        content = 'Аккаунт не активирован'
    return render(request, 'social_network/activation_page.html', {'result': content})


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def reset_password(request, uid, token):
    return render(request, 'social_network/reset_password.html', {'uid': uid, 'token': token})


@api_view(['POST'])
def activationUser(request, uid, token):
    r = requests.post(os.getenv('HOST')+'/auth/users/activation/', data={'uid': uid, 'token': token})
    if r.status_code == 200:
        print('good')
    else:
        print('bad'+r.status_code)