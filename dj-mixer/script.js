class DJDeck {
    constructor(deckNumber) {
        this.audio = null;
        this.audioContext = null;
        this.gainNode = null;
        this.source = null;
        this.deckNumber = deckNumber;
        
        this.audioInput = document.getElementById(`audio${deckNumber}`);
        this.volumeSlider = document.getElementById(`volume${deckNumber}`);
        this.speedSlider = document.getElementById(`speed${deckNumber}`);
        this.playButton = document.getElementById(`play${deckNumber}`);
        this.turntable = this.playButton.closest('.deck').querySelector('.turntable');
        
        this.setupEventListeners();
        
        // Initialize audio context on first user interaction
        document.addEventListener('click', () => {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.gainNode = this.audioContext.createGain();
                this.gainNode.connect(this.audioContext.destination);
            }
        }, { once: true });
    }

    setupEventListeners() {
        this.audioInput.addEventListener('change', (e) => this.loadAudio(e));
        this.volumeSlider.addEventListener('input', () => this.updateVolume());
        this.speedSlider.addEventListener('input', () => this.updateSpeed());
        this.playButton.addEventListener('click', () => this.togglePlay());
    }

    async loadAudio(e) {
        const file = e.target.files[0];
        const arrayBuffer = await file.arrayBuffer();
        
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.gainNode = this.audioContext.createGain();
            this.gainNode.connect(this.audioContext.destination);
        }

        // Resume audio context if suspended
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }

        this.audioContext.decodeAudioData(arrayBuffer, (buffer) => {
            this.audio = buffer;
            this.playButton.disabled = false;
        });
    }

    updateVolume() {
        if (this.gainNode) {
            this.gainNode.gain.value = this.volumeSlider.value / 100;
        }
    }

    updateSpeed() {
        if (this.source) {
            this.source.playbackRate.value = this.speedSlider.value;
        }
    }

    async togglePlay() {
        if (!this.audio) return;

        // Resume audio context if suspended
        if (this.audioContext && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }

        if (this.source) {
            this.source.stop();
            this.source = null;
            this.playButton.textContent = 'Play';
            this.turntable.classList.remove('playing');
        } else {
            this.source = this.audioContext.createBufferSource();
            this.source.buffer = this.audio;
            this.source.connect(this.gainNode);
            this.source.playbackRate.value = this.speedSlider.value;
            this.source.start();
            this.playButton.textContent = 'Stop';
            this.turntable.classList.add('playing');

            this.source.onended = () => {
                this.source = null;
                this.playButton.textContent = 'Play';
                this.turntable.classList.remove('playing');
            };
        }
    }
}

class DJMixer {
    constructor() {
        this.deck1 = new DJDeck(1);
        this.deck2 = new DJDeck(2);
        this.crossfader = document.getElementById('crossfader');
        this.effectVolume = document.getElementById('effectVolume');
        this.effects = {};
        
        this.crossfader.addEventListener('input', () => this.updateCrossfade());
        this.setupEffects();
    }

    updateCrossfade() {
        const value = this.crossfader.value / 100;
        if (this.deck1.gainNode && this.deck2.gainNode) {
            this.deck1.gainNode.gain.value = (1 - value) * (this.deck1.volumeSlider.value / 100);
            this.deck2.gainNode.gain.value = value * (this.deck2.volumeSlider.value / 100);
        }
    }

    setupEffects() {
        // Create audio elements for each effect
        this.effects = {
            scratch: new Audio('sounds/scratch.wav'),
            airhorn: new Audio('sounds/airhorn.wav'),
            drum: new Audio('sounds/drumroll.wav'),
            transition: new Audio('sounds/transition.wav'),
            bass: new Audio('sounds/bassdrop.wav'),
            cymbal: new Audio('sounds/cymbal.wav')
        };

        // Set initial volume for all effects
        Object.values(this.effects).forEach(audio => {
            audio.volume = this.effectVolume.value / 100;
        });

        // Set up effect volume control
        this.effectVolume.addEventListener('input', () => {
            const volume = this.effectVolume.value / 100;
            Object.values(this.effects).forEach(audio => {
                audio.volume = volume;
            });
        });

        // Add click handlers to effect buttons
        document.querySelectorAll('.effect-btn').forEach(button => {
            button.addEventListener('click', () => {
                const effectName = button.dataset.sound;
                const audio = this.effects[effectName];
                
                if (audio) {
                    // Reset the audio to start
                    audio.currentTime = 0;
                    // Play the sound
                    audio.play().catch(error => {
                        console.error(`Error playing ${effectName}:`, error);
                    });

                    // Visual feedback
                    button.style.background = '#00ff00';
                    button.style.color = '#000';
                    setTimeout(() => {
                        button.style.background = '';
                        button.style.color = '';
                    }, 200);
                }
            });
        });

        // Log when effects are loaded or if there are errors
        Object.entries(this.effects).forEach(([name, audio]) => {
            audio.addEventListener('canplaythrough', () => {
                console.log(`${name} sound effect loaded successfully`);
            });
            
            audio.addEventListener('error', (e) => {
                console.error(`Error loading ${name} sound effect:`, e);
            });
        });
    }
}

// Initialize the DJ Mixer
const mixer = new DJMixer();
