from .models import *


class DataMixin:
    def get_user_context(self, **kvargs):
        context = kvargs
        return context
