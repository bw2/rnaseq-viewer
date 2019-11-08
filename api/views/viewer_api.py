"""
APIs used by the main seqr dashboard page
"""

import logging

from django.db import connection, models

import settings
from api.views.utils.json_utils import create_json_response

logger = logging.getLogger(__name__)


def viewer_page_data(request):
    """Returns a JSON object containing information used by the dashboard page:
    ::

      json_response = {
         'loci': {..},
         'sampleListsByCategory': {..},
       }
    """


    #json_response = {
    #    'loci': loci,
    #    'sampleListsByCategory': project_categories_by_guid,
    #}

    return create_json_response(settings.RNASEQ_VIEWER_CONFIG)

