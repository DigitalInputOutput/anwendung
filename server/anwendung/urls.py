from anwendung.views import *
from django.urls import re_path

urlpatterns = [
    re_path(r'^$', index),
]