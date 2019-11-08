#!/usr/bin/env python

import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'
import django
django.setup()

import IPython
IPython.embed(user_ns={})
