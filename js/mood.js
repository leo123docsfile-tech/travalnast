// Travel Mood JavaScript - Ambient Sounds and Destination Tracking

document.addEventListener('DOMContentLoaded', function() {

    // =============================================
    // AMBIENT SOUNDS - Real Audio Play/Stop
    // =============================================

    const soundButtons = document.querySelectorAll('.sound-toggle');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeValue = document.getElementById('volumeValue');

    let currentAudio = null;
    let currentlyPlaying = null;
    let currentVolume = 0.7;

    // Volume slider control
    if (volumeSlider) {
        volumeSlider.addEventListener('input', function() {
            currentVolume = parseFloat(this.value);
            volumeValue.textContent = Math.round(currentVolume * 100) + '%';
            if (currentAudio) {
                currentAudio.volume = currentVolume;
            }
        });
    }

    // Play / Stop buttons
    soundButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const soundType = this.getAttribute('data-sound');

            // If same button clicked while playing — stop it
            if (currentlyPlaying === soundType) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
                currentAudio = null;
                currentlyPlaying = null;
                this.textContent = '▶ Play';
                this.classList.remove('playing');
                return;
            }

            // Stop any currently playing sound
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }

            // Reset all buttons to Play
            soundButtons.forEach(function(btn) {
                btn.textContent = '▶ Play';
                btn.classList.remove('playing');
            });

            // Play the new sound
            currentAudio = new Audio('assets/audio/' + soundType + '.mp3');
            currentAudio.loop = true;
            currentAudio.volume = currentVolume;
            currentAudio.play().catch(function(error) {
                console.error('Audio play failed:', error);
                alert('Could not play audio. Make sure the file exists at assets/audio/' + soundType + '.mp3');
            });

            currentlyPlaying = soundType;
            this.textContent = '■ Stop';
            this.classList.add('playing');
        });
    });

    // =============================================
    // DESTINATION TRACKER
    // =============================================

    const destinationForm = document.getElementById('destinationForm');

    if (destinationForm) {
        destinationForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('destinationName').value.trim();
            const country = document.getElementById('destinationCountry').value.trim();
            const statusElement = document.querySelector('input[name="status"]:checked');

            if (!statusElement) {
                alert('Please select a status (Visited or Planned)');
                return;
            }

            const status = statusElement.value;

            const destination = {
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

            // Set "All" tab as active after adding
            document.querySelectorAll('.tab-btn').forEach(function(btn) {
                btn.classList.remove('active');
            });
            document.querySelector('[data-tab="all"]').classList.add('active');
        });
    }

    // =============================================
    // TAB BUTTONS
    // =============================================

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

    // =============================================
    // DISPLAY DESTINATIONS
    // =============================================

    function displayDestinations(filter) {
        const destinationsList = document.getElementById('destinationsList');
        const destinations = JSON.parse(localStorage.getItem('trackedDestinations')) || [];

        let filtered = destinations;
        if (filter === 'visited') {
            filtered = destinations.filter(function(d) { return d.status === 'visited'; });
        } else if (filter === 'planned') {
            filtered = destinations.filter(function(d) { return d.status === 'planned'; });
        }

        if (filtered.length === 0) {
            destinationsList.innerHTML = '<p class="empty-state">No destinations in this category yet!</p>';
            return;
        }

        destinationsList.innerHTML = '';

        filtered.forEach(function(dest, index) {
            // Find real index in full array for deletion
            const realIndex = destinations.indexOf(dest);
            const item = document.createElement('div');
            item.className = 'destination-item ' + dest.status;
            item.innerHTML = `
                <div class="destination-info">
                    <h4>${dest.name}</h4>
                    <p>${dest.country} &bull; Added on ${dest.date}</p>
                </div>
                <span class="destination-status ${dest.status}">${dest.status.charAt(0).toUpperCase() + dest.status.slice(1)}</span>
                <button class="delete-btn" data-index="${realIndex}" title="Remove destination">&times;</button>
            `;
            destinationsList.appendChild(item);
        });

        // Delete buttons
        document.querySelectorAll('.delete-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                deleteDestination(index);
            });
        });
    }

    // =============================================
    // DELETE DESTINATION
    // =============================================

    function deleteDestination(index) {
        let destinations = JSON.parse(localStorage.getItem('trackedDestinations')) || [];
        destinations.splice(index, 1);
        localStorage.setItem('trackedDestinations', JSON.stringify(destinations));

        const activeTab = document.querySelector('.tab-btn.active');
        const tab = activeTab ? activeTab.getAttribute('data-tab') : 'all';
        displayDestinations(tab);
        updateStats();
    }

    // =============================================
    // UPDATE STATISTICS
    // =============================================

    function updateStats() {
        const destinations = JSON.parse(localStorage.getItem('trackedDestinations')) || [];

        const visitedCount = destinations.filter(function(d) { return d.status === 'visited'; }).length;
        const plannedCount = destinations.filter(function(d) { return d.status === 'planned'; }).length;
        const totalCount = destinations.length;

        const visitedEl = document.getElementById('visitedCount');
        const plannedEl = document.getElementById('plannedCount');
        const totalEl = document.getElementById('totalCount');

        if (visitedEl) visitedEl.textContent = visitedCount;
        if (plannedEl) plannedEl.textContent = plannedCount;
        if (totalEl) totalEl.textContent = totalCount;
    }

    // =============================================
    // INITIAL LOAD
    // =============================================

    displayDestinations('all');
    updateStats();
});
