// Create audio objects for all 4 sounds
    const sounds = {
        beach: new Audio('/assets/audio/beach_sound.mp3'),
        forest: new Audio('assets/audio/forest.mp3'),
        city: new Audio('assets/audio/city.mp3'),
        rain: new Audio('assets/audio/rain.mp3')
    };

    // Set all sounds to loop
    sounds.beach.loop = true;
    sounds.forest.loop = true;
    sounds.city.loop = true;
    sounds.rain.loop = true;

    // Set initial volume (50%)
    sounds.beach.volume = 0.5;
    sounds.forest.volume = 0.5;
    sounds.city.volume = 0.5;
    sounds.rain.volume = 0.5;

    // Track which sound is currently playing
    let currentSound = null;

    // Get all sound toggle buttons
    const soundButtons = document.querySelectorAll('.sound-toggle');

    // ========================================
    // PLAY/STOP SOUND FUNCTION
    // ========================================
    
    soundButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const soundType = this.getAttribute('data-sound');
            const audio = sounds[soundType];

            if (!audio) {
                alert('Sound not found!');
                return;
            }

            // If clicking the same sound that's playing, stop it
            if (currentSound === soundType) {
                audio.pause();
                audio.currentTime = 0;
                this.textContent = 'Play';
                this.classList.remove('playing');
                currentSound = null;
                console.log('Stopped:', soundType);
            } 
            // If clicking a different sound, stop current and play new
            else {
                // Stop all sounds first
                stopAllSounds();

                // Play the selected sound
                audio.play()
                    .then(function() {
                        currentSound = soundType;
                        button.textContent = 'Stop';
                        button.classList.add('playing');
                        console.log('Now playing:', soundType);
                    })
                    .catch(function(error) {
                        console.error('Error playing', soundType, ':', error);
                        alert('Cannot play sound. Make sure the file exists:\nsounds/' + soundType + '.mp3');
                    });
            }
        });
    });

    // ========================================
    // STOP ALL SOUNDS FUNCTION
    // ========================================
    
    function stopAllSounds() {
        // Pause and reset all 4 sounds
        sounds.beach.pause();
        sounds.beach.currentTime = 0;
        
        sounds.forest.pause();
        sounds.forest.currentTime = 0;
        
        sounds.city.pause();
        sounds.city.currentTime = 0;
        
        sounds.rain.pause();
        sounds.rain.currentTime = 0;

        // Reset all buttons
        soundButtons.forEach(function(btn) {
            btn.textContent = 'Play';
            btn.classList.remove('playing');
        });

        currentSound = null;
    }

    // ========================================
    // VOLUME CONTROL
    // ========================================
    
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeValue = document.getElementById('volumeValue');

    if (volumeSlider && volumeValue) {
        volumeSlider.addEventListener('input', function() {
            const volume = this.value / 100;
            volumeValue.textContent = this.value + '%';

            // Apply volume to all 4 sounds
            sounds.beach.volume = volume;
            sounds.forest.volume = volume;
            sounds.city.volume = volume;
            sounds.rain.volume = volume;

            console.log('Volume changed to:', this.value + '%');
        });
    }