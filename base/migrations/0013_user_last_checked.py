# Generated by Django 4.1.6 on 2023-03-31 18:02

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0012_notification'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='last_checked',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
