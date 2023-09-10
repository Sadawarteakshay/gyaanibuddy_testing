from django.db import models
from datetime import datetime
from django.dispatch import receiver
from django.utils import timezone
from django.utils.html import strip_tags
from django.shortcuts import reverse
from django.contrib.sitemaps import ping_google
from GyaaniBuddy.models import Writer
from uuid import uuid4
from django.template.defaultfilters import slugify

medium_len = 100
long_len = 250

# NEW
from django.conf import settings
from user_auth.models import User
from ckeditor_uploader.fields import RichTextUploadingField
from GyaaniBuddy.utils import unique_slug
from taggit.managers import TaggableManager
from taggit.models import Tag

class GyaaniBlog(models.Model):
    title = models.CharField(max_length=settings.BLOG_TITLE_MAX_LENGTH)
    slug = models.SlugField(unique=True,blank=True,max_length=settings.BLOG_TITLE_MAX_LENGTH + 10) # Extra 10 is added incase of same title is found and we add title-38e832e2938
    short_description = models.CharField(max_length=settings.BLOG_DESCRIPTION_MAX_LENGTH,null=True,blank=True)
    content = RichTextUploadingField()
    image = models.ImageField(upload_to='blog_image',blank=True)
    likes = models.ManyToManyField(User,blank=True, related_name='blogpost_like')
    tags = TaggableManager()
    writer = models.ForeignKey(User,null=True, blank=True, on_delete=models.SET_NULL)
    public = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    views = models.IntegerField(default=0)
    video = models.CharField(max_length = medium_len,blank=True,null=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = unique_slug(self, slugify(self.title))
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse("blog-single", kwargs={"slug": self.slug})

    class Meta:
       ordering = ['-created_at']

    def number_of_likes(self):
        return self.likes.count()
    
    def get_tag_names(self):
        return self.tags.names()
    
    def __str__(self):
        return self.title
    
class ControlledBlogs(models.Model):
    suggested_blogs = models.ManyToManyField(GyaaniBlog,related_name="controlled_suggested_blogs")
    suggested_tags = models.ManyToManyField(Tag,related_name="controlled_suggested_tags")
    

    def __str__(self):
        return "Dont create any more objects. Click me to update top,suggested blogs"


class BlogDemand(models.Model):
    title = models.CharField(max_length=settings.BLOG_TITLE_MAX_LENGTH,blank=False,null=False,unique=True)
    votes = models.ManyToManyField(User,blank=True, related_name='blogdemand_vote')
    writer = models.ForeignKey(User,null=False, blank=False, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def number_of_votes(self):
        return self.votes.count()

    def __str__(self):
        return self.title



##########################################
#                OLD
##########################################
# Create your models here.


class Blog_tag_new(models.Model):
    tag_word = models.CharField(max_length = medium_len,unique = True)

    def __str__(self):
        return self.tag_word

    # def get_absolute_url(self):
    #     return reverse('name_blog_tag',args=[self.tag_word])

class Gyaani_Blogs_new(models.Model):
    gb_id = models.AutoField(primary_key=True)
    datetime = models.DateTimeField(default = timezone.now)
    writer = models.ForeignKey(Writer, on_delete=models.CASCADE, blank = False)
    views = models.IntegerField(default=0)
    description = models.TextField(default='Description')
    category = models.CharField(max_length = medium_len)
    title = models.TextField(default='Title')
    slug = models.SlugField(max_length=255, blank=True, default ='defaultslug')
    content = models.TextField(default='content')
    headline = models.TextField(default='headline')
    image = models.ImageField(upload_to='blog_image')
    blog_tags = models.ManyToManyField(Blog_tag_new)

  
    def save(self, *args, **kwargs):
        if self.slug == "" or self.slug is None:
            slug = slugify(strip_tags(self.title))
            if Gyaani_Blogs_new.objects.filter(slug=slug).exists():
                slug = slugify(self.title+'-'+uuid4().hex)
            self.slug = slug
            super(Gyaani_Blogs_new, self).save(*args, **kwargs)
        else:
            super(Gyaani_Blogs_new, self).save(*args, **kwargs)
        try:
            ping_google(sitemap_url='/sitemap.xml')
        except Exception:
            print("============================Exception Occured!!!!================================")
            pass
    
    def __str__(self):
        return self.writer.name + " : " +strip_tags(self.title)

    # def get_blogsingle_url(self):
    #     return reverse('name_blog-single',args=[self.category,self.slug])

    # def get_blogwriter_url(self):
    #     return reverse('name_blog-writername',args=[self.writer])

    # def get_blogcategory_url(self):
    #     return reverse('name_blog-category',args=[self.category])



@receiver(models.signals.post_delete, sender=Gyaani_Blogs_new)
def remove_file_from_s3(sender, instance, using, **kwargs):
    instance.image.delete(save=False)