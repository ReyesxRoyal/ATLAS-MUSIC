# playlists/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('playlists/', views.PlaylistList.as_view()),
    path('songs/', views.SongList.as_view()),
]

# music_api/urls.py
from django.urls import include, path

urlpatterns = [
    path('api/v1/', include('playlists.urls')),
]