from django.test import TestCase
from django.urls.base import reverse
from api.views.react_app import main_app


class DashboardPageTest(TestCase):
    fixtures = ['users']

    def test_react_page(self):
        url = reverse(main_app)

        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)


