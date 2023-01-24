from .models import *
import datetime


class DataMixin:
    def get_user_context(self, **kvargs):
        context = kvargs
        suggestions = Suggestion.objects.all()
        context['suggestions'] = suggestions
        context['my_suggestons_count'] = suggestions.filter(pk=self.request.user.pk, duration__gte=datetime.datetime.now()).count()
        context['suggestons_count'] = Suggestion.objects.filter(duration__gte=datetime.datetime.now()).count()
        # favaorite_count_i = Favorite.objects.filter(favorite_user=self.request.user.pk).count()
        # favaorite_count_he = Favorite.objects.filter(user=self.request.user.pk).count()
        # context['favorite_in_count'] = favaorite_count_i + favaorite_count_he
        # context['price_count'] = Price.objects.filter(who=self.request.user.pk, isActive=True).count()
        context['themes'] = ThemeSuggestion.objects.all()
        return context
