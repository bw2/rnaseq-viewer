"""seqr URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
"""
from settings import ENABLE_DJANGO_DEBUG_TOOLBAR
from django.conf.urls import url, include
from django.contrib import admin
import django.contrib.admindocs.urls
import django.views.static
from api.views.react_app import main_app

# core react page templates
from views.auth_api import get_google_auth_token

react_app_pages = [
    '',
]

# NOTE: the actual url will be this with an '/api' prefix
api_endpoints = {
    'google_auth_token': get_google_auth_token,
}

urlpatterns = []

urlpatterns += [url("^%(url_endpoint)s$" % locals(), main_app) for url_endpoint in react_app_pages]


# api
for url_endpoint, handler_function in api_endpoints.items():
    urlpatterns.append( url("^api/%(url_endpoint)s$" % locals(), handler_function) )

urlpatterns += [
    url(r'^admin/doc/', include(django.contrib.admindocs.urls)),
    url(r'^admin/', admin.site.urls),
    url(r'^media/(?P<path>.*)$', django.views.static.serve, {
        'document_root': "/",
    }),
]

# django debug toolbar
if ENABLE_DJANGO_DEBUG_TOOLBAR:
    import debug_toolbar
    urlpatterns = [
        url(r'^__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns
