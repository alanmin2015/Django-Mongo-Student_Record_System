from django.urls import path
from . import views

urlpatterns=[
    path('add/', views.add_student, name='add_student'),
    path('get_all_student/', views.get_all_student, name='get_all_student'),
    path('delete_student/<str:student_id>/', views.delete_student, name='delete_student'),
    path('update_student/<str:student_id>/', views.update_student, name='update_student'),
    path('get_student/<str:student_id>/', views.get_student_by_id, name='get_student_data'),
    path('detail/<str:student_id>/', views.student_detail, name='student_detail'),
]