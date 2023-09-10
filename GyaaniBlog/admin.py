from django.contrib import admin
from .models import *
from django.db import models
from tinymce.widgets import TinyMCE
# Register your models here.

################### New

@admin.register(GyaaniBlog)
class GyaaniBlogAdmin(admin.ModelAdmin):
    list_display = ('slug' ,'writer','updated_at')
    list_filter = ('writer__username','updated_at')
    filter_vertical = ('likes',)
    search_fields = ('title',)
    # fields = ('title',)


@admin.register(ControlledBlogs)
class ControlledBlogsAdmin(admin.ModelAdmin):
    filter_vertical = ('suggested_blogs', 'suggested_tags')


@admin.register(BlogDemand)
class BlogDemandAdmin(admin.ModelAdmin):
    list_display = ('title' ,'writer','updated_at')
    list_filter = ('updated_at','writer__username')
    search_fields = ('title',)



##################### OLD

# class Gyaani_Blogs_newAdmin(admin.ModelAdmin):
#     filter_vertical = ('blog_tags',)
#     formfield_overrides = {
#         models.TextField: {'widget': TinyMCE()},
#     }


# admin.site.register(Gyaani_Blogs_new, Gyaani_Blogs_newAdmin)
# admin.site.register(Blog_tag_new)