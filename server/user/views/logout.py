from django.contrib.auth.signals import user_logged_out
from django.shortcuts import redirect
from django.http import JsonResponse
from django.contrib.auth.models import AnonymousUser
from anwendung.utils import is_ajax

def logout(request):
    """
    Removes the authenticated user's ID from the request and flushes their
    session data.
    """
    # Dispatch the signal before the user is logged out so the receivers have a
    # chance to find out *who* logged out.
    user = getattr(request, 'user', None)
    if hasattr(user, 'is_authenticated') and not user.is_authenticated:
        user = None
    user_logged_out.send(sender=user.__class__, request=request, user=user)

    if hasattr(request, 'user'):
        request.user = AnonymousUser()

    request.session.flush()

    if is_ajax(request):
        return JsonResponse({'result':True})
    else:
        return redirect(request.META.get('HTTP_REFERER','/'))