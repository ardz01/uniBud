from django import template
from base.models import Notification

register = template.Library()

@register.simple_tag
def unread_notifications_count(user):
    return Notification.objects.filter(receiver=user, is_read=False).count()
