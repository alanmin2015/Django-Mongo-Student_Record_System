from django.shortcuts import render, redirect
from .models import user_collection
from .utils import hash_password, verify_password
from django.contrib import messages
from django.http import JsonResponse
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

import datetime

# User registration 
def register(request):
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']
        confirm_password = request.POST['confirm_password']
        is_admin = request.POST.get('is_admin', False) 
        is_superuser = request.POST.get('is_superuser', False)  

        #Validate password match
        if password !=confirm_password:
            messages.error(request, 'Passwords do not match')
            return render(request, 'register.html')
        
        try:
            validate_password(password)
        except ValidationError as e:
            for error in e.messages:
                messages.error(request, error)
            return render(request, 'register.html')
        
        hashed_password=hash_password(password)
                    

        # Check if the user already exists
        if user_collection.find_one({'email': email}):
            messages.error(request, 'Email already registered.')
            return redirect('register')

        # Insert the user into MongoDB
        user_collection.insert_one({
            'email': email,
            'password': hashed_password,
            'is_admin': bool(is_admin),
            'is_superuser':bool(is_superuser),
        })

        messages.success(request, 'Registration successful. Please log in.')
        return redirect('login')
    return render(request, 'register.html')

#Login View
def login_view(request):
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']

        # Find the user in MongoDB
        user = user_collection.find_one({'email': email})
        if user and verify_password(password, user['password']):
            # Django's login mechanism doesn't handle PyMongo, so you can use sessions manually
            request.session['user_id'] = str(user['_id'])
            request.session['email'] = user['email']
            request.session['is_admin'] = user.get('is_admin', False)
            request.session['is_superuser']=user.get('is_superuser', False)

            #Add login timestamp
            last_login_time = datetime.datetime.now()
            user_collection.update_one(
                {'_id': user['_id']},
                {'$set': {'last_login':last_login_time}}
            )

            #Different user account will direct to different page
            if user.get('is_superuser',False):
                return redirect('/admin/userlist')
            else:
                return redirect('/home/get_all_student')
        else:
            messages.error(request, 'Invalid email or password.')

    return render(request, 'login.html')

# Logout View
def logout_view(request):
    request.session.flush() # This will clear the session
    return JsonResponse({'message': 'Successfully logged out'}, status=200)

