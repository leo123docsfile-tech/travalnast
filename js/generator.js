// Random Trip Generator JavaScript - Using JSON File with Images

document.addEventListener('DOMContentLoaded', function() {
    
    // // Hamburger Menu Toggle
    // const hamburger = document.getElementById('hamburger');
    // const navMenu = document.getElementById('navMenu');

    // if (hamburger && navMenu) {
    //     hamburger.addEventListener('click', function() {
    //         navMenu.classList.toggle('active');
    //     });
    // }

    let trips = {};

    // Load trips from JSON file
    fetch('js/json/trips.json')
        .then(response => response.json())
        .then(data => {
            trips = data;
        })
        .catch(error => {
            console.error('Error loading trips:', error);
            alert('Error loading trip data. Please refresh the page.');
        });

    const generatorForm = document.getElementById('generatorForm');
    const resultSection = document.getElementById('resultSection');
    const surpriseBtn = document.getElementById('surpriseBtn');
    const wishlistBtn = document.getElementById('wishlistBtn');

    let currentTrip = null;

    // Generate Trip
    if (generatorForm) {
        generatorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            generateRandomTrip();
        });
    }

    // Surprise Me Again Button
    if (surpriseBtn) {
        surpriseBtn.addEventListener('click', function() {
            generateRandomTrip();
        });
    }

    // Generate Random Trip Function
    function generateRandomTrip() {
        const travelType = document.getElementById('travelType').value;
        const budgetRange = document.getElementById('budgetRange').value;

        if (!travelType || !budgetRange) {
            alert('Please select both travel type and budget range!');
            return;
        }

        // Get trips for selected type and budget
        const availableTrips = trips[travelType][budgetRange];
        
        // Select random trip
        const randomTrip = availableTrips[Math.floor(Math.random() * availableTrips.length)];

        // Display trip with image
        document.getElementById('generatedDestination').textContent = randomTrip.name;
        document.getElementById('generatedCountry').textContent = randomTrip.country;
        document.getElementById('generatedDescription').textContent = randomTrip.description;
        document.getElementById('generatedType').textContent = travelType.charAt(0).toUpperCase() + travelType.slice(1);
        document.getElementById('generatedBudget').textContent = budgetRange.charAt(0).toUpperCase() + budgetRange.slice(1);
        
        // Set image
        const generatedImage = document.getElementById('generatedImage');
        if (generatedImage) {
            generatedImage.style.backgroundImage = `url('${randomTrip.image}')`;
            generatedImage.style.backgroundSize = 'cover';
            generatedImage.style.backgroundPosition = 'center';
        }

        // Store current trip
        currentTrip = randomTrip;

        // Show result
        const placeholder = document.querySelector('.result-placeholder');
        const resultContent = document.getElementById('resultContent');
        
        if (placeholder) placeholder.style.display = 'none';
        if (resultContent) resultContent.style.display = 'block';
    }

    // Add to Wishlist
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function() {
            if (currentTrip) {
                let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
                
                // Check if already in wishlist
                const exists = wishlist.some(item => item.name === currentTrip.name);
                
                if (exists) {
                    alert('This destination is already in your wishlist!');
                } else {
                    wishlist.push(currentTrip);
                    localStorage.setItem('wishlist', JSON.stringify(wishlist));
                    alert('Added to wishlist!');
                    displayWishlist();
                }
            }
        });
    }

    // Display Wishlist with Images
    function displayWishlist() {
        const wishlistContainer = document.getElementById('wishlistContainer');
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

        if (wishlist.length === 0) {
            wishlistContainer.innerHTML = '<p class="empty-message">Your wishlist is empty. Generate trips and add your favorites!</p>';
            return;
        }

        wishlistContainer.innerHTML = '';

        wishlist.forEach(function(item, index) {
            const wishlistItem = document.createElement('div');
            wishlistItem.className = 'wishlist-item';
            wishlistItem.innerHTML = `
                <div class="wishlist-image" style="background-image: url('${item.image}'); background-size: cover; background-position: center; height: 150px; border-radius: 8px; margin-bottom: 1rem;"></div>
                <button class="remove-btn" data-index="${index}">×</button>
                <h4>${item.name}</h4>
                <p>${item.country}</p>
                <p style="font-size: 0.85rem;">${item.description}</p>
            `;
            wishlistContainer.appendChild(wishlistItem);
        });

        // Add remove functionality
        document.querySelectorAll('.remove-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                removeFromWishlist(index);
            });
        });
    }

    // Remove from Wishlist
    function removeFromWishlist(index) {
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        wishlist.splice(index, 1);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        displayWishlist();
    }

    // Load wishlist on page load
    displayWishlist();
});