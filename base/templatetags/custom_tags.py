from django import template
from django.db.models import Q

register = template.Library()

@register.simple_tag
def unread_messages_count(user):
    return user.messages.filter(is_read=False).count()
