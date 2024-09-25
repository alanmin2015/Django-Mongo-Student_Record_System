# Django-Mongo-Student_Record_System

Register and forget email function is working, please register an account to login

Frontend: Django Template
Backend: Django
Database: Mongodb Atlas
Server: Pythonanywhere

MVP:
1. Home page for student record presentation, sorting function for table
2. Student detailed page to present photo and detailed info
3. Admin page for superuser to manage(CRUD)  user data and adminuser to manage(CRUD) student data
4. Login page with register, login and forgetpassword function
5. Use pymongo to connect to mongodb atlas
6. Responsive style design
7. Deployment

Areas of improvement:
1. Authentication system is too naive and simple, only use cookies with hashed password
2. Frontend uses the Django template, it is too old and primary, need to be migrate to react or other modern framework
3. Backend code need to refactor and add data serializers to make the code easier for futher maintainance
4. Mongodb doesn`t have a good compatibility with Django as most django pre-defined module based on strict SQL database model, consider to swtich to node.js with mongodb or django with SQL database


