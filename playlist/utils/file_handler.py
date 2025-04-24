import os
from django.conf import settings
from django.core.files.storage import FileSystemStorage

class FileHandler:
    def __init__(self):
        self.storage = FileSystemStorage(
            location=settings.MEDIA_ROOT,
            base_url=settings.MEDIA_URL
        )
    
    def save_song_file(self, file, filename):
        return self.storage.save(f"songs/{filename}", file)
    
    def get_file_url(self, filepath):
        return self.storage.url(filepath)