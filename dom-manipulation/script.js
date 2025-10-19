// Default quotes array
const defaultQuotes = [
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

// Initialize quotes array from local storage or defaults
let quotes = loadQuotesFromStorage();

// ==================== WEB STORAGE FUNCTIONS ====================

// Load quotes from local storage
function loadQuotesFromStorage() {
    try {
        const storedQuotes = localStorage.getItem('quoteGenerator_quotes');
        if (storedQuotes) {
            const parsedQuotes = JSON.parse(storedQuotes);
            // Validate that stored data is an array
            if (Array.isArray(parsedQuotes)) {
                return parsedQuotes;
            }
        }
    } catch (error) {
        console.error('Error loading quotes from storage:', error);
    }
    // Return default quotes if no valid storage found
    return [...defaultQuotes];
}

// Save quotes to local storage
function saveQuotesToStorage() {
    try {
        localStorage.setItem('quoteGenerator_quotes', JSON.stringify(quotes));
        return true;
    } catch (error) {
        console.error('Error saving quotes to storage:', error);
        return false;
    }
}

// Session storage functions for user preferences
function saveLastViewedQuote(quote) {
    try {
        sessionStorage.setItem('quoteGenerator_lastQuote', JSON.stringify(quote));
    } catch (error) {
        console.error('Error saving last viewed quote:', error);
    }
}

function getLastViewedQuote() {
    try {
        const lastQuote = sessionStorage.getItem('quoteGenerator_lastQuote');
        return lastQuote ? JSON.parse(lastQuote) : null;
    } catch (error) {
        console.error('Error getting last viewed quote:', error);
        return null;
    }
}

function saveUserPreferences(preferences) {
    try {
        sessionStorage.setItem('quoteGenerator_preferences', JSON.stringify(preferences));
    } catch (error) {
        console.error('Error saving user preferences:', error);
    }
}

function getUserPreferences() {
    try {
        const preferences = sessionStorage.getItem('quoteGenerator_preferences');
        return preferences ? JSON.parse(preferences) : {};
    } catch (error) {
        console.error('Error getting user preferences:', error);
        return {};
    }
}

// ==================== JSON IMPORT/EXPORT FUNCTIONS ====================

// Export quotes to JSON file
function exportToJson() {
    try {
        const dataStr = JSON.stringify(quotes, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        // Create download link
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `quotes_${new Date().toISOString().split('T')[0]}.json`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        URL.revokeObjectURL(url);
        
        showImportExportFeedback('Quotes exported successfully!', 'success');
    } catch (error) {
        console.error('Error exporting quotes:', error);
        showImportExportFeedback('Error exporting quotes. Please try again.', 'error');
    }
}

// Import quotes from JSON file
function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const fileReader = new FileReader();
    
    fileReader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            // Validate imported data
            if (!Array.isArray(importedData)) {
                throw new Error('Invalid file format. Expected an array of quotes.');
            }
            
            // Validate each quote object
            const validQuotes = importedData.filter(quote => {
                return quote && 
                       typeof quote.text === 'string' && 
                       typeof quote.category === 'string' &&
                       quote.text.trim().length > 0 &&
                       quote.category.trim().length > 0;
            });
            
            if (validQuotes.length === 0) {
                throw new Error('No valid quotes found in the file.');
            }
            
            // Add imported quotes to existing array
            const originalLength = quotes.length;
            quotes.push(...validQuotes);
            
            // Save to local storage
            if (saveQuotesToStorage()) {
                const addedCount = quotes.length - originalLength;
                showImportExportFeedback(
                    `Successfully imported ${addedCount} quotes!`, 
                    'success'
                );
                
                // Update statistics display
                updateQuoteStats();
                
                // Update categories dropdown
                populateCategories();
                
                // Clear the file input
                event.target.value = '';
            } else {
                throw new Error('Failed to save imported quotes.');
            }
            
        } catch (error) {
            console.error('Error importing quotes:', error);
            showImportExportFeedback(
                `Import failed: ${error.message}`, 
                'error'
            );
        }
    };
    
    fileReader.onerror = function() {
        showImportExportFeedback('Error reading file. Please try again.', 'error');
    };
    
    fileReader.readAsText(file);
}

// Clear all quotes
function clearAllQuotes() {
    if (confirm('Are you sure you want to clear all quotes? This action cannot be undone.')) {
        quotes = [];
        if (saveQuotesToStorage()) {
            showImportExportFeedback('All quotes cleared successfully!', 'success');
            updateQuoteStats();
            populateCategories();
            showRandomQuote(); // Show default message
        } else {
            showImportExportFeedback('Error clearing quotes.', 'error');
        }
    }
}

// Reset to default quotes
function resetToDefaults() {
    if (confirm('Are you sure you want to reset to default quotes? This will replace all current quotes.')) {
        quotes = [...defaultQuotes];
        if (saveQuotesToStorage()) {
            showImportExportFeedback('Reset to default quotes successfully!', 'success');
            updateQuoteStats();
            populateCategories();
            showRandomQuote();
        } else {
            showImportExportFeedback('Error resetting quotes.', 'error');
        }
    }
}

// Show feedback for import/export operations
function showImportExportFeedback(message, type) {
    const feedbackElement = document.getElementById('importExportFeedback');
    feedbackElement.textContent = message;
    feedbackElement.style.color = type === 'success' ? '#28a745' : '#dc3545';
    feedbackElement.style.fontWeight = 'bold';
    
    // Clear feedback after 3 seconds
    setTimeout(() => {
        feedbackElement.textContent = '';
        feedbackElement.style.fontWeight = 'normal';
    }, 3000);
}

// ==================== CATEGORY FILTERING FUNCTIONS ====================

// Populate categories dropdown dynamically
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    
    // Get unique categories from quotes array
    const categories = [...new Set(quotes.map(quote => quote.category))].sort();
    
    // Clear existing options except "All Categories"
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    
    // Add category options
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
    
    // Restore last selected filter from storage
    const lastFilter = getLastSelectedFilter();
    if (lastFilter && categories.includes(lastFilter)) {
        categoryFilter.value = lastFilter;
    }
}

// Filter quotes based on selected category
function filterQuotes() {
    const categoryFilter = document.getElementById('categoryFilter');
    const selectedCategory = categoryFilter.value;
    const filteredQuotesDisplay = document.getElementById('filteredQuotesDisplay');
    const filteredQuotesList = document.getElementById('filteredQuotesList');
    
    // Save selected filter to storage
    saveLastSelectedFilter(selectedCategory);
    
    if (selectedCategory === 'all') {
        // Hide filtered quotes display when showing all categories
        filteredQuotesDisplay.style.display = 'none';
        return;
    }
    
    // Filter quotes by selected category
    const filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
    
    if (filteredQuotes.length === 0) {
        filteredQuotesList.innerHTML = '<p style="color: #666; font-style: italic;">No quotes found in this category.</p>';
    } else {
        // Create HTML for filtered quotes
        filteredQuotesList.innerHTML = '';
        
        filteredQuotes.forEach((quote, index) => {
            const quoteElement = document.createElement('div');
            quoteElement.style.cssText = `
                background-color: #f8f9fa;
                padding: 15px;
                margin: 10px 0;
                border-radius: 8px;
                border-left: 4px solid #007bff;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            `;
            
            quoteElement.innerHTML = `
                <div style="font-style: italic; margin-bottom: 8px; color: #333;">
                    "${quote.text}"
                </div>
                <div style="font-size: 0.9em; color: #666; font-weight: bold;">
                    - ${quote.category}
                </div>
                <div style="font-size: 0.8em; color: #999; margin-top: 5px;">
                    Quote ${index + 1} of ${filteredQuotes.length}
                </div>
            `;
            
            filteredQuotesList.appendChild(quoteElement);
        });
    }
    
    // Show filtered quotes display
    filteredQuotesDisplay.style.display = 'block';
    
    // Update the display title
    const displayTitle = filteredQuotesDisplay.querySelector('h4');
    displayTitle.textContent = `Filtered Quotes (${filteredQuotes.length} found):`;
}

// Save last selected filter to local storage
function saveLastSelectedFilter(category) {
    try {
        localStorage.setItem('quoteGenerator_lastFilter', category);
    } catch (error) {
        console.error('Error saving last selected filter:', error);
    }
}

// Get last selected filter from local storage
function getLastSelectedFilter() {
    try {
        return localStorage.getItem('quoteGenerator_lastFilter');
    } catch (error) {
        console.error('Error getting last selected filter:', error);
        return null;
    }
}

// Show random quote from filtered category
function showRandomQuoteFromFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    const selectedCategory = categoryFilter.value;
    
    if (selectedCategory === 'all') {
        showRandomQuote();
        return;
    }
    
    const categoryQuotes = quotes.filter(quote => quote.category === selectedCategory);
    
    if (categoryQuotes.length === 0) {
        showSuccessMessage(`No quotes found in "${selectedCategory}" category.`);
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * categoryQuotes.length);
    const randomQuote = categoryQuotes[randomIndex];
    
    // Save last viewed quote to session storage
    saveLastViewedQuote(randomQuote);
    
    const quoteDisplay = document.getElementById('quoteDisplay');
    
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

// ==================== MAIN APPLICATION FUNCTIONS ====================

// Function to display a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    
    // Check if we have quotes to display
    if (quotes.length === 0) {
        const noQuotesElement = document.createElement('div');
        noQuotesElement.className = 'quote-text';
        noQuotesElement.textContent = 'No quotes available. Add some quotes or reset to defaults.';
        quoteDisplay.innerHTML = '';
        quoteDisplay.appendChild(noQuotesElement);
        return;
    }
    
    // Get a random quote from the array
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    
    // Save last viewed quote to session storage
    saveLastViewedQuote(randomQuote);
    
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
    
    // Save to local storage
    if (!saveQuotesToStorage()) {
        alert('Error saving quote. Please try again.');
        quotes.pop(); // Remove the quote if save failed
        return;
    }
    
    // Clear the form inputs
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    
    // Show success message
    showSuccessMessage('Quote added successfully!');
    
    // Update statistics
    updateQuoteStats();
    
    // Update categories dropdown
    populateCategories();
    
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
function updateQuoteStats() {
    let statsElement = document.getElementById('quoteStats');
    
    if (!statsElement) {
        statsElement = document.createElement('div');
        statsElement.id = 'quoteStats';
        statsElement.style.textAlign = 'center';
        statsElement.style.marginTop = '20px';
        statsElement.style.fontSize = '14px';
        statsElement.style.color = '#666';
        document.body.appendChild(statsElement);
    }
    
    const categories = [...new Set(quotes.map(q => q.category))];
    statsElement.innerHTML = `
        <p>Total Quotes: ${quotes.length}</p>
        <p>Categories: ${categories.length}</p>
        <p>Categories: ${categories.join(', ')}</p>
    `;
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners
    document.getElementById('newQuote').addEventListener('click', showRandomQuoteFromFilter);
    
    // Initialize the enhanced form
    createAddQuoteForm();
    
    // Populate categories dropdown
    populateCategories();
    
    // Show initial quote statistics
    updateQuoteStats();
    
    // Check for last viewed quote in session storage
    const lastQuote = getLastViewedQuote();
    if (lastQuote) {
        // Show last viewed quote if available
        const quoteDisplay = document.getElementById('quoteDisplay');
        const quoteTextElement = document.createElement('div');
        quoteTextElement.className = 'quote-text';
        quoteTextElement.textContent = `"${lastQuote.text}"`;
        
        const quoteCategoryElement = document.createElement('div');
        quoteCategoryElement.className = 'quote-category';
        quoteCategoryElement.textContent = `- ${lastQuote.category}`;
        
        quoteDisplay.innerHTML = '';
        quoteDisplay.appendChild(quoteTextElement);
        quoteDisplay.appendChild(quoteCategoryElement);
        
        // Add a note about session restoration
        const sessionNote = document.createElement('div');
        sessionNote.style.fontSize = '12px';
        sessionNote.style.color = '#888';
        sessionNote.style.marginTop = '10px';
        sessionNote.textContent = '(Restored from previous session)';
        quoteDisplay.appendChild(sessionNote);
    } else {
        // Display a welcome message
        setTimeout(() => {
            showRandomQuote();
        }, 500);
    }
    
    // Save user preferences (e.g., theme, font size, etc.)
    const userPreferences = {
        lastVisit: new Date().toISOString(),
        theme: 'light',
        fontSize: 'medium'
    };
    saveUserPreferences(userPreferences);
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
    showRandomQuoteFromFilter,
    addQuote,
    filterQuotes,
    populateCategories,
    filterQuotesByCategory,
    searchQuotes,
    getRandomQuoteFromCategory,
    exportToJson,
    importFromJsonFile,
    clearAllQuotes,
    resetToDefaults,
    saveQuotesToStorage,
    loadQuotesFromStorage,
    saveLastViewedQuote,
    getLastViewedQuote,
    saveUserPreferences,
    getUserPreferences,
    saveLastSelectedFilter,
    getLastSelectedFilter,
    quotes: () => quotes // Getter function to access quotes array
};
