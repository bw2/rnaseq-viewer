import json
import re
from django.core.serializers.json import DjangoJSONEncoder
from django.template import loader
from django.http import HttpResponse


def main_app(request, *args, **kwargs):
    """Loads the react single page app."""

    initial_json = {}
    return _render_app_html(request, initial_json)


def _render_app_html(request, initial_json):
    html = loader.render_to_string('app.html')

    html = html.replace(
        "window.initialJSON=null",
        "window.initialJSON=" + json.dumps(initial_json, default=DjangoJSONEncoder().default)
    )

    if request.get_host() == 'localhost:3000':
        html = re.sub(r'static/app(-.*)js', 'app.js', html)
        html = re.sub(r'<link\s+href="/static/app.*css"[^>]*>', '', html)

    return HttpResponse(html, content_type="text/html")