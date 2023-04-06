from django.urls import path
from . import views
urlpatterns = [
    path('login/', views.loginPage, name="login"),
    path('logout/', views.logoutUser, name="logout"),
    path('register/', views.registerPage, name="register"),


    path('', views.home, name="home"),
    path('room/<str:pk>/', views.room, name="room"),
    path('profile/<str:pk>/', views.userProfile, name="user-profile"),
    

    path('create-room/', views.createRoom, name="create-room"),
    path('update-room/<str:pk>/', views.updateRoom, name="update-room"),
    path('delete-room/<str:pk>/', views.deleteRoom, name="delete-room"),
    path('delete-message/<str:pk>/', views.deleteMessage, name="delete-message"),
    
    path('update-user/', views.updateUser, name="update-user"),
    
    
    path('topics/', views.topicsPage, name="topics"),
    path('activity/', views.activityPage, name="activity"),
     
    path('follow-user/<str:pk>/', views.follow_user, name="follow-user"),
    path('unfollow-user/<str:pk>/', views.unfollow_user, name="unfollow-user"),
    path('follower_list/', views.follower_list, name='follower_list'),
    path('follower_list/<int:pk>/', views.follower_list, name='follower_list'),
    
    path('inbox/', views.inbox, name="inbox"),
    path('message/<str:pk>/', views.viewMessage, name="message"),
    path('create-message/<str:pk>/', views.createMessage, name="create-message"),
    path('upvote/', views.upvote, name='upvote'),
    path('room/<int:pk>/access_code/', views.access_code, name='access_code'),
    
    path('room/<int:room_id>/kick-out/<int:user_id>/', views.kick_out_user, name='kick-out-user'),
    path('room/<int:room_id>/make-admin/<int:user_id>/', views.make_user_admin, name='make-user-admin'),
    path('room/<int:room_id>/un-admin/<int:user_id>/', views.unadmin_user, name='unadmin-user'),

    path('get_notifications/', views.get_notifications, name='get_notifications'),
    path('delete_notification/<int:notification_id>/', views.delete_notification, name='delete_notification'),

    path('room/<int:room_pk>/invite/<int:user_pk>/', views.invite_to_room, name='invite_to_room'),
    path('join-room/<int:room_pk>/', views.join_room, name='join_room'),
    path('add_reaction/', views.add_reaction, name='add_reaction'),
    
]