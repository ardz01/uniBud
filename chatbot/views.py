from django.shortcuts import render
from django.http import JsonResponse

# Create your views here.



def ask_chatbot(request):
    question = request.GET.get('question')
    answer = "I am a simple chatbot, and I don't understand your question yet."
    return JsonResponse({"answer": answer})
