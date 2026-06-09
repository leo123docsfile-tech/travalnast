// Travel Mood JavaScript - Ambient Sounds and Destination Tracking

document.addEventListener('DOMContentLoaded', function() {
    
    // // Hamburger Menu Toggle
    // const hamburger = document.getElementById('hamburger');
    // const navMenu = document.getElementById('navMenu');

    // if (hamburger && navMenu) {
    //     hamburger.addEventListener('click', function() {
    //         navMenu.classList.toggle('active');
    //     });
    // }

    // Ambient Sound Toggles - Simple Play/Pause
    const soundButtons = document.querySelectorAll('.sound-toggle');
    let currentlyPlaying = null;

    soundButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const soundType = this.getAttribute('data-sound');

            // Stop all sounds first
            soundButtons.forEach(function(btn) {
                btn.textContent = 'Play';
                btn.classList.remove('playing');
            });

            // Toggle current sound
            if (currentlyPlaying === soundType) {
                currentlyPlaying = null;
                this.textContent = 'Play';
            } else {
                currentlyPlaying = soundType;
                this.textContent = 'Stop';
                this.classList.add('playing');
                
                // Show message (simulating sound play)
                alert('Playing ' + soundType + ' sounds... (In real app, actual audio would play here)');
            }
        });
    });

    // Destination Tracker Form
    const destinationForm = document.getElementById('destinationForm');

    if (destinationForm) {
        destinationForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('destinationName').value;
            const country = document.getElementById('destinationCountry').value;
            const statusElement = document.querySelector('input[name="status"]:checked');
            
            if (!statusElement) {
                alert('Please select a status (Visited or Planned)');
                return;
            }
            
            const status = statusElement.value;

            // Create destination object
            const destination = {
                name: name,
                country: country,
                status: status,
                date: new Date().toLocaleDateString()
            };

            // Save to localStorage
            let destinations = JSON.parse(localStorage.getItem('trackedDestinations')) || [];
            destinations.push(destination);
            localStorage.setItem('trackedDestinations', JSON.stringify(destinations));

            // Reset form
            destinationForm.reset();

            // Update display
            displayDestinations('all');
            updateStats();

            // Show success message
            alert('Destination added successfully!');
        });
    }

    // Tab Buttons
    const tabButtons = document.querySelectorAll('.tab-btn');

    tabButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            tabButtons.forEach(function(btn) {
                btn.classList.remove('active');
            });

            // Add active class to clicked button
            this.classList.add('active');

            // Display filtered destinations
            const tab = this.getAttribute('data-tab');
            displayDestinations(tab);
        });
    });

    // Display Destinations Function
    function displayDestinations(filter) {
        const destinationsList = document.getElementById('destinationsList');
        const destinations = JSON.parse(localStorage.getItem('trackedDestinations')) || [];

        // Filter destinations
        let filtered = destinations;
        if (filter === 'visited') {
            filtered = destinations.filter(d => d.status === 'visited');
        } else if (filter === 'planned') {
            filtered = destinations.filter(d => d.status === 'planned');
        }

        // Display
        if (filtered.length === 0) {
            destinationsList.innerHTML = '<p class="empty-state">No destinations in this category yet!</p>';
            return;
        }

        destinationsList.innerHTML = '';

        filtered.forEach(function(dest, index) {
            const item = document.createElement('div');
            item.className = 'destination-item ' + dest.status;
            item.innerHTML = `
                <div class="destination-info">
                    <h4>${dest.name}</h4>
                    <p>${dest.country} • Added on ${dest.date}</p>
                </div>
                <span class="destination-status ${dest.status}">${dest.status}</span>
                <button class="delete-btn" data-index="${index}">×</button>
            `;
            destinationsList.appendChild(item);
        });

        // Add delete functionality
        document.querySelectorAll('.delete-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                deleteDestination(index);
            });
        });
    }

    // Delete Destination
    function deleteDestination(index) {
        let destinations = JSON.parse(localStorage.getItem('trackedDestinations')) || [];
        destinations.splice(index, 1);
        localStorage.setItem('trackedDestinations', JSON.stringify(destinations));
        
        // Refresh display
        const activeTab = document.querySelector('.tab-btn.active');
        const tab = activeTab ? activeTab.getAttribute('data-tab') : 'all';
        displayDestinations(tab);
        updateStats();
    }

    // Update Statistics
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

    // Load data on page load
    displayDestinations('all');
    updateStats();
});