# Generated by Django 3.1 on 2020-09-20 10:14

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tasker', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('due_date', models.DateField()),
                ('budget', models.IntegerField()),
                ('category', models.CharField(choices=[('Furniture Assembly', 'Furniture Assembly'), ('Delivery', 'Delivery'), ('Home & Gardening', 'Home & Gardening'), ('Business & Admin', 'Business & Admin'), ('Computers & IT', 'Computers & IT'), ('Marketing & Design', 'Marketing & Design'), ('Events & Photography', 'Events & Photography'), ('Tutoring & Training', 'Tutoring & Training'), ('Other', 'Other')], max_length=200)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('status', models.CharField(choices=[('Open', 'Open'), ('Assigned', 'Assigned'), ('Completed', 'Completed'), ('Cancelled', 'Cancelled')], default='Open', max_length=200)),
                ('assignee', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='assigned_tasks', to=settings.AUTH_USER_MODEL)),
                ('poster', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='posted_tasks', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('commentor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('task', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tasker.task')),
            ],
        ),
        migrations.CreateModel(
            name='Offer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('price', models.IntegerField()),
                ('message', models.TextField()),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('task', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tasker.task')),
                ('tasker', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
