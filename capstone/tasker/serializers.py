from rest_framework import serializers
from . models import User, Task, Offer, Question, Review

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ("id", "title", "description", "poster", "due_date", "budget", "category", "timestamp", "status", "assignee")

class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = ("id", "task", "price", "tasker", "message", "timestamp")

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ("id", "task", "commenter", "content", "timestamp")

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ("id", "task", "reviewer", "reviewee", "rating", "content", "timestamp")