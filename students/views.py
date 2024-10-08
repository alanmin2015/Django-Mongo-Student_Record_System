import datetime
import random
from django.http import JsonResponse
from django.shortcuts import render, redirect
import gridfs
from .models import student_collection
from bson import ObjectId
from db_connection import db
from django.contrib import messages

#Generate the studentID based on current date and a random 3-digit number
def generate_student_id():
    today_date_str=datetime.datetime.now().strftime("%y%m%d")

    random_number=random.randint(100,999)
    student_id=f"{today_date_str}{random_number}"
    return student_id

#Handle for duplicate ID
def generate_unique_student_id():
    while True:
        student_id = generate_student_id()
        # Check if this ID already exists in the collection
        if not student_collection.find_one({'_id': student_id}):
            return student_id  
        
# Add a student
def add_student(request):
    if request.method == 'POST':
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        gender=request.POST.get('gender')
        grade=request.POST.get('grade')
        score=request.POST.get('score')

        student_id=generate_unique_student_id()

        records = {
            "_id": student_id,
            "first_name": first_name,
            "last_name": last_name,
            "gender": gender,
            "grade": grade,
            "score": score,
            "created_date": datetime.datetime.now(), 
            "updated_date": datetime.datetime.now(), 

        }
        student_collection.insert_one(records)
        return redirect('get_all_student')
    
# Search for a student by ID
def get_student_by_id(request, student_id):
    if request.method == 'GET':
        student = student_collection.find_one({'_id': student_id})
        if student:
            if 'photo' in student and isinstance(student['photo'], ObjectId):
                student['photo'] = str(student['photo'])
            print('student',student)
            return JsonResponse({'status': 'success', 'student': student})
        else:
            return JsonResponse({'status': 'error', 'message': 'Student not found'}, status=404)
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)

# Display all students
def get_all_student(request):
    if 'user_id' not in request.session:
        return redirect('/user/login') 
    
    students = student_collection.find()
    
    # Convert MongoDB cursor to list for rendering in template
    student_list = []
    for student in students:
        student['id'] = str(student['_id']) 
        student_list.append(student)
    
    return render(request, 'studentList.html', {'students': student_list})


# Delete a student
def delete_student(request, student_id):
    if request.method=='POST':
        student_collection.delete_one({'_id': student_id})
        return redirect('get_all_student')
    
# Update a student
def update_student(request, student_id):
    if request.method=='POST':
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        gender = request.POST.get('gender')
        grade = request.POST.get('grade')
        score = request.POST.get('score')

        student_data={
            'first_name': first_name,
            'last_name':last_name,
            'gender':gender,
            'grade':grade,
            'score':score,
            }

    #Upload photo
        if 'photo' in request.FILES:
            fs = gridfs.GridFS(db)
            photo=request.FILES['photo']
            photo_id=fs.put(photo, filename=photo.name)
            student_data['photo']=photo_id

        student_collection.update_one(
        {'_id': student_id},
        {'$set':student_data}
        )
        messages.success(request, 'Update successful.')
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)

def student_detail(request,student_id):
    student=student_collection.find_one({'_id': student_id})
    if student:
        student['id'] = str(student['_id'])
        if 'photo' in student and isinstance(student['photo'], ObjectId):
            student['photo']=str(student['photo'])
        
        fs=gridfs.GridFS(student_collection.database)
        photo_data=None
        if student.get('photo'):
            photo_id=ObjectId(student['photo'])
            photo_data=fs.get(photo_id).read()

        return render(request, 'studentDetail.html', {'student': student, 'photo_data': photo_data})
    else:
        return render(request, '404.html')




