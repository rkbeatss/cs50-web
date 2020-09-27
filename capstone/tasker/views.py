from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.db.models import Q
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from datetime import date
import json
from dateutil import parser

from . models import User, Task, Offer, Question, Review
from . serializers import TaskSerializer, OfferSerializer, QuestionSerializer, ReviewSerializer

def index(request):
    return HttpResponse("Hello World!")

# API to get most recently posted open task
@api_view(["GET"])
def top_task_element(request):
    if request.method == "GET":
        task = Task.objects.filter(status="Open").order_by("-timestamp").first()
        serializer = TaskSerializer(task)
        return Response(serializer.data)


# API to get all tasks (most recent posts first), or post a new task
@api_view(["GET", "POST"])
def tasks_collection(request):
    if request.method == "GET":
        tasks = Task.objects.all().order_by("-timestamp")
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        data = json.loads(request.body)
        title = data.get("title", "")
        description = data.get("description", "")
        category = data.get("category", "")
        budget = data.get("budget", "")
        poster = User.objects.get(username=data.get("poster", ""))
        due_date = parser.parse(data.get("dueDate", ""))

        task = Task(
            title=title,
            description=description,
            poster=poster,
            due_date=due_date,
            budget=budget,
            category=category
        )
        task.save()
        return JsonResponse({"message": "Task created successfully"}, status=201)


# API to get, update, or delete a specific task
@api_view(["GET", "PUT", "DELETE"])
def task_element(request, task_id):
    try:
        task = Task.objects.get(id=task_id)
    except Task.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = TaskSerializer(task)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = TaskSerializer(task, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# API to get all questions for a specific task (most recent questions first)
@api_view(["GET"])
def task_questions_collection(request, task_id):
    try:
        task = Task.objects.get(id=task_id)
    except Task.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        questions = Question.objects.filter(task=task).all().order_by("-timestamp")
        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data)


# API to post a new question
@api_view(["POST"])
def questions_collection(request):
    if request.method == "POST":
        data = json.loads(request.body)
        task = Task.objects.get(id=data.get("taskId", ""))
        commenter = User.objects.get(username=data.get("commenter", ""))
        content = data.get("content", "")

        question = Question(
            task=task,
            commenter=commenter,
            content=content
        )
        question.save()
        return JsonResponse({"message": "Question created successfully"}, status=201)


# API to get all offers for a specific task (most recent offers first)
@api_view(["GET"])
def task_offers_collection(request, task_id):
    try:
        task = Task.objects.get(id=task_id)
    except Task.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        offers = Offer.objects.filter(task=task).all().order_by("-timestamp")
        serializer = OfferSerializer(offers, many=True)
        return Response(serializer.data)


# API to post a new offer
@api_view(["POST"])
def offers_collection(request):
    if request.method == "POST":
        serializer = OfferSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# API to get, update or delete a specific offer
@api_view(["GET", "PUT", "DELETE"])
def offer_element(request, offer_id):
    try:
        offer = Offer.objects.get(id=offer_id)
    except Offer.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = OfferSerializer(offer)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = OfferSerializer(offer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        offer.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# API to post a new review
@api_view(["POST"])
def reviews_collection(request):
    if request.method == "POST":
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# API to get all reviews of a specific user
@api_view(["GET"])
def user_reviews_collection(request, username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        reviews = Review.objects.filter(Q(reviewer=user) | Q(reviewee=user)).all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)