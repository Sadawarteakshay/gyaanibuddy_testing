from django.db import models
from django.contrib.auth.models import AbstractUser
from uuid import uuid4
from django.template.defaultfilters import default, slugify
from django.shortcuts import reverse
from PIL import Image
from django.dispatch import receiver
from django.db.models.signals import pre_save
import os
from .utils import removeKey
from GyaaniBuddy.models import Institute
# Create your models here.


def path_and_rename(instance, filename):
    ext = filename.split('.')[-1]
    filename2 = '{}.{}'.format(instance.email, ext)
    return 'profile_image/{}'.format(filename2)


class User(AbstractUser):
    # personal info
    username = models.CharField(max_length=256, unique=True)
    first_name = models.CharField(max_length=256, blank=True, null=True)
    last_name = models.CharField(max_length=256, blank=True, null=True)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=256, blank=True, null=True)
    profile_image = models.ImageField(
        upload_to=path_and_rename, null=True, blank=True)
    # education/work
    institute = models.ForeignKey(
        Institute, null=True, on_delete=models.SET_NULL)
    # quiz info
    # quiz_limit = models.IntegerField(default=10)
    # quizzes_attempted = models.ManyToManyField('quiz.Quiz', blank=True)
    # cur_quiz = models.IntegerField(default=0, null=True, blank=True)
    # authority
    is_gyaanibuddy_admin = models.BooleanField(default=False)
    profile_complete = models.BooleanField(default=False)
    slug = models.SlugField(blank=True, null=True)
    followers = models.ManyToManyField(
        'self', null=True, blank=True, related_name="user_followers", symmetrical=False)
    following = models.ManyToManyField(
        'self', null=True, blank=True, related_name="user_following", symmetrical=False)

    facebook_link = models.CharField(
        max_length=100, blank=True, null=True)
    linkedin_link = models.CharField(
        max_length=100, blank=True, null=True)
    instagram_link = models.CharField(
        max_length=100, blank=True, null=True)
    about_me = models.CharField(
        max_length=200, blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.institute:
            self.profile_complete = True
        else:
            self.profile_complete = False
        if self.slug == "" or self.slug is None:
            if self.username == "" or self.username is None:
                self.slug = slugify(uuid4().hex)
            else:
                slug = slugify(self.username)
                if User.objects.filter(slug=slug).exists():
                    slug = slugify(self.username+uuid4().hex)
                self.slug = slug[:50]
            super(User, self).save(*args, **kwargs)
        else:
            super(User, self).save(*args, **kwargs)
        # if self.profile_image:
        #     img = Image.open(self.profile_image.path)
        #     if img.width > 300 or img.height > 300:
        #         img.thumbnail((300, 300))
        #         img.save(self.profile_image.path)

    # def get_absolute_url(self):
    #     return reverse("user-profile", kwargs={"slug": self.slug})

    def get_follower_count(self):
        return self.followers.count()

    def get_following_count(self):
        return self.following.count()

    def __str__(self):
        return self.username


@receiver(pre_save, sender=User)
def delete_old_profile_image(sender, instance, **kwargs):
    if instance._state.adding and instance.pk:
        return False
    try:
        old_image = sender.objects.get(pk=instance.pk).profile_image if sender.objects.get(
            pk=instance.pk).profile_image else None
    except:
        return False
    image = instance.profile_image
    if sender.objects.get(pk=instance.pk).profile_image and not image == old_image:

        removeKey(old_image)
