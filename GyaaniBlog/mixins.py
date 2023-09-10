from django.shortcuts import redirect
from .models import GyaaniBlog
from django.core.exceptions import PermissionDenied
from django.http import Http404


# Checks if request.user is itself blog's writer
class BlogWriterMixin():
    def dispatch(self, request, *args, **kwargs):
        blog = super().get_object()
        if blog:
            if self.request.user and blog.writer == request.user:
                return super().dispatch(request, *args, **kwargs)
        
        raise PermissionDenied

class CheckIfBlogPublicMixin():
    def dispatch(self, request, *args, **kwargs):
        blog = super().get_object()
        if blog and (blog.public or (self.request.user and self.request.user == blog.writer)):
            return super().dispatch(request, *args, **kwargs)

        raise Http404("No such blog exist")