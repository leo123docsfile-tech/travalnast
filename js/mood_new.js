// Simple Sound Test - mood.js

console.log('🎵 mood.js loaded!');

document.addEventListener('DOMContentLoaded', function() {
    
    console.log('✅ Page loaded, setting up sounds...');

    // Hamburger Menu
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Create 4 audio objects
    const beachSound = new Audio('/assets/audio/beach_sound.mp3');
    // const forestSound = new Audio('assets/audio/forest.mp3');
    // const citySound = new Audio('assets/audio/city.mp3');
    // const rainSound = new Audio('assets/audio/rain.mp3');

    console.log('🎵 Audio objects created');

    // Set them to loop
    beachSound.loop = true;
    forestSound.loop = true;
    citySound.loop = true;
    rainSound.loop = true;

    // Set volume to 50%
    beachSound.volume = 0.5;
    forestSound.volume = 0.5;
    citySound.volume = 0.5;
    rainSound.volume = 0.5;

    console.log('🔊 Volume set to 50%');

    // Track current sound
    let currentAudio = null;
    let currentButton = null;

    // Get all buttons
    const buttons = document.querySelectorAll('.sound-toggle');
    console.log('🔘 Found', buttons.length, 'buttons');

    // Add click event to each button
    buttons.forEach(function(button) {
        button.addEventListener('click', function() {
            const soundName = this.getAttribute('data-sound');
            console.log('🖱️ Clicked:', soundName);

            let selectedAudio = null;

            // Select the right audio
            if (soundName === 'beach') selectedAudio = beachSound;
            if (soundName === 'forest') selectedAudio = forestSound;
            if (soundName === 'city') selectedAudio = citySound;
            if (soundName === 'rain') selectedAudio = rainSound;

            // If same button clicked, stop
            if (currentAudio === selectedAudio && !selectedAudio.paused) {
                console.log('⏹️ Stopping:', soundName);
                selectedAudio.pause();
                selectedAudio.currentTime = 0;
                this.textContent = 'Play';
                this.classList.remove('playing');
                currentAudio = null;
                currentButton = null;
            } 
            // Otherwise, play new sound
            else {
                console.log('▶️ Playing:', soundName);

                // Stop previous sound
                if (currentAudio) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                    if (currentButton) {
                        currentButton.textContent = 'Play';
                        currentButton.classList.remove('playing');
                    }
                }

                // Play new sound
                selectedAudio.play()
                    .then(function() {
                        console.log('✅ Sound playing successfully!');
                        button.textContent = 'Stop';
                        button.classList.add('playing');
                        currentAudio = selectedAudio;
                        currentButton = button;
                    })
                    .catch(function(error) {
                        console.error('❌ Error playing sound:', error);
                        alert('Cannot play sound!\n\nCheck:\n1. File exists: sounds/' + soundName + '.mp3\n2. File name is correct\n3. Using Live Server\n\nError: ' + error.message);
                    });
            }
        });
    });

    // Volume slider
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeValue = document.getElementById('volumeValue');

    if (volumeSlider) {
        volumeSlider.addEventListener('input', function() {
            const vol = this.value / 100;
            beachSound.volume = vol;
            forestSound.volume = vol;
            citySound.volume = vol;
            rainSound.volume = vol;
            volumeValue.textContent = this.value + '%';
            console.log('🔊 Volume changed to:', this.value + '%');
        });
    }

    console.log('✅ Sound setup complete!');

    // Rest of the code (destination tracker, etc.)
    const destinationForm = document.getElementById('destinationForm');

    if (destinationForm) {
        destinationForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('destinationName').value.trim();
            const country = document.getElementById('destinationCountry').value.trim();
            const statusElement = document.querySelector('input[name="status"]:checked');
            
            if (!statusElement) {
                alert('Please select Visited or Planned');
                return;
            }
            
            const status = statusElement.value;

            const destination = {
                id: Date.now(),
                name: name,
                country: country,
                status: status,
                date: new Date().toLocaleDateString()
            };

            let destinations = JSON.parse(localStorage.getItem('trackedDestinations')) || [];
            destinations.push(destination);
            localStorage.setItem('trackedDestinations', JSON.stringify(destinations));

            destinationForm.reset();
            displayDestinations('all');
            updateStats();
            alert('✓ Destination added!');
        });
    }

    const tabButtons = document.querySelectorAll('.tab-btn');

    tabButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            tabButtons.forEach(function(btn) {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            const tab = this.getAttribute('data-tab');
            displayDestinations(tab);
        });
    });

    function displayDestinations(filter) {
        const destinationsList = document.getElementById('destinationsList');
        const destinations = JSON.parse(localStorage.getItem('trackedDestinations')) || [];

        let filtered = destinations;
        
        if (filter === 'visited') {
            filtered = destinations.filter(d => d.status === 'visited');
        } else if (filter === 'planned') {
            filtered = destinations.filter(d => d.status === 'planned');
        }

        if (filtered.length === 0) {
            destinationsList.innerHTML = '<p class="empty-state">No destinations yet!</p>';
            return;
        }

        destinationsList.innerHTML = '';

        filtered.forEach(function(dest) {
            const item = document.createElement('div');
            item.className = 'destination-item ' + dest.status;
            item.innerHTML = `
                <div class="destination-info">
                    <h4>${dest.name}</h4>
                    <p>${dest.country} • ${dest.date}</p>
                </div>
                <span class="destination-status ${dest.status}">${dest.status}</span>
                <button class="delete-btn" data-id="${dest.id}">×</button>
            `;
            destinationsList.appendChild(item);
        });

        document.querySelectorAll('.delete-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                deleteDestination(id);
            });
        });
    }

    function deleteDestination(id) {
        if (!confirm('Remove this destination?')) return;

        let destinations = JSON.parse(localStorage.getItem('trackedDestinations')) || [];
        destinations = destinations.filter(dest => dest.id !== id);
        localStorage.setItem('trackedDestinations', JSON.stringify(destinations));

        const activeTab = document.querySelector('.tab-btn.active');
        const tab = activeTab ? activeTab.getAttribute('data-tab') : 'all';
        displayDestinations(tab);
        updateStats();
    }

    function updateStats() {
        const destinations = JSON.parse(localStorage.getItem('trackedDestinations')) || [];
        
        const visitedCount = destinations.filter(d => d.status === 'visited').length;
        const plannedCount = destinations.filter(d => d.status === 'planned').length;
        const totalCount = destinations.length;

        const visitedEl = document.getElementById('visitedCount');
        const plannedEl = document.getElementById('plannedCount');
        const totalEl = document.getElementById('totalCount');

        if (visitedEl) visitedEl.textContent = visitedCount;
        if (plannedEl) plannedEl.textContent = plannedCount;
        if (totalEl) totalEl.textContent = totalCount;
    }

    displayDestinations('all');
    updateStats();
});