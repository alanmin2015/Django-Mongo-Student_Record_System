from django.shortcuts import render
from .models import person_collection
from django.http import HttpResponse

def index(request):
    return HttpResponse("<h1>App is running</h1>")
# Create your views here.

def add_person(request):
    records={
        "first_name": "John",
        "last_name":"smith"
    }
    person_collection.insert_one(records)
    return HttpResponse("New person is added")

def get_all_person(request):
    persons=person_collection.find()
    return HttpResponse(persons)