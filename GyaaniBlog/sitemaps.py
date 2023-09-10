from django.contrib.sitemaps import Sitemap
from django.shortcuts import reverse
# from GyaaniBlog.models import Blog_tag_new, Gyaani_Blogs_new
from GyaaniBlog.models import GyaaniBlog, ControlledBlogs, BlogDemand
import itertools

class StaticViewBlogSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.5

    def items(self):
        return ['name_blog']
        
    def location(self, item):
        return reverse(item) 

class GyaaniBlogSitemap(Sitemap):
    # List method names from your objects that return the absolute URLs here
    changefreq = "daily"
    priority = 0.5

    # FIELDS = ("get_blogsingle_url", "get_blogwriter_url", "get_blogcategory_url")
    
    def items(self):
        return GyaaniBlog.objects.all()
        # This will return you all possible ("method_name", object) tuples instead of the
        # objects from the query set. The documentation says that this should be a list 
        # rather than an iterator, hence the list() wrapper.
        # return list(itertools.product(GyaaniBlogsnewSitemap.FIELDS,
                                    #   Gyaani_Blogs_new.objects.all()))

    # def location(self, item):
        # Call method_name on the object and return its output
        # return getattr(item[1], item[0])()


# class Blog_tag_newSitemap(Sitemap):
    
#     changefreq = "daily"
#     priority = 0.5

#     def items(self):
#         return Blog_tag_new.objects.all()


class ControlledBlogsSitemap(Sitemap):
    
    changefreq = "daily"
    priority = 0.5

    def items(self):
        return ControlledBlogs.objects.all()

class BlogDemandSitemap(Sitemap):
    # List method names from your objects that return the absolute URLs here
    changefreq = "daily"
    priority = 0.5

    def items(self):
        return BlogDemand.objects.all()