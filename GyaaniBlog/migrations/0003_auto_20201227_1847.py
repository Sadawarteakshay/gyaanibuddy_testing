# Generated by Django 3.0 on 2020-12-27 13:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('GyaaniBlog', '0002_gyaani_blogs_new_slug'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gyaani_blogs_new',
            name='slug',
            field=models.SlugField(blank=True, default='defaultslug', max_length=255),
        ),
    ]
