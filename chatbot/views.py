from django.shortcuts import render
from django.http import JsonResponse
import nltk
from nltk.tokenize import word_tokenize
import random

# Download NLTK data if you haven't already
nltk.download('punkt')

# Create your views here.

def process_question(question):
    question = question.lower()
    tokens = word_tokenize(question)
    
    # Greetings
    greetings = ['hi', 'hello', 'hey', 'greetings', 'howdy']
    if any(greeting in tokens for greeting in greetings):
        return "Hello! How can I help you?"

    # Goodbyes
    goodbyes = ['bye', 'goodbye', 'see you', 'farewell', 'later']
    if any(goodbye in tokens for goodbye in goodbyes):
        return "Goodbye! Have a great day!"

    # Study tips
    if 'study' in tokens and 'tips' in tokens:
        study_tips = [
            "Make a study schedule and stick to it.",
            "Take regular breaks to avoid burnout.",
            "Stay organized and keep track of your assignments.",
            "Practice active learning techniques, such as summarizing information in your own words.",
            "Seek help from professors or classmates when you need it."
        ]
        return random.choice(study_tips)

    # Clubs or organizations
    if 'clubs' in tokens or 'organizations' in tokens:
        return "We have a variety of clubs and organizations on campus! Some popular ones include the Debate Club, Robotics Club, and Photography Club. You can find more information about clubs on our website or by visiting the student activities office."

    # Events
    if 'events' in tokens:
        return "There are many events happening on campus throughout the year, such as guest lectures, workshops, and cultural events. Check out our events calendar on the website for more information."

    # Add more rules here for additional functionality

    return "I am a simple chatbot, and I don't understand your question yet."

def ask_chatbot(request):
    question = request.GET.get('question')
    answer = process_question(question)
    return JsonResponse({"answer": answer})
