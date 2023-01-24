from django.urls import path
from registration.views import SignUp, SignIn, Reset

urlpatterns = [
    path('up', SignUp),
    path('in', SignIn),
    path('reset', Reset)
]
