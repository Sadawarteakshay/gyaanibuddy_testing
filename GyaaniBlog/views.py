from django.shortcuts import render, redirect
from django.http import HttpResponse, request
from django.views.generic import *
from .models import GyaaniBlog, ControlledBlogs, BlogDemand
from django.shortcuts import get_object_or_404
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from .mixins import BlogWriterMixin, CheckIfBlogPublicMixin
from django_filters.views import FilterView
from .filters import BlogListFilter
import json
from django.contrib.auth.decorators import login_required
from django.db.models import Count, Q, Case, BooleanField, Value, When
from GyaaniBuddy.utils import increment_views
from .forms import BlogForm

def getPageDataObject(keywords="", author="gyaanibuddy",page_type="",page_title="",published_time="",modified_time="",image_array=[],tags=[]):
    return {
        'keywords': keywords,
        'author': author,
        'page_type': page_type,
        'page_title': page_title,
        'published_time': published_time,
        'modified_time': modified_time,
        'image_array':image_array,
        'tags':tags
    }

def getSuggestedTags():
    c = ControlledBlogs.objects.all().first()
    return  [str(t) for t in c.suggested_tags.all()]

class BlogList(FilterView):
    model = GyaaniBlog
    template_name = 'blog/blog-list.html'
    paginate_by = 8
    context_object_name = 'blog_list'
    filterset_class = BlogListFilter

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return GyaaniBlog.objects.filter(Q(public=True) | Q(writer=self.request.user))
        return GyaaniBlog.objects.filter(public=True)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['controlled_blogs'] = ControlledBlogs.objects.all().first()
        context['page'] = getPageDataObject(
            keywords="gyaanibuddy,blogs,trending",
            author="Gyaanibuddy",
            page_type="blog",
            page_title="List of Blogs",
            image_array=[b.image.url if b.image else "" for b in context['blog_list']]
        )
        return context


class BlogSingle(CheckIfBlogPublicMixin, DetailView):
    model = GyaaniBlog
    context_object_name = 'blog_data'
    template_name = "blog/blog-single.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        blog = super().get_object()

        increment_views(blog)

        context['liked'] = True if blog.likes.filter(
            id=self.request.user.id).exists() else False
        context['number_of_likes'] = blog.number_of_likes()
        context['tag_list'] = blog.get_tag_names()
        context['controlled_blogs'] = ControlledBlogs.objects.all().first()
        
        context['page'] = getPageDataObject(
            keywords="",
            author=blog.writer,
            page_type="blog",
            page_title=blog.title,
            published_time=blog.created_at,
            modified_time=blog.updated_at,
            image_array=[blog.image.url if blog.image else ""],
            tags=blog.get_tag_names()
        )
        return context


class BlogCreate(LoginRequiredMixin, CreateView):
    model = GyaaniBlog
    template_name = 'blog/blog-create.html'
    context_object_name = 'blog'
    form_class=BlogForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        context['page'] = getPageDataObject(
            keywords="Create a blog," + ','.join(getSuggestedTags()),
            page_type="blog",
            page_title="Create a blog here!",
            image_array=[],
            tags=getSuggestedTags()
        )
        return context

    def get_form(self, form_class=None):
        form = super().get_form(form_class=form_class)
        form.fields['title'].required = True
        return form

    def form_valid(self, form):
        form.instance.writer = self.request.user
        return super().form_valid(form)

    def get_success_url(self):
        return reverse('blog-single', kwargs={'slug': self.object.slug})


class BlogEdit(LoginRequiredMixin, BlogWriterMixin, UpdateView):
    model = GyaaniBlog
    template_name = 'blog/blog-create.html'
    context_object_name = 'blog'
    fields = [
        'title',
        'short_description',
        'content',
        'tags',
        'image',
        'public',
        'video',
    ]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        context['page'] = getPageDataObject(
            keywords="Create a blog," + ','.join(getSuggestedTags()),
            page_type="blog",
            page_title="Edit your blog here!",
            image_array=[],
            tags=getSuggestedTags()
        )
        return context

    def get_success_url(self):
        return reverse('blog-single', kwargs={'slug': self.object.slug})
    

class BlogDelete(LoginRequiredMixin,UserPassesTestMixin,DeleteView):
    model=GyaaniBlog
    context_object_name="blog"
    
    def test_func(self):
        blog=self.get_object()
        if self.request.user==blog.writer:
            return True
        return False
    
    def get(self, request, *args, **kwargs):
        return self.post(request, *args, **kwargs)
    
    def get_success_url(self):
        return reverse("name_blog")

class BlogDemandList(ListView):
    model = BlogDemand
    template_name = 'blog/blog-demand.html'
    paginate_by = 10

    def get_queryset(self):
        if self.request.user.is_authenticated == False:
            return BlogDemand.objects.annotate(liked=Case(
                When(id=-1, then=Value(False)),
                default=Value(False),
                output_field=BooleanField()
            ), vote_count=Count('votes')).order_by('-vote_count').prefetch_related('votes')

        return BlogDemand.objects.annotate(liked=Case(
            When(votes__id__contains=self.request.user.id, then=Value(True)),
            default=Value(False),
            output_field=BooleanField()
        ), vote_count=Count('votes')).order_by('-vote_count').prefetch_related('votes')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        context['page'] = getPageDataObject(
            keywords="Demand a blog," + ','.join(getSuggestedTags()),
            page_type="blog",
            page_title="Request your desired topic for a blog here!",
            image_array=[],
            tags=getSuggestedTags()
        )
        return context


class BlogDemandCreate(LoginRequiredMixin, CreateView):
    model = BlogDemand
    template_name = 'blog/blog-demand-create.html'
    context_object_name = 'blog'
    fields = [
        'title',
    ]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        context['page'] = getPageDataObject(
            keywords="Create a blog," + ','.join(getSuggestedTags()),
            page_type="blog",
            page_title="Create a blog-demand here!",
            image_array=[],
            tags=getSuggestedTags()
        )
        return context

    def form_valid(self, form):
        form.instance.writer = self.request.user
        return super().form_valid(form)

    def get_success_url(self):
        return reverse('blog-demand-list')


@login_required
def blog_like(request, slug):
    response_data = {}
    if request.method == "POST":
        blog = get_object_or_404(GyaaniBlog, slug=slug)

        response_data['title'] = blog.title
        if blog.likes.filter(id=request.user.id).exists():
            blog.likes.remove(request.user)
            response_data['action'] = 'Dislike'
        else:
            response_data['action'] = 'Like'
            blog.likes.add(request.user)
        response_data['number_of_likes'] = blog.number_of_likes()
    return HttpResponse(json.dumps(response_data), content_type="application/json")


@login_required
def blog_demand_vote(request, id):
    response_data = {}
    if request.method == "POST":
        blog_demand = get_object_or_404(BlogDemand, id=id)

        response_data['title'] = blog_demand.title
        if blog_demand.votes.filter(id=request.user.id).exists():
            blog_demand.votes.remove(request.user)
            response_data['action'] = 'Dislike'
        else:
            response_data['action'] = 'Like'
            blog_demand.votes.add(request.user)
        response_data['number_of_votes'] = blog_demand.number_of_votes()
    return HttpResponse(json.dumps(response_data), content_type="application/json")
