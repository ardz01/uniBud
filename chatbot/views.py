from django.shortcuts import render
from django.http import JsonResponse

# Create your views here.



def process_question(question):
    question = question.lower()
    greetings = ['hi', 'hello', 'hey', 'greetings', 'howdy']
    goodbyes = ['bye', 'goodbye', 'see you', 'farewell', 'later']

    for greeting in greetings:
        if greeting in question:
            return "Hello! How can I help you?"

    for goodbye in goodbyes:
        if goodbye in question:
            return "Goodbye! Have a great day!"

    # Add more rules here for additional functionality

    return "I am a simple chatbot, and I don't understand your question yet."


def ask_chatbot(request):
    question = request.GET.get('question')
    answer = process_question(question)
    return JsonResponse({"answer": answer})

