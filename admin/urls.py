from django.urls import path
from . import views

urlpatterns = [
    path('userlist/', views.get_userlist, name='userlist'),
    path('delete_user/<str:user_id>/', views.delete_user, name='deleteuser'),
    path('update_user/<str:user_id>/', views.update_user, name='update_user'),
]
