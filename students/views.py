import json
import datetime
import random
from django.http import JsonResponse
from django.shortcuts import render, redirect

from .models import student_collection

#Function to generate the student ID based on current date and a random 3-digit number
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
            return student_id  # Return if the ID is unique

# Add a student
def add_student(request):
    if request.method == 'POST':
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        gender=request.POST.get('gender')
        grade=request.POST.get('grade')
        score=request.POST.get('score')

        #Generate the student ID
        student_id=generate_unique_student_id()

        # Add to MongoDB
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
        # Fetch student from the database
        student = student_collection.find_one({'_id': student_id})
        
        if student:
            # Convert MongoDB ObjectId to string and return student data
            student['_id'] = str(student['_id'])
            return JsonResponse({'status': 'success', 'student': student})
        else:
            return JsonResponse({'status': 'error', 'message': 'Student not found'}, status=404)
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)

# Display all students
def get_all_student(request):
    if 'user_id' not in request.session:
        return redirect('/user/login')  # Redirect to the login page if not logged in
    
    students = student_collection.find()
    
    # Convert MongoDB cursor to list for rendering in template
    student_list = []
    for student in students:
        student['id'] = str(student['_id'])  # Convert ObjectId to string
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
        data = json.loads(request.body)

        # Extract first_name and last_name from the parsed JSON
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        gender = data.get('gender')
        grade = data.get('grade')
        score = data.get('score')

        student_collection.update_one(
        {'_id': student_id},
        {'$set':{'first_name': first_name,
                 'last_name':last_name,
                 'gender':gender,
                 'grade':grade,
                 'score':score,
                 }}
        )
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)




