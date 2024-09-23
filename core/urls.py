from django.urls import path
from .views import login_view, logout_view, register,forgot_password, reset_password

urlpatterns = [
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('register/', register, name='register'), 
    path('reset-password/<uidb64>/<token>/', reset_password, name='reset_password'),
    path('forgetpassword/', forgot_password, name='forgot_password'),
]
