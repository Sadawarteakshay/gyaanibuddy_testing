import captcha
from django import forms
from .models import GyaaniBlog
from captcha.fields import ReCaptchaField

# class GyaaniBlogForm(forms.ModelForm):
#     products = forms.ModelMultipleChoiceField(
#         queryset=GyaaniBlog.objects.all(),
#         required=False,
#         widget=FilteredSelectMultiple(
#         verbose_name=_('Blogs'),
#         is_stacked=False
#         )
#     )

#     class Meta:
#         model = GyaaniBlog
#         fields = [
#             'title'
#             'short_description'
#             'content'
#             'tags'
#         ]


class BlogForm(forms.ModelForm):
    captcha = ReCaptchaField()

    class Meta:
        model = GyaaniBlog
        fields = [
            'title',
            'short_description',
            'content',
            'tags',
            'image',
            'public',
            'captcha',
            'video',
        ]
