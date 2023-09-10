from django.shortcuts import render, redirect

# This decorator is used to check wether the current user has a complete profile or no


def Profile_complete_check(view_func):
    def wrapper_func(request, *args, **kwargs):
        if request.user.is_authenticated:
            user = request.user
            if user.profile_complete == False:
                return redirect('Detail_Registration')
            else:
                return view_func(request, *args, **kwargs)
        else:
            return view_func(request, *args, **kwargs)
    return wrapper_func
