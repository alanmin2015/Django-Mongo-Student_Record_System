from django.urls import path
from . import views

urlpatterns=[
    path('add/', views.add_student, name='add_student'),
    path('', views.get_all_student, name='get_all_student'),
    path('delete_student/<str:student_id>/', views.delete_student, name='delete_student'),
    path('update_student/<str:student_id>/', views.update_student, name='update_student'),
]