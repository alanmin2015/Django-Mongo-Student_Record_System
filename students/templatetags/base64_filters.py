import base64
from django import template

register = template.Library()

@register.filter
def b64encode(value):
    """Encodes a byte string in base64."""
    if isinstance(value, bytes):
        return base64.b64encode(value).decode('utf-8')
    return value
