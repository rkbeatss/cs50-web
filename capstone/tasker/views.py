from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import status
from datetime import date
import json
from dateutil import parser

from . models import User, Task, Offer, Question, Review
from . serializers import UserSerializer, UserSerializerWithToken, TaskSerializer, OfferSerializer, QuestionSerializer, ReviewSerializer


# Placeholder for index page
def index(request):
    return HttpResponse("Hello World!")


@api_view(["GET", "PUT"])
def user_element(request, username):
    """
    API to get or update information about a specific user
    """
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
    elif request.method == "PUT":
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([AllowAny])
def users_collection(request):
    """
    API to create a new user
    """
    if request.method == "POST":
        serializer = UserSerializerWithToken(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def top_task_element(request):
    """
    API to get most recently posted open task
    """
    if request.method == "GET":
        task = Task.objects.filter(status="Open").order_by("-timestamp").first()
        serializer = TaskSerializer(task)
        return Response(serializer.data)


@api_view(["GET", "POST"])
def tasks_collection(request):
    """
    API to get all tasks (most recent posts first), or post a new task
    """
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


@api_view(["GET", "PUT", "DELETE"])
def task_element(request, task_id):
    """
    API to get, update, or delete a specific task
    """
    try:
        task = Task.objects.get(id=task_id)
    except Task.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = TaskSerializer(task)
        return Response(serializer.data)

    elif request.method == "PUT":
        data = json.loads(request.body)

        status = data.get("status", "")
        task.status = status

        try:
            assignee = User.objects.get(username=data.get("assignee", ""))
            task.assignee = assignee
        except:
            pass
        
        task.save()
        return JsonResponse({"message": "Task updated successfully"}, status=204)

    elif request.method == "DELETE":
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



@api_view(["GET"])
def task_questions_collection(request, task_id):
    """
    API to get all questions for a specific task (most recent questions first)
    """
    try:
        task = Task.objects.get(id=task_id)
    except Task.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        questions = Question.objects.filter(task=task).all().order_by("-timestamp")
        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data)


@api_view(["POST"])
def questions_collection(request):
    """
    API to post a new question
    """
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


@api_view(["GET"])
def task_offers_collection(request, task_id):
    """
    API to get all offers for a specific task (most recent offers first)
    """
    try:
        task = Task.objects.get(id=task_id)
    except Task.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        offers = Offer.objects.filter(task=task).all().order_by("-timestamp")
        serializer = OfferSerializer(offers, many=True)
        return Response(serializer.data)


@api_view(["POST"])
def offers_collection(request):
    """
    API to post a new offer
    """
    if request.method == "POST":
        data = json.loads(request.body)
        task = Task.objects.get(id=data.get("taskId", ""))
        price = data.get("price", "")
        tasker = User.objects.get(username=data.get("tasker", ""))
        message = data.get("message", "")

        offer = Offer(
            task=task,
            price=price,
            tasker=tasker,
            message=message
        )
        offer.save()
        return JsonResponse({"message": "Offer created successfully"}, status=201)


@api_view(["GET", "PUT", "DELETE"])
def offer_element(request, offer_id):
    """
    API to get, update or delete a specific offer
    """
    try:
        offer = Offer.objects.get(id=offer_id)
    except Offer.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = OfferSerializer(offer)
        return Response(serializer.data)

    elif request.method == "PUT":
        data = json.loads(request.body)
        
        offer.price = data.get("price", "")
        offer.message = data.get("message", "")
        
        offer.save()
        return JsonResponse({"message": "Offer updated successfully"}, status=204)

    elif request.method == "DELETE":
        offer.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["POST"])
def reviews_collection(request):
    """
    API to post a new review
    """
    if request.method == "POST":
        data = json.loads(request.body)
        task = Task.objects.get(id=data.get("taskId", ""))
        reviewer = User.objects.get(username=data.get("reviewer", ""))
        reviewee = User.objects.get(username=data.get("reviewee", ""))
        rating = data.get("rating", "")
        content = data.get("content", "")

        review = Review(
            task=task,
            reviewer=reviewer,
            reviewee=reviewee,
            rating=rating,
            content=content
        )
        review.save()

        serializer = ReviewSerializer(review)
        return Response(serializer.data)


@api_view(["GET"])
def user_reviews_collection(request, username):
    """
    API to get all reviews of a specific user
    """
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        reviews = Review.objects.filter(reviewee=user).all().order_by("-timestamp")
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)


@api_view(["GET"])
def offers_reviews_collection(request, task_id):
    """
    API to get all reviews associated with users who have posted an offer for a specific task
    """
    try:
        task = Task.objects.get(id=task_id)
    except Task.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        offers = Offer.objects.filter(task=task).all()
        taskers = offers.values_list("tasker", flat=True)
        reviews = Review.objects.filter(reviewee__id__in=taskers, task__assignee__isnull=False).all().order_by("-timestamp")
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)


@api_view(["GET"])
def task_reviews_collection(request, task_id):
    """
    API to get all reviews associated with a specific task
    """
    try:
        task = Task.objects.get(id=task_id)
    except Task.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        reviews = Review.objects.filter(task=task).all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)


@api_view(["PUT"])
def review_element(request, review_id):
    """
    API to update a specific review
    """
    try:
        review = Review.objects.get(id=review_id)
    except Review.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "PUT":
        data = json.loads(request.body)
        
        review.rating = data.get("rating", "")
        review.content = data.get("content", "")
        
        review.save()
        return JsonResponse({"message": "Review updated successfully"}, status=204)