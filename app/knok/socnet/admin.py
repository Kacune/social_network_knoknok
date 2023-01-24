from django.contrib import admin
from .models import *
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext, gettext_lazy as _


class KNUserAdmin(UserAdmin):
    list_display = ('id', 'phone', 'email', 'first_name', 'last_name', 'middle_name', 'birthday', 'is_staff')
    fieldsets = (
        (None, {'fields': ('phone', 'password')}),
        (_('Personal info'), {'fields': ('last_name', 'first_name', 'middle_name', 'email')}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        # (_('Important dates'), {'fields': ('last_login', 'updated_at')}),
        (_('ETC Info'), {'fields': ('birthday', 'gender', 'avatar', 'bio', 'city', 'country')}),
    )


class PhotoAdmin(admin.ModelAdmin):
    list_display = ('user', 'paid', 'cost', 'path_photo', 'description', 'time_create')
    search_fields = ('user',)

    def save_model(self, request, obj, form, change):
        if not obj.user:
            obj.user = request.user
        obj.save()


class SuggestionAdmin(admin.ModelAdmin):
    list_display = ('user', 'theme', 'fire_suggestion', 'description', 'duration', 'time_create')
    search_fields = ('user',)


class ThemeSuggestionAdmin(admin.ModelAdmin):
    list_display = ('name', 'time_create')
    search_fields = ('name',)


class InfoUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'height', 'weight', 'body_type', 'marks',
                    'smoke', 'alcohol', 'marital_status', 'child',
                    'accommodation', 'work', 'meeting_place', 'sponsorship')
    search_fields = ('user',)


class InfoTitleAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'unit', 'time_create')
    search_fields = ('name',)


class InfoValueAdmin(admin.ModelAdmin):
    list_display = ('name', 'value', 'time_create')
    search_fields = ('name',)


class PriceAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'price_obj', 'who', 'isActive', 'time_create')
    search_fields = ('user',)


class PriceObjAdmin(admin.ModelAdmin):
    list_display = ('image', 'cost', 'time_create')
    search_fields = ('cost',)


class DialogAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'interlocutor', 'is_group')
    search_fields = ('user', 'interlocutor', 'is_group')


class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'favorite_user', 'isConfirmed')
    search_fields = ('user', 'favorite_user')


class BlackListAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'black_list_user')
    search_fields = ('user', 'black_list_user')


class WalletAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'money', 'isActive', 'created_at', 'updated_at')
    search_fields = ('user', 'isActive')


class StorageAdmin(admin.ModelAdmin):
    list_display = ('id', 'money')


class TransferAdmin(admin.ModelAdmin):
    list_display = ('id', 'wallet', 'sum', 'isIn', 'type', 'created_at', 'updated_at')
    search_fields = ('user', 'isActive')


class TransferBetweenPeopleAdmin(admin.ModelAdmin):
    list_display = ('id', 'wallet', 'wallet_who', 'sum', 'created_at', 'updated_at')
    search_fields = ('wallet',)


class HistoryTransferAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'money', 'isIn', 'created_at', 'updated_at')
    search_fields = ('id', 'user', 'isIn')


class MessageTextAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'roomId')
    search_fields = ('id', 'user')


admin.site.register(KNUser, KNUserAdmin)
admin.site.register(Photo, PhotoAdmin)
admin.site.register(ThemeSuggestion, ThemeSuggestionAdmin)
admin.site.register(Suggestion, SuggestionAdmin)
admin.site.register(InfoUser, InfoUserAdmin)
admin.site.register(InfoTitle, InfoTitleAdmin)
admin.site.register(InfoValue, InfoValueAdmin)
admin.site.register(Price, PriceAdmin)
admin.site.register(PriceObject, PriceObjAdmin)
admin.site.register(Dialog, DialogAdmin)
admin.site.register(Favorite, FavoriteAdmin)
admin.site.register(BlackList, BlackListAdmin)
admin.site.register(WalletKnok, WalletAdmin)
admin.site.register(TransferKnok, TransferAdmin)
admin.site.register(Storage, StorageAdmin)
admin.site.register(HistoryTransfer, HistoryTransferAdmin)
admin.site.register(TransferBetweenPeople, TransferBetweenPeopleAdmin)
admin.site.register(Adversting)
admin.site.register(MessageText, MessageTextAdmin)
