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

    # Financial aid
    if 'financial' in tokens and ('aid' in tokens or 'help' in tokens or 'assistance' in tokens):
        return "Financial aid is available to eligible students. You can apply for scholarships, grants, work-study programs, and loans. Visit our financial aid office or check our website for more information."

    # Majors
    if 'major' in tokens or 'majors' in tokens:
        return "Our college offers a variety of majors, including Computer Science, Engineering, Business, Humanities, and Social Sciences. You can find a full list of majors on our website or by contacting the admissions office."

    # Sports
    if 'sports' in tokens or 'athletics' in tokens:
        return "We have a variety of sports teams and athletic programs on campus, including basketball, football, soccer, and swimming. You can find more information about our sports programs on our website or by visiting the athletics department."

    # Library
    if 'library' in tokens or 'resources' in tokens:
        return "Our college library provides access to a wide range of resources, including books, journals, databases, and study spaces. You can find more information about the library and its services on our website."

    # Housing
    if 'housing' in tokens or 'dorm' in tokens or 'dormitory' in tokens:
        return "We offer a variety of housing options for students, including dormitories and apartments. You can find more information about housing, including application deadlines and fees, on our website or by contacting the housing office."

    # Registration
    if 'registration' in tokens or 'enrollment' in tokens:
        return "Registration for classes typically opens a few months before the start of each semester. You can find information about registration dates and deadlines on our website or by contacting the registrar's office."

# Add more rules here for additional functionality


    return "I am a simple chatbot, and I don't understand your question yet."

def ask_chatbot(request):
    question = request.GET.get('question')
    answer = process_question(question)
    return JsonResponse({"answer": answer})
