from django.http import request
from django.shortcuts import render, redirect
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import ListModelMixin, CreateModelMixin
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics, permissions
from .utils import DataMixin
from django.http import HttpResponseRedirect
from django.views.generic.edit import FormView
from django.views import View
from django.views.generic import ListView
from socnet.models import Suggestion, Price, Photo, Dialog, InfoUser, Favorite, KNUser, ThemeSuggestion
from rest_framework.decorators import api_view, permission_classes


@permission_classes([permissions.AllowAny])
def SignUp(request):
    return render(request, 'sign/sign_up.html', {'title': 'Регистрация'})


@permission_classes([permissions.AllowAny])
def SignIn(request):
    return render(request, 'sign/sign_in.html', {'title': 'Авторизация'})


@permission_classes([permissions.AllowAny])
def Reset(request):
    return render(request, 'sign/page_reset.html', {'title': 'Смена пароля'})