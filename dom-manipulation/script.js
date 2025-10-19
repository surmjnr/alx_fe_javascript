// Array of quote objects with text and category
let quotes = [
    {
        text: "The only way to do great work is to love what you do.",
        category: "Motivation"
    },
    {
        text: "Innovation distinguishes between a leader and a follower.",
        category: "Leadership"
    },
    {
        text: "Life is what happens to you while you're busy making other plans.",
        category: "Life"
    },
    {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        category: "Dreams"
    },
    {
        text: "It is during our darkest moments that we must focus to see the light.",
        category: "Hope"
    },
    {
        text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        category: "Success"
    },
    {
        text: "The way to get started is to quit talking and begin doing.",
        category: "Action"
    },
    {
        text: "Don't be afraid to give up the good to go for the great.",
        category: "Growth"
    }
];

// Function to display a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    
    // Get a random quote from the array
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    
    // Create DOM elements dynamically
    const quoteTextElement = document.createElement('div');
    quoteTextElement.className = 'quote-text';
    quoteTextElement.textContent = `"${randomQuote.text}"`;
    
    const quoteCategoryElement = document.createElement('div');
    quoteCategoryElement.className = 'quote-category';
    quoteCategoryElement.textContent = `- ${randomQuote.category}`;
    
    // Clear existing content and add new elements
    quoteDisplay.innerHTML = '';
    quoteDisplay.appendChild(quoteTextElement);
    quoteDisplay.appendChild(quoteCategoryElement);
    
    // Add a subtle animation effect
    quoteDisplay.style.opacity = '0';
    setTimeout(() => {
        quoteDisplay.style.opacity = '1';
        quoteDisplay.style.transition = 'opacity 0.5s ease-in-out';
    }, 50);
}

// Function to add a new quote to the array and update the display
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value.trim();
    const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();
    
    // Validate input
    if (!newQuoteText || !newQuoteCategory) {
        alert('Please fill in both quote text and category!');
        return;
    }
    
    // Create new quote object
    const newQuote = {
        text: newQuoteText,
        category: newQuoteCategory
    };
    
    // Add to quotes array
    quotes.push(newQuote);
    
    // Clear the form inputs
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    
    // Show success message
    showSuccessMessage('Quote added successfully!');
    
    // Optionally display the newly added quote
    setTimeout(() => {
        showRandomQuote();
    }, 1000);
}

// Function to show success message
function showSuccessMessage(message) {
    const quoteDisplay = document.getElementById('quoteDisplay');
    
    const successElement = document.createElement('div');
    successElement.className = 'quote-text';
    successElement.style.color = '#28a745';
    successElement.textContent = message;
    
    quoteDisplay.innerHTML = '';
    quoteDisplay.appendChild(successElement);
    
    // Add animation
    quoteDisplay.style.opacity = '0';
    setTimeout(() => {
        quoteDisplay.style.opacity = '1';
        quoteDisplay.style.transition = 'opacity 0.5s ease-in-out';
    }, 50);
}

// Function to create and manage the add quote form (enhanced version)
function createAddQuoteForm() {
    const formContainer = document.querySelector('.form-container');
    
    // Add form validation feedback
    const feedbackElement = document.createElement('div');
    feedbackElement.id = 'formFeedback';
    feedbackElement.style.marginTop = '10px';
    feedbackElement.style.fontSize = '14px';
    feedbackElement.style.color = '#dc3545';
    
    formContainer.appendChild(feedbackElement);
    
    // Add real-time validation
    const quoteTextInput = document.getElementById('newQuoteText');
    const quoteCategoryInput = document.getElementById('newQuoteCategory');
    
    function validateForm() {
        const text = quoteTextInput.value.trim();
        const category = quoteCategoryInput.value.trim();
        
        if (text.length > 0 && category.length > 0) {
            feedbackElement.textContent = '';
            feedbackElement.style.color = '#28a745';
            return true;
        } else if (text.length > 0 || category.length > 0) {
            feedbackElement.textContent = 'Please fill in both fields';
            feedbackElement.style.color = '#dc3545';
            return false;
        } else {
            feedbackElement.textContent = '';
            return false;
        }
    }
    
    // Add event listeners for real-time validation
    quoteTextInput.addEventListener('input', validateForm);
    quoteCategoryInput.addEventListener('input', validateForm);
    
    // Add keyboard support (Enter key to add quote)
    quoteTextInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            quoteCategoryInput.focus();
        }
    });
    
    quoteCategoryInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && validateForm()) {
            addQuote();
        }
    });
}

// Function to display quote statistics
function showQuoteStats() {
    const statsElement = document.createElement('div');
    statsElement.style.textAlign = 'center';
    statsElement.style.marginTop = '20px';
    statsElement.style.fontSize = '14px';
    statsElement.style.color = '#666';
    statsElement.innerHTML = `
        <p>Total Quotes: ${quotes.length}</p>
        <p>Categories: ${[...new Set(quotes.map(q => q.category))].length}</p>
    `;
    
    document.body.appendChild(statsElement);
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners
    document.getElementById('newQuote').addEventListener('click', showRandomQuote);
    
    // Initialize the enhanced form
    createAddQuoteForm();
    
    // Show initial quote statistics
    showQuoteStats();
    
    // Display a welcome message
    setTimeout(() => {
        showRandomQuote();
    }, 500);
});

// Additional utility functions for advanced DOM manipulation

// Function to filter quotes by category
function filterQuotesByCategory(category) {
    return quotes.filter(quote => 
        quote.category.toLowerCase().includes(category.toLowerCase())
    );
}

// Function to search quotes by text
function searchQuotes(searchTerm) {
    return quotes.filter(quote => 
        quote.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
}

// Function to get random quote from specific category
function getRandomQuoteFromCategory(category) {
    const categoryQuotes = filterQuotesByCategory(category);
    if (categoryQuotes.length === 0) {
        return null;
    }
    const randomIndex = Math.floor(Math.random() * categoryQuotes.length);
    return categoryQuotes[randomIndex];
}

// Export functions for potential external use (if needed)
window.QuoteGenerator = {
    showRandomQuote,
    addQuote,
    filterQuotesByCategory,
    searchQuotes,
    getRandomQuoteFromCategory,
    quotes: () => quotes // Getter function to access quotes array
};
