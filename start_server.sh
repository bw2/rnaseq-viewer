#!/usr/bin/env bash

gunicorn -w 4 -c gunicorn_config.py wsgi:application 
