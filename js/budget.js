// Budget Planner JavaScript - Simple Calculations

document.addEventListener('DOMContentLoaded', function() {
    
    // // Hamburger Menu Toggle
    // const hamburger = document.getElementById('hamburger');
    // const navMenu = document.getElementById('navMenu');

    // if (hamburger && navMenu) {
    //     hamburger.addEventListener('click', function() {
    //         navMenu.classList.toggle('active');
    //     });
    // }

    // Budget Form
    const budgetForm = document.getElementById('budgetForm');
    const resultSection = document.getElementById('resultSection');
    const saveBudgetBtn = document.getElementById('saveBudget');

    let currentBudget = null;

    // Calculate Budget
    if (budgetForm) {
        budgetForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const destination = document.getElementById('destination').value;
            const days = parseInt(document.getElementById('days').value);
            const dailyBudget = parseFloat(document.getElementById('dailyBudget').value);

            // Simple calculation
            const totalCost = days * dailyBudget;

            // Determine budget status
            let status = '';
            let progressWidth = 0;

            if (dailyBudget < 50) {
                status = 'Low Budget';
                progressWidth = 33;
            } else if (dailyBudget >= 50 && dailyBudget < 150) {
                status = 'Moderate Budget';
                progressWidth = 66;
            } else {
                status = 'Luxury Budget';
                progressWidth = 100;
            }

            // Display results
            document.getElementById('totalCost').textContent = '$' + totalCost.toFixed(2);
            document.getElementById('budgetStatus').textContent = status;
            document.getElementById('progressBar').style.width = progressWidth + '%';

            // Store current budget
            currentBudget = {
                destination: destination,
                days: days,
                dailyBudget: dailyBudget,
                totalCost: totalCost,
                status: status,
                date: new Date().toLocaleDateString()
            };

            // Show result section
            if (resultSection) {
                resultSection.style.display = 'block';
            }
        });
    }

    // Save Budget to localStorage
    if (saveBudgetBtn) {
        saveBudgetBtn.addEventListener('click', function() {
            if (currentBudget) {
                // Get existing budgets
                let savedBudgets = JSON.parse(localStorage.getItem('tripBudgets')) || [];
                
                // Add current budget
                savedBudgets.push(currentBudget);
                
                // Save to localStorage
                localStorage.setItem('tripBudgets', JSON.stringify(savedBudgets));
                
                // Show confirmation
                alert('Budget saved successfully!');
                
                // Update display
                displaySavedBudgets();
            }
        });
    }

    // Display Saved Budgets
    function displaySavedBudgets() {
        const savedList = document.getElementById('savedBudgetsList');
        const savedBudgets = JSON.parse(localStorage.getItem('tripBudgets')) || [];

        if (savedBudgets.length === 0) {
            savedList.innerHTML = '<p>No saved budgets yet. Create your first budget above!</p>';
            return;
        }

        savedList.innerHTML = '';

        savedBudgets.forEach(function(budget, index) {
            const budgetItem = document.createElement('div');
            budgetItem.className = 'saved-budget-item';
            budgetItem.innerHTML = `
                <h4>${budget.destination}</h4>
                <p><strong>Duration:</strong> ${budget.days} days</p>
                <p><strong>Daily Budget:</strong> $${budget.dailyBudget}</p>
                <p><strong>Total Cost:</strong> $${budget.totalCost.toFixed(2)}</p>
                <p><strong>Status:</strong> ${budget.status}</p>
                <p><strong>Saved on:</strong> ${budget.date}</p>
            `;
            savedList.appendChild(budgetItem);
        });
    }

    // Load saved budgets on page load
    displaySavedBudgets();
});