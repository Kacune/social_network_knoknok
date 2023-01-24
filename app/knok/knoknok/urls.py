from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path
from knoknok import settings
from socnet.views import *

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('mypage', MyPage.as_view(), name='mypage'),
    path('', Main.as_view(), name='main'),
    path('<int:pk>', Page.as_view(), name='page'),
    path('messages', Messages.as_view()),
    path('add_advirsting', AddAdvirsting.as_view()),
    path('setting', Setting.as_view()),
    path('news', News.as_view()),
    path('finance', Finance.as_view()),
    path('suggestions_page', SuggestionsPage.as_view()),
    path('my_suggestions', MySuggestionsPage.as_view()),
    path('favorites', Favorites.as_view()),
    path('who_came', WhoCame.as_view()),
    path('price_list', PriceList.as_view()),
    path('search', Search.as_view()),
    path('add_photo', AddPhoto.as_view()),
    path('correct_anketa', Correct.as_view()),
    path('api/user/update/<int:pk>', userUpdate),
    path('api/user/update/avatar/<int:pk>', UpdateAvatar.as_view()),

    path('api/suggest', SuggestionViewAPI.as_view()),
    path('api/s_list', SuggestionListViewAPI.as_view()),
    path('api/u_list', UserListViewAPI.as_view()),
    path('api/ts_list', ThemeSuggestionListViewAPI.as_view()),
    path('api/user/get/<int:pk>', userSelf),
    path('api/suggest/<int:pk>', suggestionSelf),

    path('api/favorite', FavoriteViewAPI.as_view()),
    path('api/favorite/get/i/favorite_user/', FavoriteUserIGet.as_view()),
    path('api/favorite/get/i/user/', FavoriteUserGet.as_view()),
    path('api/u_favorite/<int:pk>', favoriteUpdate),
    path('api/f_list', FavoriteListViewAPI.as_view()),

    path('api/users/create', UserCreateAPI.as_view()),

    path('api/photos/', PhotoListViewAPI.as_view()),
    path('api/photos/create', PhotoAPI.as_view({'post':'create'})),

    path('api/characteristics/list', CharacteristicsList.as_view()),
    path('api/characteristics/title/list', CharacteristicsTitleList.as_view()),
    path('api/characteristics/value/list', CharacteristicsValueList.as_view()),

    path('api/info/update/<int:pk>', characteristicsUpdate),
    path('api/info/get/<int:pk>', characteristicsSelf),
    path('api/info/create', InfoUserCreate.as_view()),
    path('api/info/list', InfoUsersAPI.as_view()),

    path('api/suggestions/delete/<int:pk>', suggestionDelete),
    path('api/suggestions/update/<int:pk>', suggestionUpdate),
    path('api/favorite/delete/<int:pk>', favoriteDelete),

    path('api/wallet/update/<int:pk>', walletUpdate),
    path('api/wallet/<int:pk>', walletSelf),
    path('api/wallet/create/', WalletCreateAPI.as_view()),
    path('api/transfer/create', TransferAPI.as_view()),

    path('api/price/list', PriceListAPI.as_view()),
    path('api/price_object/list', PriceObjectAPI.as_view()),
    path('api/price_object/one/<int:pk>', priceObjectOne),
    path('api/price/create', PriceAPI.as_view()),
    path('api/price/update/<int:pk>', priceUpdate),
    path('api/price/one/<int:pk>', priceSelf),

    # History transfer api
    path('api/history_transfer/list', HistoryTransferListAPI.as_view()),
    path('api/history_transfer/create', HistoryTransferAPI.as_view()),
    path('api/history_transfer/get/<int:pk>', historyTransferSelf),
    path('api/history_transfer/update/<int:pk>', historyTransferUpdate),

    # Storage api
    path('api/storage/get/<int:pk>', storageSelf),
    path('api/storage/update/<int:pk>', storageUpdate),

    path('api/transfer_between_people/create', TransferBetweenPeopleAPI.as_view()),

    path('api/advirsting/create', AdverstingAPI.as_view({'post':'create'})),
    path('api/advirsting/get/<int:pk>', adverstingSelf),
    path('api/advirsting/update/<int:pk>', adverstingUpdate),
    path('api/advirsting/get', AdverstingListAPI.as_view()),

    path('api/dialog/create', DialogAPI.as_view()),
    path('api/dialog/self', dialogSelf),
    path('api/dialog/delete', dialogDelete),
    path('api/dialog/list', DialogListAPI.as_view()),

    path('api/blacklist/delete/<int:pk>', black_listDelete),
    path('api/blacklist/self/<int:pk>', blacklistSelf),
    path('api/blacklist/create', BlackListAPI.as_view()),
    path('api/blacklist/list/', BlacklistListViewAPI.as_view()),
    path('api/blacklist/is_exict', BlacklistIsExictViewAPI.as_view()),

    path('api/messages/list', MessagesListAPI.as_view()),
    path('api/messages/create', MessageTextAPI.as_view()),
    #re_path('^api/messages/get/(?P<roomId>.+)/$', MessageGet.as_view()),
    path('api/messages/get/', MessageGet.as_view()),
    path('api-auth', include('rest_framework.urls')),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.authtoken')),
    path('auth/', include('djoser.urls.jwt')),
    path('sign/', include('registration.urls')),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/create/', UserCreateAPI.as_view()),
    path('activate/<str:uid>/<str:token>', request_user_activation),
    path('password/reset/confirm/<str:uid>/<str:token>', reset_password),
    path('data/for/navbar/<int:pk>', navbar_data),

    #path('map', Map.as_view()),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
