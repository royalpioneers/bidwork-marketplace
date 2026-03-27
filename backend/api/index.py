"""
Vercel serverless entry point.
"""
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings_production')

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()

# Vercel expects a callable named `app`
app = application
