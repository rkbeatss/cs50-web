# Generated by Django 3.1 on 2020-10-03 03:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasker', '0005_auto_20200922_1155'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='about',
            field=models.TextField(blank=True),
        ),
    ]
