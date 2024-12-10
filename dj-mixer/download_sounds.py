import os
import urllib.request

sound_effects = {
    'scratch': 'https://cdn.freesound.org/previews/573/573649_11861866-lq.mp3',
    'airhorn': 'https://cdn.freesound.org/previews/493/493696_10982655-lq.mp3',
    'drum': 'https://cdn.freesound.org/previews/648/648853_13874539-lq.mp3',
    'transition': 'https://cdn.freesound.org/previews/648/648882_13874539-lq.mp3',
    'bass': 'https://cdn.freesound.org/previews/648/648881_13874539-lq.mp3',
    'cymbal': 'https://cdn.freesound.org/previews/648/648879_13874539-lq.mp3'
}

def download_sound_effects():
    sounds_dir = os.path.join(os.path.dirname(__file__), 'sounds')
    
    # Create sounds directory if it doesn't exist
    if not os.path.exists(sounds_dir):
        os.makedirs(sounds_dir)

    for name, url in sound_effects.items():
        destination = os.path.join(sounds_dir, f'{name}.mp3')
        print(f'Downloading {name}.mp3...')
        try:
            urllib.request.urlretrieve(url, destination)
            print(f'Successfully downloaded {name}.mp3')
        except Exception as e:
            print(f'Error downloading {name}.mp3:', e)

if __name__ == '__main__':
    download_sound_effects()
