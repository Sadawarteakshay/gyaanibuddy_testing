from django.urls import path, include
from . import views

urlpatterns = [
    # path('', views.Home, name='home'),
    # path('user-home', views.UserHome, name='user-home'),
    path('user-dashboard', views.dashboard, name='user-dashboard'),
    path('user-profile/<slug>', views.userProfile, name='user-profile'),
    path('user-follow/<slug>', views.userFollow, name="user-follow"),
    path('user-followers/<slug>',
         views.UserFollowers.as_view(), name="user-followers"),
    path('user-following/<slug>',
         views.UserFollowing.as_view(), name="user-following"),
    path('user-search', views.userSearch, name='user-search'),
    path('user-leaderboard/<slug>',views.UserLeaderboard.as_view(), name="user-leaderboard"),
    #     path('user_auth/Detail-Registration/<slug>',
    #          views.UserDetail.as_view(), name='Detail_Registration'),
#     path('user_auth/update_user/<slug>',
     #     views.UserDetailsUpdate.as_view(), name='update_user')
]
