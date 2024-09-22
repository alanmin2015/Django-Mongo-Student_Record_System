from django.http import JsonResponse
from django.shortcuts import render, redirect
from .models import student_collection
from bson.objectid import ObjectId

# Add a student
def add_student(request):
    if request.method == 'POST':
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')

        # Add to MongoDB
        records = {
            "first_name": first_name,
            "last_name": last_name
        }
        student_collection.insert_one(records)
        return redirect('get_all_student')
    

# Display all students
def get_all_student(request):
    students = student_collection.find()
    
    # Convert MongoDB cursor to list for rendering in template
    student_list = []
    for student in students:
        student['id'] = str(student['_id'])  # Convert ObjectId to string
        student_list.append(student)
    
    return render(request, 'student_list.html', {'students': student_list})


# Delete a student
def delete_student(request, student_id):
    if request.method=='POST':
        student_collection.delete_one({'_id': ObjectId(student_id)})
        return redirect('get_all_student')
    
# Update a student
def update_student(request, student_id):
    #Fetch student
    student=student_collection.find_one({'._id': ObjectId(student_id)})
    print('Updated')

    if request.method=='POST':
        first_name=request.POST.get('first_name')
        last_name=request.POST.get('last_name')

        student_collection.update_one(
        {'_id': ObjectId(student_id)},
        {'$set':{'first_name': first_name,'last_name':last_name}}
        )
        return JsonResponse({'status': 'success'})




