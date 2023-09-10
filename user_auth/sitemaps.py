from django.contrib.sitemaps import Sitemap
from django.shortcuts import reverse
from .models import User
import itertools

# left for -> Detail_Registration
class StaticViewUser(Sitemap):
    changefreq = "weekly"
    priority = 0.5

    def items(self):
        return ["user-dashboard", 'user-search', 'account_signup', 'account_login']

    def location(self, item):
        return reverse(item)


class UserSitemap(Sitemap):
    changefreq = "daily"
    priority = 0.5

    def items(self):
        return User.objects.all()
