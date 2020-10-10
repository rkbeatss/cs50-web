from django.urls import path
from rest_framework_jwt.views import obtain_jwt_token
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("api/tasks/top", views.top_task_element),
    path("api/tasks/", views.tasks_collection),
    path("api/tasks/<int:task_id>", views.task_element),
    path("api/questions/", views.questions_collection),
    path("api/tasks/<int:task_id>/questions", views.task_questions_collection),
    path("api/offers/", views.offers_collection),
    path("api/tasks/<int:task_id>/offers", views.task_offers_collection),
    path("api/offers/<int:offer_id>", views.offer_element),
    path("api/review/<int:review_id>", views.review_element),
    path("api/reviews/", views.reviews_collection),
    path("api/users/<str:username>/reviews", views.user_reviews_collection),
    path("api/profile/<str:username>", views.user_element),
    path("api/users/", views.users_collection),
    path('api/token-auth/', obtain_jwt_token),
    path("api/tasks/<int:task_id>/reviews", views.offers_reviews_collection),
    path("api/task/<int:task_id>/reviews", views.task_reviews_collection)
]