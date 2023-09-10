from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views


urlpatterns = [
    path('',views.BlogList.as_view(),name="name_blog"),
    path('blog-create/',views.BlogCreate.as_view(),name="blog-create"),
    path('blog-edit/<slug:slug>/',views.BlogEdit.as_view(),name="blog-edit"),
    path('blog-like/<slug:slug>/', views.blog_like, name="blog_like"),

    path('blog-demand/', views.BlogDemandList.as_view(), name="blog-demand-list"),
    path('blog-demand-create/',views.BlogDemandCreate.as_view(),name="blog-demand-create"),
    path('blog-demand-vote/<int:id>/', views.blog_demand_vote, name="blog-demand-vote"),

    path('<slug:slug>/',views.BlogSingle.as_view(),name="blog-single"),
    path("delete/<slug>",views.BlogDelete.as_view(),name="blog-delete")
    
]

if settings.DEBUG:
    urlpatterns+=static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    


