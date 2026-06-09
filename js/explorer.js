// Destination Explorer JavaScript - Using JSON File with Images

document.addEventListener('DOMContentLoaded', function() {
    
    // // Hamburger Menu Toggle
    // const hamburger = document.getElementById('hamburger');
    // const navMenu = document.getElementById('navMenu');

    // if (hamburger && navMenu) {
    //     hamburger.addEventListener('click', function() {
    //         navMenu.classList.toggle('active');
    //     });
    // }

    let destinations = [];

    // Load destinations from JSON file
    fetch('js/json/destinations.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Could not load destinations.json');
            }
            return response.json();
        })
        .then(data => {
            destinations = data;
            displayDestinations(destinations);
        })
        .catch(error => {
            console.error('Error loading destinations:', error);
            document.getElementById('destinationsGrid').innerHTML = 
                '<p style="grid-column: 1/-1; text-align: center; color: #6B8F71; padding: 2rem;">Error loading destinations. Please make sure you are using a local server (Live Server in VS Code).</p>';
        });

    // Filter by Continent
    const continentFilter = document.getElementById('continentFilter');
    if (continentFilter) {
        continentFilter.addEventListener('change', function() {
            filterDestinations();
        });
    }

    // Search by Name
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterDestinations();
        });
    }

    // Filter Function
    function filterDestinations() {
        const selectedContinent = continentFilter.value;
        const searchTerm = searchInput.value.toLowerCase();

        let filtered = destinations;

        if (selectedContinent !== 'all') {
            filtered = filtered.filter(dest => dest.continent === selectedContinent);
        }

        if (searchTerm) {
            filtered = filtered.filter(dest => 
                dest.name.toLowerCase().includes(searchTerm) ||
                dest.country.toLowerCase().includes(searchTerm)
            );
        }

        displayDestinations(filtered);
    }

    // Display Destinations as Cards with Images
    function displayDestinations(destArray) {
        const grid = document.getElementById('destinationsGrid');
        grid.innerHTML = '';

        if (destArray.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #6B8F71; padding: 2rem;">No destinations found. Try different filters!</p>';
            return;
        }

        destArray.forEach(function(dest) {
            const card = document.createElement('div');
            card.className = 'destination-card';
            card.innerHTML = `
                <div class="card-image" style="background-image: url('${dest.image}'); background-size: cover; background-position: center;"></div>
                <div class="card-content">
                    <h3>${dest.name}</h3>
                    <p>${dest.country} • ${dest.continent}</p>
                </div>
            `;

            card.addEventListener('click', function() {
                openModal(dest);
            });

            grid.appendChild(card);
        });
    }

    // Modal Functions
    const modal = document.getElementById('destinationModal');
    const closeBtn = document.querySelector('.close');

    function openModal(dest) {
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        const modalImage = document.getElementById('modalImage');

        if (modalImage) {
            modalImage.style.backgroundImage = `url('${dest.image}')`;
            modalImage.style.backgroundSize = 'cover';
            modalImage.style.backgroundPosition = 'center';
        }

        modalTitle.textContent = dest.name + ', ' + dest.country;

        let attractionsList = '';
        dest.attractions.forEach(function(attraction) {
            attractionsList += '<li>' + attraction + '</li>';
        });

        modalBody.innerHTML = `
            <div class="modal-description">
                <p>${dest.description}</p>
            </div>
            
            <div class="modal-attractions">
                <h3>Popular Attractions</h3>
                <ul>${attractionsList}</ul>
            </div>

            <div class="modal-costs">
                <h3>Travel Cost Comparison</h3>
                <table class="cost-table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Accommodation</td>
                            <td>${dest.costs.accommodation}</td>
                        </tr>
                        <tr>
                            <td>Food</td>
                            <td>${dest.costs.food}</td>
                        </tr>
                        <tr>
                            <td>Transport</td>
                            <td>${dest.costs.transport}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;

        modal.style.display = 'block';
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

       