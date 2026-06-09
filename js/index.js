// Home Page JavaScript - With Dynamic Images

document.addEventListener('DOMContentLoaded', function() {
    
    // // Hamburger Menu Toggle
    // const hamburger = document.getElementById('hamburger');
    // const navMenu = document.getElementById('navMenu');

    // if (hamburger && navMenu) {
    //     hamburger.addEventListener('click', function() {
    //         navMenu.classList.toggle('active');
    //     });
    // }

    // Travel Quotes with Images - Rotates every 4 seconds
    const quotes = [
        {
            text: "Welcome to TravelNest - Your Journey Begins Here",
            image: "assets/image/home_page/logo.png"
            // I make this logo through gemini ai --> https://gemini.google.com/share/053c57f1af13
        },
        {
            text: "The World is a Book, and Those Who Do Not Travel Read Only One Page",
            image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80"
        },
        {
            text: "Travel is the Only Thing You Buy That Makes You Richer",
            image: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=1200&q=80"
        },
        {
            text: "Adventure Awaits - Start Exploring Today",
            image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80"
        },
        {
            text: "Collect Moments, Not Things",
            image: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=1200&q=80"
        }
    ];

    let currentQuote = 0;
    const quoteElement = document.getElementById('travelQuote');
    const heroImage = document.getElementById('heroImage');

    // Set initial image
    if (heroImage) {
        heroImage.style.backgroundImage = `url('${quotes[0].image}')`;
    }

    // Change quote and image every 4 seconds
    setInterval(function() {
        currentQuote = (currentQuote + 1) % quotes.length;
        
        if (quoteElement) {
            quoteElement.style.opacity = '0';
            
            setTimeout(function() {
                quoteElement.textContent = quotes[currentQuote].text;
                if (heroImage) {
                    heroImage.style.backgroundImage = `url('${quotes[currentQuote].image}')`;
                }
                quoteElement.style.opacity = '1';
            }, 300);
        }
    }, 4000);

    // Destination of the Day with Images - Changes based on day of week
    const destinations = [
        { 
            name: "Paris", 
            country: "France",
            image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80"
        },
        { 
            name: "Tokyo", 
            country: "Japan",
            image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80"
        },
        { 
            name: "New York", 
            country: "USA",
            image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80"
        },
        { 
            name: "Dubai", 
            country: "UAE",
            image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80"
        },
        { 
            name: "London", 
            country: "UK",
            image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80"
        },
        { 
            name: "Bali", 
            country: "Indonesia",
            image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80"
        },
        { 
            name: "Rome", 
            country: "Italy",
            image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80"
        }
    ];

    // Use current day of week to select destination (0-6)
    const today = new Date().getDay();
    const todayDestination = destinations[today];

    const destNameEl = document.getElementById('destName');
    const destCountryEl = document.getElementById('destCountry');
    const featuredImageEl = document.getElementById('featuredImage');

    if (destNameEl) destNameEl.textContent = todayDestination.name;
    if (destCountryEl) destCountryEl.textContent = todayDestination.country;
    if (featuredImageEl) {
        featuredImageEl.style.backgroundImage = `url('${todayDestination.image}')`;
    }

    console.log('✅ Today\'s destination:', todayDestination.name);
    console.log('🖼️ Images loaded successfully');

    // Newsletter Form
    const newsletterForm = document.getElementById('newsletterForm');
    const emailInput = document.getElementById('emailInput');
    const subscribeMessage = document.getElementById('subscribeMessage');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = emailInput.value;

            // Save email to localStorage
            let subscribers = JSON.parse(localStorage.getItem('subscribers')) || [];
            
            // Check if email already exists
            if (subscribers.includes(email)) {
                subscribeMessage.textContent = 'You are already subscribed!';
                subscribeMessage.style.color = '#6B8F71';
            } else {
                subscribers.push(email);
                localStorage.setItem('subscribers', JSON.stringify(subscribers));
                subscribeMessage.textContent = 'Thank you for subscribing!';
                subscribeMessage.style.color = '#AEC3B0';
                emailInput.value = '';
            }

            // Clear message after 3 seconds
            setTimeout(function() {
                subscribeMessage.textContent = '';
            }, 3000);
        });
    }
});