# Generated by Django 2.2.10 on 2021-02-20 14:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_auth', '0004_auto_20210127_1839'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='about_me',
            field=models.CharField(default='', max_length=200),
        ),
        migrations.AddField(
            model_name='user',
            name='facebook_link',
            field=models.CharField(default='https://www.facebook.com/GyaaniBuddyFB/', max_length=100),
        ),
        migrations.AddField(
            model_name='user',
            name='instagram_link',
            field=models.CharField(default='https://www.instagram.com/gyaanibuddy/?hl=en', max_length=100),
        ),
        migrations.AddField(
            model_name='user',
            name='linkedin_link',
            field=models.CharField(default='https://in.linkedin.com/company/gyaani-buddy', max_length=100),
        ),
    ]
