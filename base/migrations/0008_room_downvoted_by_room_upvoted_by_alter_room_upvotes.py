# Generated by Django 4.1.6 on 2023-03-24 17:46

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0007_room_downvotes'),
    ]

    operations = [
        migrations.AddField(
            model_name='room',
            name='downvoted_by',
            field=models.ManyToManyField(related_name='downvoted_rooms', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='room',
            name='upvoted_by',
            field=models.ManyToManyField(related_name='upvoted_rooms', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='room',
            name='upvotes',
            field=models.IntegerField(default=0),
        ),
    ]
