from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import JsonResponse
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.utils.encoding import force_str
from django.urls import reverse

from datetime import datetime
from bson import ObjectId

from .models import user_collection
from .utils import hash_password, verify_password


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
            request.session['user_id'] = str(user['_id'])
            request.session['email'] = user['email']
            request.session['is_admin'] = user.get('is_admin', False)
            request.session['is_superuser']=user.get('is_superuser', False)
            
            # Set session expiry to 24 hours 
            request.session.set_expiry(86400)

            #Add login timestamp
            last_login_time = datetime.now()
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
    request.session.flush() 
    return JsonResponse({'message': 'Successfully logged out'}, status=200)

# Create a mock user class to mimic Django's User model as it uses MongoDB
class MockUser:
    def __init__(self, user_data):
        self.id = str(user_data['_id'])  
        self.pk = self.id 
        self.password = user_data['password']  
        self.last_login = user_data.get('last_login', datetime.now())  
        self.email = user_data['email']

    def is_active(self):
        return True  
    
    def get_email_field_name(self):
        return 'email'  


# Forget Password View
def forgot_password(request):
    if request.method == 'POST':
        email = request.POST['email']

        user_data = user_collection.find_one({'email': email})
        if not user_data:
            messages.error(request, 'No user found with this email address.')
            return render(request, 'forgot_password.html')

        # Create a mock user instance
        user = MockUser(user_data)

        uidb64 = urlsafe_base64_encode(force_bytes(str(user.id)))  
        token = default_token_generator.make_token(user)

        # Create a password reset URL
        reset_url = request.build_absolute_uri(
            reverse('reset_password', kwargs={'uidb64': uidb64, 'token': token})
        )

        # Send password reset email
        send_mail(
            'Password Reset Request',
            f'Click the link to reset your password: {reset_url}',
            'admin@yourdomain.com',
            [email],
            fail_silently=False,
        )

        messages.success(request, 'Password reset email has been sent.')
        return redirect('forgot_password')

    return render(request, 'forgetPassword.html')

# Reset Password View
def reset_password(request, uidb64, token):
    try:
        # Decode the user ID from the uidb64
        uid = force_str(urlsafe_base64_decode(uidb64))
        user_data = user_collection.find_one({'_id': ObjectId(uid)})
    except (TypeError, ValueError, OverflowError, user_collection.DoesNotExist):
        user_data = None

    # Create a mock user
    if user_data:
        user = MockUser(user_data)
    else:
        user = None

    # Verify the token is valid
    if user is not None and default_token_generator.check_token(user, token):
        if request.method == 'POST':
            new_password = request.POST['new_password']
            confirm_password = request.POST['confirm_password']

            if new_password != confirm_password:
                messages.error(request, 'Passwords do not match.')
                return render(request, 'resetPassword.html', {'uidb64': uidb64, 'token': token})

            try:
                validate_password(new_password)
            except ValidationError as e:
                for error in e.messages:
                    messages.error(request, error)
                return render(request, 'resetPassword.html', {'uidb64': uidb64, 'token': token})

            hashed_password = hash_password(new_password)
            user_collection.update_one(
                {'_id': ObjectId(uid)},
                {'$set': {'password': hashed_password}}
            )

            messages.success(request, 'Your password has been reset. You can now log in.')
            return redirect('login')

        return render(request, 'resetPassword.html', {'uidb64': uidb64, 'token': token})

    else:
        messages.error(request, 'The password reset link is invalid or has expired.')
        return redirect('forgot_password')
