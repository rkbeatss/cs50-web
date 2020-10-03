from rest_framework import serializers
from rest_framework_jwt.settings import api_settings
from . models import User, Task, Offer, Question, Review

class UserSerializer(serializers.ModelSerializer):
    
    num_tasks_posted = serializers.SerializerMethodField()
    num_tasks_completed = serializers.SerializerMethodField()

    def get_num_tasks_posted(self, obj):
        return len(Task.objects.filter(poster=obj).all())

    def get_num_tasks_completed(self, obj):
        return len(Task.objects.filter(assignee=obj, status="Completed"))

    class Meta:
        model = User
        fields = ("id", "username", "first_name", "last_name", "date_joined", "about", "num_tasks_posted", "num_tasks_completed")


class UserSerializerWithToken(serializers.ModelSerializer):

    token = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True)

    def get_token(self, obj):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)
        return token

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    class Meta:
        model = User
        fields = ("token", "username", "password", "first_name", "last_name", "email", "about")


class TaskSerializer(serializers.ModelSerializer):
    poster = UserSerializer()
    assignee = UserSerializer()

    class Meta:
        model = Task
        fields = ("id", "title", "description", "poster", "due_date", "budget", "category", "timestamp", "status", "assignee", "offers")


class OfferSerializer(serializers.ModelSerializer):
    # task = TaskSerializer()
    tasker = UserSerializer()

    class Meta:
        model = Offer
        fields = ("id", "task", "price", "tasker", "message", "timestamp")


class QuestionSerializer(serializers.ModelSerializer):
    # task = TaskSerializer()
    commenter = UserSerializer()

    class Meta:
        model = Question
        fields = ("id", "task", "commenter", "content", "timestamp")


class ReviewSerializer(serializers.ModelSerializer):
    task = TaskSerializer()
    reviewer = UserSerializer()
    reviewee = UserSerializer()

    class Meta:
        model = Review
        fields = ("id", "task", "reviewer", "reviewee", "rating", "content", "timestamp")