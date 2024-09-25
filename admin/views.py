from django.shortcuts import render, redirect
from bson import ObjectId
from .models import user_collection
from django.http import JsonResponse
import bcrypt
import json
from students.models import student_collection
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
# Display all users
def get_userlist(request):
    if 'user_id' not in request.session:
        return redirect('/user/login')  
    
    users = user_collection.find({}, {'email': 1, 'is_admin': 1, 'is_superuser': 1, 'last_login': 1})
    user_id = request.session.get('user_id')
    students = list(student_collection.find())
    for student in students:
        student['id'] = str(student['_id']) 
        
    # Convert MongoDB cursor to list for rendering in template
    user_list = []
    for user in users:
        user_data = {
            'email': user.get('email'),
            'is_admin': user.get('is_admin', False),  
            'is_superuser': user.get('is_superuser', False), 
            'last_login': user.get('last_login', None),
            'id': str(user.get('_id'))
        }
        user_list.append(user_data)

    return render(request, 'admin.html', {'users': user_list,'user_id': user_id, 'students': students})

# Delete a user
def delete_user(request, user_id):
    if request.method=='POST':
        user_collection.delete_one({'_id': ObjectId(user_id)})
        return redirect('userlist')
def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
# Update a user
def update_user(request, user_id):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            password = data.get('password')
            confirm_password = data.get('confirm_password')
            # Get the user from MongoDB
            user = user_collection.find_one({'_id': ObjectId(user_id)})

            if not user:
                return JsonResponse({'status': 'error', 'message': 'User not found'}, status=404)

            #Update the password if provided
            #Validate password match
            if data.get('password'):
                print(password)
                print(confirm_password)
                if password !=confirm_password:
                    return JsonResponse({'status': 'error', 'message': 'Passwords do not match'}, status=400)
                try:
                    validate_password(password)
                except ValidationError as e:
                    return JsonResponse({'status': 'error', 'message': e.messages}, status=400)
                hashed_password = hash_password(data['password'])
                user_collection.update_one(
                    {'_id': ObjectId(user_id)},
                    {'$set': {'password': hashed_password}}
                )

            # Update is_admin and is_superuser status
            user_collection.update_one(
                {'_id': ObjectId(user_id)},
                {
                    '$set': {
                        'is_admin': data.get('is_admin', user.get('is_admin', False)),
                        'is_superuser': data.get('is_superuser', user.get('is_superuser', False))
                    }
                }
            )
            return JsonResponse({'status': 'success', 'message': 'User updated successfully'})

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)
