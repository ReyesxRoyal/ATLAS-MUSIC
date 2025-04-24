from django.db.models import Q
from .models import Playlist, Song

class PlaylistService:
    @staticmethod
    def create_playlist(user, name, description):
        return Playlist.objects.create(
            created_by=user,
            name=name,
            description=description
        )
    
    @staticmethod
    def search_playlists(query):
        return Playlist.objects.filter(
            Q(name__icontains=query) |
            Q(description__icontains=query)
        ).select_related('created_by')