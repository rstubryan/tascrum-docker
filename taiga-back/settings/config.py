# -*- coding: utf-8 -*-
import os

from .common import *   # noqa, pylint: disable=unused-wildcard-import

#########################################
## GENERIC
#########################################

DEBUG = os.getenv('DJANGO_DEBUG', 'False') == 'True'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('POSTGRES_DB', 'taiga'),
        'USER': os.getenv('POSTGRES_USER', 'taiga'),
        'PASSWORD': os.getenv('POSTGRES_PASSWORD', 'taiga'),
        'HOST': os.getenv('POSTGRES_HOST', 'db'),
        'PORT': os.getenv('POSTGRES_PORT', '5432'),
    }
}

SECRET_KEY = os.getenv('TAIGA_SECRET_KEY', 'taiga-backend-secret-key')

TAIGA_SITES_SCHEME = os.getenv('TAIGA_SITES_SCHEME', 'http')
TAIGA_SITES_DOMAIN = os.getenv('TAIGA_SITES_DOMAIN', 'localhost')
FORCE_SCRIPT_NAME = os.getenv('FORCE_SCRIPT_NAME', '')

TAIGA_URL = f"{TAIGA_SITES_SCHEME}://{TAIGA_SITES_DOMAIN}{FORCE_SCRIPT_NAME}"
SITES = {
    "api": {"name": "api", "scheme": TAIGA_SITES_SCHEME, "domain": TAIGA_SITES_DOMAIN},
    "front": {"name": "front", "scheme": TAIGA_SITES_SCHEME, "domain": f"{TAIGA_SITES_DOMAIN}{FORCE_SCRIPT_NAME}"}
}

# Setting DEFAULT_PROJECT_SLUG_PREFIX to false
# removes the username from project slug
DEFAULT_PROJECT_SLUG_PREFIX = False

#########################################
## MEDIA AND STATIC
#########################################

MEDIA_ROOT = os.getenv('MEDIA_ROOT', '/app/media')
MEDIA_URL = f"{TAIGA_URL}/media/"
DEFAULT_FILE_STORAGE = "taiga_contrib_protected.storage.ProtectedFileSystemStorage"
THUMBNAIL_DEFAULT_STORAGE = DEFAULT_FILE_STORAGE

STATIC_ROOT = os.getenv('STATIC_ROOT', '/app/static')
STATIC_URL = f"{TAIGA_URL}/static/"

#########################################
## EMAIL
#########################################
# https://docs.djangoproject.com/en/3.1/topics/email/
EMAIL_BACKEND = os.getenv('EMAIL_BACKEND', 'django.core.mail.backends.smtp.EmailBackend')
CHANGE_NOTIFICATIONS_MIN_INTERVAL = 120  # seconds

DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', 'no-reply@example.com')
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', 'False') == 'True'
EMAIL_USE_SSL = os.getenv('EMAIL_USE_SSL', 'False') == 'True'
EMAIL_HOST = os.getenv('EMAIL_HOST', 'localhost')
EMAIL_PORT = int(os.getenv('EMAIL_PORT', '25'))
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', '')

#########################################
## EVENTS
#########################################
EVENTS_PUSH_BACKEND = "taiga.events.backends.rabbitmq.EventsPushBackend"
EVENTS_PUSH_BACKEND_OPTIONS = {
    "url": f"amqp://{os.getenv('RABBITMQ_USER', 'taiga')}:{os.getenv('RABBITMQ_PASS', 'taiga')}@{os.getenv('RABBITMQ_HOST', 'rabbitmq')}:{os.getenv('RABBITMQ_PORT', '5672')}/taiga"
}

#########################################
## TAIGA ASYNC
#########################################
CELERY_ENABLED = os.getenv('CELERY_ENABLED', 'True') == 'True'

from kombu import Queue  # noqa

CELERY_BROKER_URL = f"amqp://{os.getenv('RABBITMQ_USER', 'taiga')}:{os.getenv('RABBITMQ_PASS', 'taiga')}@{os.getenv('RABBITMQ_HOST', 'rabbitmq')}:{os.getenv('RABBITMQ_PORT', '5672')}/taiga"
CELERY_RESULT_BACKEND = None  # for a general installation, we don't need to store the results
CELERY_ACCEPT_CONTENT = ['pickle', ]  # Values are 'pickle', 'json', 'msgpack' and 'yaml'
CELERY_TASK_SERIALIZER = "pickle"
CELERY_RESULT_SERIALIZER = "pickle"
CELERY_TIMEZONE = 'Europe/Madrid'
CELERY_TASK_DEFAULT_QUEUE = 'tasks'
CELERY_QUEUES = (
    Queue('tasks', routing_key='task.#'),
    Queue('transient', routing_key='transient.#', delivery_mode=1)
)
CELERY_TASK_DEFAULT_EXCHANGE = 'tasks'
CELERY_TASK_DEFAULT_EXCHANGE_TYPE = 'topic'
CELERY_TASK_DEFAULT_ROUTING_KEY = 'task.default'

#########################################
## CONTRIBS
#########################################
INSTALLED_APPS += ["taiga_contrib_protected"]

#########################################
## TELEMETRY
#########################################
ENABLE_TELEMETRY = os.getenv('ENABLE_TELEMETRY', 'False') == 'True'

#########################################
##  REGISTRATION
#########################################
PUBLIC_REGISTER_ENABLED = os.getenv('PUBLIC_REGISTER_ENABLED', 'False') == 'True'

#########################################
## WEBHOOKS
#########################################
WEBHOOKS_ENABLED = os.getenv('WEBHOOKS_ENABLED', 'False') == 'True'

#########################################
## FEEDBACK
#########################################
FEEDBACK_ENABLED = os.getenv('FEEDBACK_ENABLED', 'False') == 'True'
FEEDBACK_EMAIL = os.getenv('FEEDBACK_EMAIL', 'support@example.com')

#########################################
## STATS
#########################################
STATS_ENABLED = os.getenv('STATS_ENABLED', 'False') == 'True'
STATS_CACHE_TIMEOUT = 60*60  # In second