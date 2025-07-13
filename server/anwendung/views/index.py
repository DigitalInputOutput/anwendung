from django.shortcuts import render
from anwendung.models import Umfrage

def index(request):
    context = {
        'user':request.user,
        'umfrage':Umfrage.objects.first()
    }

    return render(request, 'desktop/anwendung/index.html', context)