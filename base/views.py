from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.db.models import Q, Count
from django.contrib.auth import authenticate, login, logout
from .models import Room, Topic, Message, User, UserRoomVote
from .forms import RoomForm, UserForm, MyUserCreationForm, MessageForm, UpvoteForm
from django.shortcuts import get_object_or_404


# Create your views here.



#rooms = [
 #   {'id': 1, 'name': 'Lets learn python!'},
  #  {'id': 2, 'name': 'Design with me!'},
  #  {'id': 3, 'name': 'Frontend developers'},
#]


def loginPage(request):
    page = 'login'
    if request.user.is_authenticated:
        return redirect('home')

    if request.method == 'POST':
        email = request.POST.get('email').lower()
        password = request.POST.get('password')

        try:
            user = User.objects.get(email=email)
        except:
            messages.error(request, 'User does not exist')

        user = authenticate(request, email=email, password=password)

        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            messages.error(request, 'Username OR password does not exit')

    context = {'page': page}
    return render(request, 'base/login_register.html', context)


def logoutUser(request):
    logout(request)
    return redirect('home')


def registerPage(request):
    form = MyUserCreationForm()

    if request.method == 'POST':
        form = MyUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.username = user.username.lower()
            user.save()
            login(request, user)
            return redirect('home')
        else:
            messages.error(request, 'An error occurred during registration')

    return render(request, 'base/login_register.html', {'form': form})



def home(request):
    q = request.GET.get('q') if request.GET.get('q') != None else ''

    rooms = Room.objects.filter(
        Q(topic__name__icontains=q) |
        Q(name__icontains=q) |
        Q(description__icontains=q)
    ).order_by('-upvotes')

    topics = Topic.objects.all()[0:5]
    room_count = rooms.count()
    top_host = User.objects.annotate(num_followers=Count('followers')).order_by('-num_followers')[:5]

    if request.user.is_authenticated:
        following_users = request.user.followers.all()
        room_messages = Message.objects.filter(
            Q(room__topic__name__icontains=q),
            Q(user=request.user) | Q(user__in=following_users)
        ).order_by('-created')[:5]
    else:
        room_messages = Message.objects.none()  # Return an empty queryset

    context = {'rooms': rooms, 'topics': topics, 
               'room_count': room_count, 'room_messages': room_messages,
               'top_host': top_host}
    return render(request, 'base/home.html', context)



def access_code(request, pk):
    room = Room.objects.get(id=pk)
    if request.method == 'POST':
        access_code = request.POST.get('access_code')
        if room.access_code == access_code:
            room.participants.add(request.user)  # Add this line
            return redirect('room', pk=room.id)
        else:
            return render(request, 'base/access_code.html', {'room': room, 'error': 'Invalid access code'})
    else:
        return render(request, 'base/access_code.html', {'room': room})







def room(request, pk):
    room = Room.objects.get(id=pk)

    if room.is_private and request.user not in room.participants.all():
        return redirect('access_code', pk=room.id)

    room_messages = room.message_set.all().order_by('created')
    participants = room.participants.all()

    if request.method == 'POST':
        message = Message.objects.create(
            user=request.user,
            room=room,
            body=request.POST.get('body')
        )
        room.participants.add(request.user)
        return redirect('room', pk=room.id)

    context = {'room': room, 'room_messages': room_messages,
               'participants': participants}
    return render(request, 'base/room.html', context)



@login_required(login_url='login')
def userProfile(request, pk):
    user = User.objects.get(id=pk)
    rooms = user.room_set.all()
    room_messages = user.message_set.all()
    topics = Topic.objects.all()
    followers_count = user.followers.all().count()
    is_following = user.followers.filter(id=request.user.id).exists()

    if request.method == 'POST':
        if 'follow' in request.POST:
            user.followers.add(request.user)
            user.follower_count += 1
            user.save()
            messages.success(request, 'You are now following ' + user.name)
            is_following = True

        elif 'unfollow' in request.POST:
            user.followers.remove(request.user)
            user.follower_count -= 1
            user.save()
            messages.success(request, 'You are no longer following ' + user.name)
            is_following = False

    context = {'user': user, 'rooms': rooms,
               'room_messages': room_messages, 'topics': topics,
               'followers_count': followers_count, 'is_following': is_following}
    return render(request, 'base/profile.html', context)

    



@login_required(login_url='login')
def createRoom(request):
    form = RoomForm()
    topics = Topic.objects.all()
    if request.method == 'POST':
        topic_name = request.POST.get('topic')
        topic, created = Topic.objects.get_or_create(name=topic_name)

        Room.objects.create(
            host=request.user,
            topic=topic,
            name=request.POST.get('name'),
            description=request.POST.get('description'),
            is_private=request.POST.get('is_private') == 'on',
            access_code=request.POST.get('access_code'),
        )
        return redirect('home')

    context = {'form': form, 'topics': topics}
    return render(request, 'base/room_form.html', context)




@login_required(login_url='login')
def updateRoom(request, pk):
    room = Room.objects.get(id=pk)
    form = RoomForm(instance=room)
    topics = Topic.objects.all()
    if request.user != room.host:
        return HttpResponse('Your are not allowed here!!')

    if request.method == 'POST':
        topic_name = request.POST.get('topic')
        topic, created = Topic.objects.get_or_create(name=topic_name)
        room.name = request.POST.get('name')
        room.topic = topic
        room.description = request.POST.get('description')
        room.is_private = request.POST.get('is_private') == 'on'
        new_access_code = request.POST.get('access_code')
        if room.is_private and new_access_code != room.access_code:
            room.access_code = new_access_code
        room.save()
        return redirect('home')

    context = {'form': form, 'topics': topics, 'room': room}
    return render(request, 'base/room_form.html', context)


     

@login_required
def deleteRoom(request, pk):
    room = Room.objects.get(id=pk)
    if request.method == 'POST':
        room.delete()
        return redirect('home')
    return render(request, 'base/delete.html', {'obj': room})


@login_required(login_url='login')
def deleteMessage(request, pk):
    message = Message.objects.get(id=pk)

    if request.user != message.user:
        return HttpResponse('Your are not allowed here!!')

    if request.method == 'POST':
        message.delete()
        return redirect('home')
    return render(request, 'base/delete.html', {'obj': message})



@login_required(login_url='login')
def updateUser(request):
    user = request.user
    form = UserForm(instance=user)

    if request.method == 'POST':
        form = UserForm(request.POST, request.FILES, instance=user)
        if form.is_valid():
            form.save()
            return redirect('user-profile', pk=user.id)

    return render(request, 'base/update-user.html', {'form': form})





def topicsPage(request):
    q = request.GET.get('q') if request.GET.get('q') != None else ''
    topics = Topic.objects.filter(name__icontains=q)
    return render(request, 'base/topics.html', {'topics': topics})

def activityPage(request):
    room_messages = Message.objects.all()
    return render(request, 'base/activity.html', {'room_messages': room_messages})


def followers(request, pk):
    user = get_object_or_404(User, pk=pk)
    followers_count = user.followers.count()
    context = {'user': user, 'followers_count': followers_count}
    return render(request, 'profile.html', context)



def follow_user(request, pk):
    user = get_object_or_404(User, pk=pk)
    if request.user.is_authenticated:
        user.followers.add(request.user)
        user.follower_count = user.followers.all().count()
        user.save()
    return redirect('user-profile', pk=pk)

def unfollow_user(request, pk):
    user = get_object_or_404(User, pk=pk)
    if request.user.is_authenticated:
        user.followers.remove(request.user)
        user.follower_count = user.followers.all().count()
        user.save()
    return redirect('user-profile', pk=pk)



@login_required(login_url='login')
def inbox(request):
    user = request.user
    messageRequests = user.messages.all()
    unreadCount = messageRequests.filter(is_read=False).count()
    context = {'messageRequests': messageRequests, 'unreadCount': unreadCount}
    return render(request, 'base/inbox.html', context)


@login_required(login_url='login')
def viewMessage(request, pk):
    user = request.user
    message = user.messages.get(id=pk)
    if message.is_read == False:
        message.is_read = True
        message.save()
    context = {'message': message}
    return render(request, 'base/message.html', context)


def createMessage(request, pk):
    recipient = User.objects.get(id=pk)
    form = MessageForm()

    try:
        user = request.user
    except:
        user = None

    if request.method == 'POST':
        form = MessageForm(request.POST)
        if form.is_valid():
            message = form.save(commit=False)
            message.user = user
            message.recipient = recipient
            message.room_id = pk

            if user:
                message.name = user.name
                message.email = user.email
            message.save()

            messages.success(request, 'Your message was successfully sent!')
            return redirect('user-profile', pk=recipient.id)

    context = {'recipient': recipient, 'form': form}
    return render(request, 'base/message_form.html', context)


@login_required
def upvote(request):
    if request.method == "POST":
        room_id = request.POST.get('room')
        room = get_object_or_404(Room, id=room_id)

        if request.user not in room.upvoted_by.all():
            room.upvotes += 1
            room.upvoted_by.add(request.user)
            room.save()

        return JsonResponse({'success': True, 'upvotes': room.upvotes})
    else:
        return JsonResponse({'success': False})



@login_required
def kick_out_user(request, room_id, user_id):
    room = get_object_or_404(Room, id=room_id)
    user = get_object_or_404(User, id=user_id)

    if request.user == room.host and request.user != user:
        room.participants.remove(user)

    return redirect('room', pk=room.id)