import logging
import os
import random
import string
import sys

logger = logging.getLogger(__name__)

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ADMINS = ()

MANAGERS = ADMINS

# Password validation - https://docs.djangoproject.com/en/1.10/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Application definition
INSTALLED_APPS = [
    'corsheaders',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'api',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

CORS_ORIGIN_WHITELIST = (
    'localhost:3000',
    'localhost:8000',
)
CORS_ALLOW_CREDENTIALS = True

# django-debug-toolbar settings
ENABLE_DJANGO_DEBUG_TOOLBAR = False
if ENABLE_DJANGO_DEBUG_TOOLBAR:
    MIDDLEWARE = ['debug_toolbar.middleware.DebugToolbarMiddleware'] + MIDDLEWARE
    INSTALLED_APPS = ['debug_toolbar'] + INSTALLED_APPS
    INTERNAL_IPS = ['127.0.0.1']
    SHOW_COLLAPSED = True
    DEBUG_TOOLBAR_PANELS = [
        'ddt_request_history.panels.request_history.RequestHistoryPanel',
        #'debug_toolbar.panels.versions.VersionsPanel',
        'debug_toolbar.panels.timer.TimerPanel',
        'debug_toolbar.panels.settings.SettingsPanel',
        'debug_toolbar.panels.headers.HeadersPanel',
        'debug_toolbar.panels.request.RequestPanel',
        'debug_toolbar.panels.profiling.ProfilingPanel',
        'debug_toolbar.panels.sql.SQLPanel',
        #'debug_toolbar.panels.templates.TemplatesPanel',
        'debug_toolbar.panels.staticfiles.StaticFilesPanel',
        #'debug_toolbar.panels.cache.CachePanel',
        #'debug_toolbar.panels.signals.SignalsPanel',
        'debug_toolbar.panels.logging.LoggingPanel',
        'debug_toolbar.panels.redirects.RedirectsPanel',
    ]
    DEBUG_TOOLBAR_CONFIG = {
        'RESULTS_CACHE_SIZE': 100,
    }


# Internationalization
# https://docs.djangoproject.com/en/1.10/topics/i18n/

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.10/howto/static-files/

STATIC_URL = '/static/'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '%(asctime)s %(levelname)s: %(message)s     (%(name)s.%(funcName)s:%(lineno)d)',
        },
        'simple': {
            'format': '%(asctime)s %(levelname)s:  %(message)s'
        },
    },
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        },
        'file': {
            'level': 'INFO',
            'filters': ['require_debug_false'],
            'class': 'logging.FileHandler',
            'filename': 'django.info.log',
            'formatter': 'verbose',
        },
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
    },
    'loggers': {
        '': {
            'handlers': ['file', 'console'],
            'level': 'INFO',
            'formatter': 'verbose',
            'propagate': True,
        },
    }
}

ELASTICSEARCH_SERVICE_HOSTNAME = os.environ.get('ELASTICSEARCH_SERVICE_HOSTNAME', 'localhost')
ELASTICSEARCH_PORT = os.environ.get('ELASTICSEARCH_SERVICE_PORT', "9200")
ELASTICSEARCH_SERVER = "%s:%s" % (ELASTICSEARCH_SERVICE_HOSTNAME, ELASTICSEARCH_PORT)

DEPLOYMENT_TYPE_DEV = "dev"
DEPLOYMENT_TYPE_PROD = "prod"
DEPLOYMENT_TYPES = set([DEPLOYMENT_TYPE_DEV, DEPLOYMENT_TYPE_PROD])
DEPLOYMENT_TYPE = os.environ.get("DEPLOYMENT_TYPE", DEPLOYMENT_TYPE_DEV)
assert DEPLOYMENT_TYPE in DEPLOYMENT_TYPES, "Invalid deployment type: %(DEPLOYMENT_TYPE)s" % locals()

# set the secret key
SECRET_FILE = os.path.join(os.path.dirname(__file__), 'django_key')
try:
    SECRET_KEY = open(SECRET_FILE).read().strip()
except IOError:
    try:
        SECRET_KEY = ''.join(random.SystemRandom().choice(string.printable) for i in range(50))
        with open(SECRET_FILE, 'w') as f:
            f.write(SECRET_KEY)
    except IOError as e:
        logger.warn('Unable to generate {}: {}'.format(os.path.abspath(SECRET_FILE), e))
        SECRET_KEY = os.environ.get("DJANGO_KEY", "-placeholder-key-")

if DEPLOYMENT_TYPE == DEPLOYMENT_TYPE_PROD:
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
else:
    DEBUG = True

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'guardian.backends.ObjectPermissionBackend',
)

BASE_URL = os.environ.get("BASE_URL", "/")

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'compressor.finders.CompressorFinder',
)

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'ui/dist/'),
            os.path.join(BASE_DIR, 'api/templates/'),
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                "django.contrib.auth.context_processors.auth",
                "django.template.context_processors.request",
                "django.template.context_processors.debug",
                "django.template.context_processors.i18n",
                "django.template.context_processors.media",
                "django.template.context_processors.static",
                "django.template.context_processors.tz",
                "django.contrib.messages.context_processors.messages",
                "xbrowse_server.base.context_processors.custom_processor",
            ],
        },
    },
]

MEDIA_URL = '/media/'


ROOT_URLCONF = 'api.urls'

WSGI_APPLICATION = 'wsgi.application'

INSTALLED_APPS += [
    'compressor',
]


TEST_RUNNER = 'django.test.runner.DiscoverRunner'

AUTH_PROFILE_MODULE = 'base.UserProfile'


STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'ui/dist/'),    # this is so django's collectstatic copies ui dist files to STATIC_ROOT
)

STATIC_ROOT = os.path.join(BASE_DIR, 'static')


CSRF_COOKIE_HTTPONLY = True