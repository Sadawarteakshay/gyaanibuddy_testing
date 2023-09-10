from django.shortcuts import render, redirect, HttpResponse
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import User
from .forms import UserUpdateForm
# from quiz.models import Quiz, Response, Score, Question
from GyaaniAssignment.models import Assignment
from GyaaniBlog.models import GyaaniBlog
from .decorators import Profile_complete_check
from django.core.paginator import Paginator
from django.db.models import Q
from django.views.generic import ListView, UpdateView
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.urls import reverse
import json
from django.shortcuts import get_object_or_404
from django.db.models import Sum, Count
from django.conf import settings
from GyaaniBuddy.models import Institute
from operator import attrgetter

# Create your views here.

# Not using now


# def Home(request):
#     return render(request, 'custom/home-page.html')
# # return HttpResponse("Home Page.")

# # This page has content of quiz module so commenting it


# # Not using now
# @login_required
# @Profile_complete_check
# def UserHome(request):
#     return render(request, 'custom/user-home-page.html')

# class UserDetailsUpdate(LoginRequiredMixin, UserPassesTestMixin, BSModalCreateView):
#     model = User
#     template_name = 'main/user_profile_page/#editintroModal.html'
#     form_class = UserUpdateForm

#     def test_func(self):
#         if self.request.user == User.objects.get(slug=self.kwargs.get('slug')):
#             return True
#         return False

#     def get_form(self, form_class=None):
#         form = super().get_form(form_class=form_class)
#         form.fields['institute'].required = True
#         return form

#     def form_valid(self, form):
#         messages.success(self.request, "Details updated successfully",
#                          extra_tags="account_updated")
#         return super().form_valid(form)

#     def get_context_data(self, **kwargs):
#         context = super().get_context_data(**kwargs)
#         context['current_institute'] = super().get_object().institute
#         return context

#     def get_success_url(self):
#         return reverse('update_user', kwargs={'slug': self.kwargs.get('slug')})


# class UserDetail(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
#     model = User
#     template_name = 'custom/user_details_registration.html'
#     fields = ['first_name', 'last_name', 'phone_number', 'institute',
#               'linkedin_link', 'facebook_link', 'instagram_link', 'about_me', 'profile_image']

#     def test_func(self):
#         if self.request.user == User.objects.get(slug=self.kwargs.get('slug')):
#             return True
#         return False

#     def get_success_url(self):
#         return reverse('user-update', kwargs={'slug': self.kwargs.get('slug')})


@login_required
def UserDetailRegistration(request):
    user = request.user
    if request.method == 'POST':
        user.first_name = request.POST['first_name']
        user.last_name = request.POST['last_name']
        user.school_name = request.POST['school_name']
        user.college_name = request.POST['college_name']
        user.institute = request.POST['institute']
        user.user_type = request.POST['user_type']
        user.phone_number = request.POST['phone_number']
        user.about_me = request.POST['about_me']
        user.profile_complete = True
        user.save()
        # return redirect('user-home')
        return redirect('name_index')

    return render(request, 'custom/user_details_registration.html')


def dashboard(request):
    # return redirect('user-search')
    if request.user.is_authenticated:
        return redirect('user-profile', request.user.slug)
    return render(request, 'custom/dashboard.html')


def userProfile(request, slug):
    if request.method=='POST':
        # print(request.POST)
        user = request.user
        user.first_name = request.POST['first_name']
        user.last_name = request.POST['last_name']
        user.institute = Institute.objects.get(name=request.POST['institute']) or None
        user.email = request.POST['email']
        user.phone_number = request.POST.get('phone_number','9123564529')
        user.about_me = request.POST.get('about_me','Student')
        if request.FILES and request.FILES['profile_image']:
            user.profile_image = request.FILES['profile_image']
        user.linkedin_link = request.POST.get('linkedin_link','')
        user.facebook_link = request.POST.get('facebook_link','')
        user.instagram_link = request.POST.get('instagram_link','')

        user.save()
        # print("views mein Post request aaya")
        # user_form = UserUpdateForm(request.POST,instance=request.user)
        # print(user_form)
        # print("----------------------------------------------------------")
        
        
        # print("ab user hoga ")
        # print(request.user)
        # if user_form.is_valid():
        #     user_form.save()
        #     print("views mein valid hai form")
        #     messages.success(request,'Your Profile has been updated!')
        #     return redirect('user-profile', request.user.slug)
    # else:
        # user_form = UserUpdateForm(instance=request.user)
    user = get_object_or_404(User, slug=slug)
    # quizzes = user.quizzes_attempted.all()
    # score_list = list()
    # for quiz in quizzes:
    #     raw_rank_list = Score.objects.filter(quiz=quiz)
    #     rank_list = sorted(
    #         [rank.score for rank in raw_rank_list], reverse=True)
    #     score = Score.objects.get(user=user, quiz=quiz).score
    #     rank = rank_list.index(score)+1
    #     score_list.append([quiz.id, quiz.quiz_name+" " + quiz.subject.subject_name + " " +
    #                        quiz.subject.branch.branch_name, score, rank])
    # question_list = Question.objects.filter(creator=user)
    # quiz_list = Quiz.objects.filter(creator=user)
    contributed_assignments = Assignment.objects.filter(
        writers=user, parent_assignment__isnull=False).order_by('date_added')
    published_blogs = GyaaniBlog.objects.filter(writer=user).order_by('updated_at')
    views = 0
    # try:
    #     views += Assignment.objects.filter(
    #         writers=user, parent_assignment__isnull=True).aggregate(Sum("views"))['views__sum']
    # except:
    #     pass
    try:
        views += published_blogs.aggregate(Sum("views"))['views__sum']
    except:
        pass
    likes = 0
    try:
        likes += published_blogs.annotate(num_likes=Count("likes")
                                          ).aggregate(Sum('num_likes'))['num_likes__sum']
    except:
        pass
    blog_points = 0
    blog_points += views//settings.VIEWS_PER_POINT
    blog_points += settings.POINTS_PER_LIKE*likes

    assignment_points = 0
    try:
        assignment_points += contributed_assignments.filter(is_accepted=True).aggregate(Sum("points"))[
            'points__sum']
    except:
        pass
    # insti_list = Institute.objects.all()
    list_of_institute_dictionaries = list(Institute.objects.all().values())
    list_of_institutes = [list_of_institute_dictionaries[i]['name'] for i in range(len(list_of_institute_dictionaries))]
    list_of_institutes = json.dumps(list_of_institutes)
    # print(list_of_institutes)
    context = {
        # 'score_list': score_list,
        # 'question_list': question_list,
        # 'quiz_list': quiz_list,
        'contributed_assignments': contributed_assignments,
        'published_blogs': published_blogs,
        'user': user,
        'rewards': {'points': blog_points+assignment_points, 'blog_points': blog_points, 'assignment_points': assignment_points},
        'institute_list' : Institute.objects.all(),
        'list_of_institutes' : list_of_institutes
    }
    # print(context['institute_list'][::1])
    context['followed'] = True if user.followers.filter(
        id=request.user.id).exists() else False
    if len(published_blogs) == 0:
        context['flag5'] = True
    else:
        context['flag5'] = False
    if len(contributed_assignments) == 0:
        context['flag4'] = True
    else:
        context['flag4'] = False
    # if len(quiz_list) == 0:
    #     context['flag3'] = True
    # else:
    #     context['flag3'] = False
    # if len(question_list) == 0:
    #     context['flag2'] = True
    # else:
    #     context['flag2'] = False
    # if len(quizzes) == 0:
    #     context['flag'] = True
    # else:
    #     context['flag'] = False
    
    return render(request, 'main/user_profile_page.html', context=context)

# Not using now


def userSearch(request):
    users = User.objects.all()
    if request.method == 'GET':
        name = request.GET.get('user_search')
        if name != '' and name is not None:
            users = users.filter(Q(username__icontains=name) | Q(
                first_name__icontains=name) | Q(last_name__icontains=name)).distinct()
    paginator = Paginator(users, 25)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    context = {
        'users': page_obj
    }
    return render(request, 'custom/user_search.html', context=context)


@ login_required
def userFollow(request, slug):
    user = User.objects.get(slug=slug)
    response = {}
    if request.method == 'POST':
        if user.followers.filter(id=request.user.id).exists():
            user.followers.remove(request.user)
            request.user.following.remove(user)
            response['action'] = 'unfollow'
        else:
            user.followers.add(request.user)
            request.user.following.add(user)
            response['action'] = 'follow'
    # return redirect('user-profile', user.slug)
    return HttpResponse(json.dumps(response), content_type="application/json")


class UserFollowers(ListView):
    model = User
    template_name = 'main/user_network.html'
    paginate_by = 10
    context_object_name = 'following'
    
    def get_queryset(self):
        user_following = User.objects.get(slug=self.kwargs.get('slug')).following.all()
        return user_following
    
    def get_context_data(self, **kwargs):
        context = super(UserFollowers, self).get_context_data(**kwargs)
        context['followers'] = User.objects.get(slug=self.kwargs.get('slug')).followers.all()
        # Add any other variables to the context here
        return context

class UserLeaderboard(ListView):
    model = User
    template_name = 'main/user_leaderboard.html'
    context_object_name = 'users'
    paginate_by = 10

    def calculate_assignment_points(self,user):
        contributed_assignments = Assignment.objects.filter(writers=user, parent_assignment__isnull=False)
        assignment_points = 0
        try:
            assignment_points += contributed_assignments.filter(is_accepted=True).aggregate(Sum("points"))['points__sum']
        except:
            pass
        return assignment_points

    def calculate_blog_points(self,user):
        published_blogs = GyaaniBlog.objects.filter(writer=user).order_by('updated_at')
        views = 0
        try:
            views += published_blogs.aggregate(Sum("views"))['views__sum']
        except:
            pass
        likes = 0
        try:
            likes += published_blogs.annotate(num_likes=Count("likes")
                                            ).aggregate(Sum('num_likes'))['num_likes__sum']
        except:
            pass
        blog_points = 0
        blog_points += views//settings.VIEWS_PER_POINT
        blog_points += settings.POINTS_PER_LIKE*likes
        return blog_points

    def calculate_total_points(self,user):
        total_points = self.calculate_assignment_points(user) + self.calculate_blog_points(user)
        return total_points

    def get_queryset(self):
        all_users = User.objects.all()
        for user in all_users:
            user.assignment_points=self.calculate_assignment_points(user)
            user.blog_points=self.calculate_blog_points(user)
            user.total_points=self.calculate_total_points(user)
        all_users_total_points = sorted(all_users, key=attrgetter('total_points'))
        all_users_total_points = list(reversed(all_users_total_points))
        users_assignment_points = sorted(all_users, key=attrgetter('assignment_points'))
        users_assignment_points = list(reversed(users_assignment_points))
        users_blog_points = sorted(all_users, key=attrgetter('blog_points'))
        users_blog_points = list(reversed(users_blog_points))
        # page = self.request.GET.get('page')
        # index = paginator.page_range.index(blogs.number)
        # max_index = len(paginator.page_range)
        # start_index = index - 3 if index >= 3 else 0
        # end_index = index + 3 if index <= max_index - 3 else max_index
        # page_range = paginator.page_range[start_index:end_index]
        tab = self.request.GET.get('tab')
        if tab=='overall':
            return all_users_total_points
        elif tab=='assignment':
            return users_assignment_points
        elif tab=='blog':
            return users_blog_points
        else:
            return all_users_total_points
        # all_users.order_by('assignment_points')
        # ]all_users = User.objects.annotate(assignment_points=self.calculate_assignment_points('id')).order_by('-assignment_points')
        # print(len(all_users))
    
    def get_context_data(self, **kwargs):
        context = super(UserLeaderboard, self).get_context_data(**kwargs)
        context['currTab'] = self.request.GET.get('tab')
        all_users = User.objects.all()
        currentuser = self.request.user
        i = 0 
        j = 0
        k = 0
        for user in all_users:
            user.assignment_points=self.calculate_assignment_points(user)
            user.blog_points=self.calculate_blog_points(user)
            user.total_points=self.calculate_total_points(user)
        all_users_total_points = sorted(all_users, key=attrgetter('total_points'))
        all_users_total_points = list(reversed(all_users_total_points))
        users_assignment_points = sorted(all_users, key=attrgetter('assignment_points'))
        users_assignment_points = list(reversed(users_assignment_points))
        users_blog_points = sorted(all_users, key=attrgetter('blog_points'))
        users_blog_points = list(reversed(users_blog_points))
        for user in all_users_total_points:
            i += 1
            if user == currentuser:
                currentuser.total_points=self.calculate_total_points(user)
                break
        for user in users_assignment_points:
            j += 1
            if user == currentuser:
                currentuser.assignment_points=self.calculate_assignment_points(user)
                break
        for user in users_blog_points:
            k += 1
            if user == currentuser:
                currentuser.blog_points=self.calculate_blog_points(user)
                break
        context['curruserranktotal'] = i
        context['curruserrankassignment'] = j
        context['curruserrankblog'] = k
        context['curruser'] = currentuser
        # Add any other variables to the context here
        return context

    # def get_context_data(self, **kwargs):
    #     context = super(UserLeaderboard, self).get_context_data(**kwargs)
    #     all_users = User.objects.all()
    #     for user in all_users:
    #         user.assignment_points=self.calculate_assignment_points(user)
    #         user.blog_points=self.calculate_blog_points(user)
    #         user.total_points=self.calculate_total_points(user)
    #     users_assignment_points = sorted(all_users, key=attrgetter('assignment_points'))
    #     context['all_users_assignment_points'] = list(reversed(users_assignment_points))
    #     users_blog_points = sorted(all_users, key=attrgetter('blog_points'))
    #     context['all_users_blog_points'] = list(reversed(users_blog_points))
    #     # self.paginate_by = self.get_paginate_by(queryset)
    #     paginator = context['paginator']
    #     page_numbers_range = 2  # Display 5 page numbers
    #     max_index = len(paginator.page_range)
    #     page = self.request.GET.get('page')
    #     current_page = int(page) if page else 1
    #     start_index = int((current_page - 1) / page_numbers_range) * page_numbers_range
    #     end_index = start_index + page_numbers_range
    #     if end_index >= max_index:
    #         end_index = max_index
    #     page_range = paginator.page_range[start_index:end_index]
    #     context['page_range'] = page_range
    #     self.paginate_by = 2
    #     return context


class UserFollowing(ListView):
    model = User
    template_name = 'custom/user_following.html'
    paginate_by = 10
    context_object_name = 'followers'

    def get_queryset(self):
        return User.objects.get(slug=self.kwargs.get('slug')).following.all()
