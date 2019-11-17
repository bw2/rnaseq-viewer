import logging
import subprocess
from api.views.utils.json_utils import create_json_response

logger = logging.getLogger(__name__)


def get_google_auth_token(request):
    """Returns a JSON object containing information used by the dashboard page:
    ::

      json_response = {
         'loci': {..},
         'sampleListsByCategory': {..},
       }
    """

    auth_token = subprocess.check_output("gcloud auth application-default print-access-token", shell=True)

    return create_json_response({
        "auth_token": auth_token.strip(),
    })


