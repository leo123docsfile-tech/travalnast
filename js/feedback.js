// Feedback & Support JavaScript - Form Validation and FAQ

document.addEventListener('DOMContentLoaded', function() {
    
    // // Hamburger Menu Toggle
    // const hamburger = document.getElementById('hamburger');
    // const navMenu = document.getElementById('navMenu');

    // if (hamburger && navMenu) {
    //     hamburger.addEventListener('click', function() {
    //         navMenu.classList.toggle('active');
    //     });
    // }

    // Feedback Form Validation
    const feedbackForm = document.getElementById('feedbackForm');
    const successMessage = document.getElementById('successMessage');

    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('userName').value.trim();
            const email = document.getElementById('userEmail').value.trim();
            const type = document.getElementById('feedbackType').value;
            const message = document.getElementById('userMessage').value.trim();

            // Clear previous errors
            document.getElementById('nameError').textContent = '';
            document.getElementById('emailError').textContent = '';
            document.getElementById('messageError').textContent = '';

            let isValid = true;

            // Validate Name (at least 2 characters)
            if (name.length < 2) {
                document.getElementById('nameError').textContent = 'Name must be at least 2 characters';
                isValid = false;
            }

            // Validate Email (simple check)
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                document.getElementById('emailError').textContent = 'Please enter a valid email address';
                isValid = false;
            }

            // Validate Message (at least 10 characters)
            if (message.length < 10) {
                document.getElementById('messageError').textContent = 'Message must be at least 10 characters';
                isValid = false;
            }

            // If valid, save and show success
            if (isValid) {
                // Create feedback object
                const feedback = {
                    name: name,
                    email: email,
                    type: type,
                    message: message,
                    date: new Date().toLocaleString()
                };

                // Save to localStorage
                let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
                feedbacks.push(feedback);
                localStorage.setItem('feedbacks', JSON.stringify(feedbacks));

                // Show success message
                if (successMessage) {
                    successMessage.classList.add('show');
                }

                // Reset form
                feedbackForm.reset();

                // Update feedback list
                displayFeedbacks();

                // Hide success message after 5 seconds
                setTimeout(function() {
                    if (successMessage) {
                        successMessage.classList.remove('show');
                    }
                }, 5000);
            }
        });
    }

    // Display Submitted Feedbacks
    function displayFeedbacks() {
        const feedbackList = document.getElementById('feedbackList');
        const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];

        if (feedbacks.length === 0) {
            feedbackList.innerHTML = '<p class="empty-message">No feedback submitted yet.</p>';
            return;
        }

        feedbackList.innerHTML = '';

        // Show only last 3 feedbacks
        const recentFeedbacks = feedbacks.slice(-3).reverse();

        recentFeedbacks.forEach(function(fb) {
            const item = document.createElement('div');
            item.className = 'feedback-item';
            item.innerHTML = `
                <h4>${fb.name}</h4>
                <p><strong>Type:</strong> ${fb.type}</p>
                <p>${fb.message.substring(0, 100)}${fb.message.length > 100 ? '...' : ''}</p>
                <small>Submitted on ${fb.date}</small>
            `;
            feedbackList.appendChild(item);
        });
    }

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(function(question) {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');

            // Close all FAQs
            document.querySelectorAll('.faq-item').forEach(function(item) {
                item.classList.remove('active');
            });

            // Open clicked FAQ if it wasn't active
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });

    // Newsletter Form (in footer)
    const newsletterForm = document.getElementById('newsletterForm');
    const emailInput = document.getElementById('emailInput');
    const subscribeMessage = document.getElementById('subscribeMessage');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = emailInput.value;

            // Save to localStorage
            let subscribers = JSON.parse(localStorage.getItem('subscribers')) || [];
            
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

            setTimeout(function() {
                subscribeMessage.textContent = '';
            }, 3000);
        });
    }

    // Load feedbacks on page load
    displayFeedbacks();
});