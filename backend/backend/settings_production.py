"""
Production settings for Vercel deployment.
"""
from .settings import *
import os
import dj_database_url

# Security
DEBUG = os.environ.get('DEBUG', 'False') == 'True'
SECRET_KEY = os.environ.get('SECRET_KEY', SECRET_KEY)
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '.vercel.app').split(',')

# Database — use DATABASE_URL env var (PostgreSQL on Neon/Supabase/Railway)
# Falls back to SQLite for local testing
if os.environ.get('DATABASE_URL'):
    DATABASES = {
        'default': dj_database_url.config(
            default=os.environ['DATABASE_URL'],
            conn_max_age=600,
            ssl_require=True,
        )
    }

# Static files — served by WhiteNoise
MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Media files — Vercel filesystem is ephemeral; use a cloud storage for uploads
# For now, media uploads are disabled in production
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Security headers
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
