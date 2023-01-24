import os

from django.contrib.auth.base_user import BaseUserManager, AbstractBaseUser
from django.contrib.auth.models import AbstractUser, PermissionsMixin
import minio
from django.db import models
from django.utils.translation import gettext_lazy as _
from knoknok import settings


class UserManager(BaseUserManager):
    def create_user(self, phone, email, password=None):
        """ Создает и возвращает пользователя с имэйлом, паролем и именем. """
        if phone is None:
            raise TypeError('Users must have a username.')

        if email is None:
            raise TypeError('Users must have an email address.')

        if password is None:
            raise TypeError('Users must have a password.')

        user = self.model(phone=phone, email=self.normalize_email(email))
        user.set_password(password)
        user.save()
        info_user = InfoUser(user=user, height=0, weight=0, body_type=0, marks=0, smoke=0, marital_status=0, child=0, accommodation=0, work=0, alcohol=0, meeting_place=0, sponsorship=0)
        wallet = WalletKnok(user=user, money=200, isActive=True)
        info_user.save()
        wallet.save()
        return user

    def create_superuser(self, phone, email, password):
        """ Создает и возввращет пользователя с привилегиями суперадмина. """
        if password is None:
            raise TypeError('Superusers must have a password.')

        user = self.create_user(phone, email, password)
        user.is_superuser = True
        user.is_staff = True
        user.save()

        return user


def upload_to_avatar(instance, filename):
    return os.path.join('avatar',
                     str(instance.pk))


class KNUser(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(db_index=True, blank=True, max_length=255, unique=False)
    email = models.EmailField(db_index=True, blank=True, unique=True)
    phone = models.CharField(db_index=True, max_length=14, unique=True, verbose_name='Номер телефона')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['phone']
    objects = UserManager()
    GENDER = (
        ('male', 'male'),
        ('female', 'female')
    )
    first_name = models.CharField(max_length=50, blank=True, null=True, verbose_name='Имя')
    last_name = models.CharField(max_length=50, blank=True, null=True, verbose_name='Фамилия')
    middle_name = models.CharField(max_length=50, blank=True, null=True, verbose_name='Отчество')
    birthday = models.DateTimeField(blank=True, null=True, verbose_name='День рождения')
    bio = models.TextField(blank=True, null=True, verbose_name='Краткое описание')
    gender = models.CharField(max_length=6, choices=GENDER, default='male', verbose_name='Пол')
    # storage=MinioStorage(bucket_name='local-media', minio_client=minio.Minio(endpoint=os.getenv('MINIO_STORAGE_ENDPOINT'), access_key=os.getenv('MINIO_LOGIN'), secret_key=os.getenv('MINIO_PASSWORD')), auto_create_bucket=True),
    avatar = models.ImageField(upload_to='avatar', blank=True, null=True, verbose_name='Аватар')
    purpose = models.CharField(max_length=50, null=True, verbose_name='Цель знакомства')
    city = models.CharField(max_length=50, null=True, verbose_name='Город')
    country = models.CharField(max_length=50, null=True, verbose_name='Страна')

    def __str__(self):

        return str(self.email) + ' ' + str(self.first_name) + ' ' + str(self.last_name)

    class Meta:
        verbose_name = 'Пользователь KnoKnoK'
        verbose_name_plural = 'Пользователи KnoKnoK'


def func_path_photo(obj, name):
    return str(obj.user_id) + '/' + (name)


class Photo(models.Model):
    user = models.ForeignKey(KNUser, on_delete=models.CASCADE, verbose_name='Пользователь')
    paid = models.BooleanField(default=False, blank=True, verbose_name='Платное/Бесплатное')
    cost = models.IntegerField(default=0, blank=True, verbose_name='Цена')
    path_photo = models.ImageField(upload_to='photos', verbose_name='Путь к фото')
    description = models.TextField(blank=True, null=True, verbose_name='Описание')
    time_create = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')

    class Meta:
        verbose_name = 'Фотограия'
        verbose_name_plural = 'Фотографии'


class ThemeSuggestion(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name='Название темы')
    time_create = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Тема предложения'
        verbose_name_plural = 'Темы предложений'


class Suggestion(models.Model):
    user = models.ForeignKey(KNUser, on_delete=models.CASCADE, verbose_name='Пользователь')
    theme = models.ForeignKey('ThemeSuggestion', on_delete=models.PROTECT, verbose_name='Тема')
    description = models.TextField(blank=False, verbose_name='Описание')
    # Убрать время предложения
    duration = models.DateField(blank=False, null=False, verbose_name='Дата окончания события')
    fire_suggestion = models.BooleanField(default=False, blank=True, verbose_name='Горящее/Не горящее')
    time_create = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')

    def __str__(self):
        return self.theme.__str__() + ':  ' + self.description

    class Meta:
        verbose_name = 'Предложение'
        verbose_name_plural = 'Предложения'


class InfoUser(models.Model):
    user = models.OneToOneField(KNUser, unique=True, on_delete=models.CASCADE, verbose_name='Пользователь')
    height = models.CharField(max_length=3, verbose_name='Рост')
    weight = models.CharField(max_length=3, verbose_name='Вес')
    body_type = models.CharField(max_length=30, verbose_name='Телосложение')
    marks = models.CharField(max_length=30, verbose_name='На теле')
    smoke = models.CharField(max_length=30, verbose_name='Курение')
    marital_status = models.CharField(max_length=30, verbose_name='Семейное положение')
    child = models.CharField(max_length=30, verbose_name='Дети')
    accommodation = models.CharField(max_length=30, verbose_name='Проживание')
    work = models.CharField(max_length=30, verbose_name='Сфера работы')
    alcohol = models.CharField(max_length=30, verbose_name='Алкоголь')
    meeting_place = models.CharField(max_length=30, verbose_name='Место для встреч')
    sponsorship = models.CharField(max_length=30, verbose_name='Спонсорство')
    time_create = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')

    def __str__(self):
        return self.user.__str__() + ', ' + self.time_create.__str__()

    class Meta:
        verbose_name = 'Характеристика пользователя'
        verbose_name_plural = 'Характеристики пользователей'


class InfoTitle(models.Model):
    name = models.CharField(max_length=30, unique=True, verbose_name='Заголовок характеристики')
    unit = models.CharField(max_length=10, blank=True, verbose_name='Единица измерения')
    time_create = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')

    def __str__(self):
        return self.name.__str__() + ' ' + self.unit.__str__() + ':'

    class Meta:
        verbose_name = 'Заголовок характеристики'
        verbose_name_plural = 'Заголовки характеристик'


class InfoValue(models.Model):
    name = models.ForeignKey(InfoTitle, on_delete=models.CASCADE, verbose_name='Характеристика')
    value = models.CharField(max_length=30, unique=True, verbose_name='Значение')
    time_create = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')

    def __str__(self):
        return self.value.__str__()

    class Meta:
        verbose_name = 'Значение характеристики'
        verbose_name_plural = 'Значения характеристик'


class PriceObject(models.Model):

    image = models.ImageField(upload_to='media/prices' ,blank=True, null=True, verbose_name='Подарок')
    cost = models.IntegerField(default=0, blank=True, verbose_name='Цена')
    time_create = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')

    def __str__(self):
        return self.pk.__str__()

    class Meta:
        verbose_name = 'Подарок, объект'
        verbose_name_plural = 'Подарки, объекты'


class Price(models.Model):
    user = models.ForeignKey(KNUser, on_delete=models.CASCADE, verbose_name='Пользователь')
    price_obj = models.ForeignKey(PriceObject, on_delete=models.CASCADE, null=True, verbose_name='Объект подарка')
    who = models.ForeignKey(KNUser, blank=True, default=None, on_delete=models.CASCADE, verbose_name='Получатель',
                            related_name='recipient')
    isActive = models.BooleanField(default=True, blank=False, verbose_name='Активен/Не активен')
    time_create = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    time_update = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')

    class Meta:
        verbose_name = 'Подарок'
        verbose_name_plural = 'Подарки'


class Dialog(models.Model):
    user = models.ForeignKey(KNUser, on_delete=models.CASCADE, verbose_name='Пользователь')
    interlocutor = models.ForeignKey(KNUser, on_delete=models.CASCADE, related_name='interlocutor',
                                     verbose_name='Собеседник')
    is_group = models.BooleanField(_('active'), default=False, help_text=_('Является ли чат групповым'), )

    class Meta:
        verbose_name = 'Диалог'
        verbose_name_plural = 'Диалоги'

    def __str__(self):
        return str(self.user) + ' ' + str(self.interlocutor)


class MessageText(models.Model):
    user = models.ForeignKey(KNUser, on_delete=models.CASCADE, verbose_name='Пользователь')
    roomId = models.ForeignKey(Dialog, on_delete=models.CASCADE, verbose_name='Идентификатор комнаты')
    text = models.TextField(blank=False, null=True, verbose_name='Текст сообщения')
    time_create = models.DateTimeField(auto_now_add=True, verbose_name='Дата добавления')

    class Meta:
        verbose_name = 'Сообщение'
        verbose_name_plural = 'Сообщения'


class Favorite(models.Model):
    user = models.ForeignKey(KNUser, on_delete=models.CASCADE, verbose_name='Пользователь')
    favorite_user = models.ForeignKey(KNUser, on_delete=models.CASCADE, related_name='favorite_user',
                                      verbose_name='Избранный')
    isConfirmed = models.BooleanField(default=False, blank=True, verbose_name='Подтверждено/Не подтверждено')
    time_create = models.DateTimeField(auto_now_add=True, verbose_name='Дата добавления')

    class Meta:
        verbose_name = 'Избранный'
        verbose_name_plural = 'Избранные'


class BlackList(models.Model):
    user = models.ForeignKey(KNUser, on_delete=models.CASCADE, verbose_name='Пользователь')
    black_list_user = models.ForeignKey(KNUser, on_delete=models.CASCADE, related_name='black_list_user',
                                      verbose_name='Заблокированный пользователь')
    time_create = models.DateTimeField(auto_now_add=True, verbose_name='Дата добавления')

    class Meta:
        verbose_name = 'Запись из черного списка'
        verbose_name_plural = 'Черный список'


class WalletKnok(models.Model):
    user = models.OneToOneField(KNUser, on_delete=models.CASCADE, unique=True, verbose_name='Пользователь')
    money = models.IntegerField(default=20, blank=False, verbose_name='Размер кошелька')
    isActive = models.BooleanField(default=False, blank=False, verbose_name='Активный/Не активный')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')

    def __str__(self):
        return self.user.__str__() + ' ' + self.money.__str__() + 'KN'

    class Meta:
        verbose_name = 'Кошелек'
        verbose_name_plural = 'Кошельки'


class Storage(models.Model):
    money = models.IntegerField(default=20, blank=False, verbose_name='Пополнение внутреннего кошельа или вывод')

    def __str__(self):
        return self.money.__str__()

    class Meta:
        verbose_name = 'Хранилище'


class HistoryTransfer(models.Model):
    user = models.ForeignKey(KNUser, on_delete=models.CASCADE, verbose_name='Пользователь')
    money = models.IntegerField(default=20, blank=False, verbose_name='Пополнение внутреннего кошельа или вывод')
    isIn = models.BooleanField(default=False, blank=False, verbose_name='Пополнение/Вывод')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')

    def __str__(self):
        return self.user.__str__() + ' ' + self.money.__str__() + 'KN'

    class Meta:
        verbose_name = 'Внутренний перевод в хранилище'
        verbose_name_plural = 'Внутренние переводы в хранилище'


class TransferKnok(models.Model):
    wallet = models.ForeignKey(WalletKnok, on_delete=models.CASCADE, verbose_name='Пользователь')
    sum = models.IntegerField(blank=False, verbose_name='Размер кошелька')
    isIn = models.BooleanField(default=False, blank=False, verbose_name='Пополнение/Вывод')
    type = models.IntegerField(blank=False, verbose_name='Тип операции')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')

    class Meta:
        verbose_name = 'Транзакция'
        verbose_name_plural = 'Транзакции'


class TransferBetweenPeople(models.Model):
    wallet = models.ForeignKey(WalletKnok, on_delete=models.CASCADE, verbose_name='Кто отправил KN')
    wallet_who = models.ForeignKey(WalletKnok, on_delete=models.CASCADE, verbose_name='Кому отправлены KN', related_name='who')
    sum = models.IntegerField(blank=False, verbose_name='Размер кошелька')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')

    class Meta:
        verbose_name = 'Транзакция от человека человеку'
        verbose_name_plural = 'Транзакции между людьми'


class Adversting(models.Model):
    user = models.ForeignKey(KNUser, on_delete=models.CASCADE, verbose_name='Чья реклама')
    baner = models.ImageField(upload_to='media/banners' , verbose_name='Банер')
    resolution = models.BooleanField(default=True, blank=False, null=False, verbose_name='Большое/Не большое')
    link = models.CharField(max_length=100, verbose_name='Ссылка')
    country = models.CharField(max_length=30, verbose_name='Страна')
    region = models.CharField(max_length=30, verbose_name='Регион')
    city = models.CharField(max_length=30, verbose_name='Город')
    count_day = models.IntegerField(blank=False, verbose_name='Количество дней показа')
    count_in_day = models.IntegerField(blank=False, verbose_name='Количество показов в день')
    time_show = models.IntegerField(blank=False, verbose_name='Время одного показа')
    period_start = models.TimeField(blank=False, verbose_name='Начала периода показа')
    time_period = models.TimeField(blank=False, verbose_name='Длительность периода')
    time_create = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')

    def __str__(self):
        return str(self.user) + ' ' + self.link + ' ' + str(self.time_create)

    class Meta:
        verbose_name = 'Рекламный пост'
        verbose_name_plural = 'Рекламные посты'