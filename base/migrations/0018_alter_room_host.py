# Generated by Django 4.0 on 2023-05-04 11:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0017_user_badges'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='host',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='created_rooms', to='base.user'),
        ),
    ]
