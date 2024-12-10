import os
import wave
import math
import struct

# Create sounds directory if it doesn't exist
sounds_dir = os.path.join(os.path.dirname(__file__), 'sounds')
if not os.path.exists(sounds_dir):
    os.makedirs(sounds_dir)

def create_sample_audio(filename, freq, duration):
    """Create a simple audio file with a beep sound"""
    # Audio parameters
    sample_rate = 44100
    amplitude = 32767
    num_samples = int(duration * sample_rate)
    
    # Create the audio data
    audio_data = []
    for i in range(num_samples):
        t = float(i) / sample_rate
        value = amplitude * math.sin(2.0 * math.pi * freq * t)
        packed_value = struct.pack('h', int(value))
        audio_data.append(packed_value)
    
    # Write to WAV file
    with wave.open(filename, 'wb') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        wav_file.writeframes(b''.join(audio_data))

# Generate simple sound effects
effects = [
    ('scratch.wav', 800, 0.3),    # High-pitched scratch sound
    ('airhorn.wav', 440, 0.5),    # Standard airhorn frequency
    ('drumroll.wav', 200, 1.0),   # Low drum sound
    ('transition.wav', 600, 0.4),  # Medium transition sound
    ('bassdrop.wav', 100, 0.6),   # Very low bass sound
    ('cymbal.wav', 1000, 0.2)     # High cymbal sound
]

print("Generating sound effects...")
for filename, freq, duration in effects:
    filepath = os.path.join(sounds_dir, filename)
    create_sample_audio(filepath, freq, duration)
    print(f"Created {filename}")

print("\nSound effects have been generated in the 'sounds' directory.")
