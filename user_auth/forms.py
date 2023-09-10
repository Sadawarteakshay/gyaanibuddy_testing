from .models import User
from django import forms
from django.forms import ModelForm
from GyaaniBuddy.models import Institute


class DataListWidget(forms.TextInput):
    def __init__(self, data_list, name, *args, **kwargs):
        super(DataListWidget, self).__init__(*args, **kwargs)
        self._name = name
        self._list = data_list
        self.attrs.update({'list': f'list__{self._name}'})

    def render(self, name, value, attrs=None, renderer=None):
        text_html = super(DataListWidget, self).render(
            name, value, attrs=attrs)
        data_list = f'<datalist id="list__{self._name}">'
        for item in self._list:
            data_list += f'<option value="{item.id}">{item.name}</option>'
        data_list += '</datalist>'
        return (text_html+data_list)


class UserUpdateForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'phone_number', 'institute',
                  'linkedin_link', 'facebook_link', 'instagram_link', 'about_me', 'profile_image']

    def __init__(self, *args, **kwargs):
        institute_list = Institute.objects.all()
        super(UserUpdateForm, self).__init__(*args, **kwargs)
        self.fields['institute'].widget = DataListWidget(
            data_list=institute_list, name="institute_list")
