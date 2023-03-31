from django import template
from base.models import Notification

register = template.Library()

@register.simple_tag
def unread_notifications_count(user):
    last_checked = user.last_checked
    return Notification.objects.filter(receiver=user, created_at__gt=last_checked).count()