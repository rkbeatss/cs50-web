# Generated by Django 3.1 on 2020-09-06 02:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0002_listing_highest_bid'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='listing',
            name='highest_bid',
        ),
    ]