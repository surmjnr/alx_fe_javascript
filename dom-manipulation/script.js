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

// ==================== SERVER SIMULATION & SYNC FUNCTIONS ====================

// Server simulation variables
let autoSyncEnabled = false;
let syncInterval = 30000; // 30 seconds default
let syncTimer = null;
let lastSyncTime = null;
let pendingConflicts = [];
let serverQuotes = [];

// Server simulation using JSONPlaceholder
const SERVER_BASE_URL = 'https://jsonplaceholder.typicode.com';
const QUOTES_ENDPOINT = '/posts'; // We'll simulate quotes using posts

// Initialize server simulation
function initializeServerSimulation() {
    // Load server quotes from localStorage or create default server data
    const storedServerQuotes = localStorage.getItem('quoteGenerator_serverQuotes');
    if (storedServerQuotes) {
        serverQuotes = JSON.parse(storedServerQuotes);
    } else {
        // Create initial server data
        serverQuotes = [
            { id: 1, text: "The server says: Innovation is the key to success.", category: "Server" },
            { id: 2, text: "From the cloud: Dreams are the foundation of reality.", category: "Cloud" },
            { id: 3, text: "Server wisdom: Every expert was once a beginner.", category: "Wisdom" }
        ];
        saveServerQuotesToStorage();
    }
    
    // Load sync settings
    loadSyncSettings();
}

// Save server quotes to localStorage
function saveServerQuotesToStorage() {
    try {
        localStorage.setItem('quoteGenerator_serverQuotes', JSON.stringify(serverQuotes));
        return true;
    } catch (error) {
        console.error('Error saving server quotes:', error);
        return false;
    }
}

// Load sync settings from localStorage
function loadSyncSettings() {
    try {
        const settings = localStorage.getItem('quoteGenerator_syncSettings');
        if (settings) {
            const parsedSettings = JSON.parse(settings);
            autoSyncEnabled = parsedSettings.autoSyncEnabled || false;
            syncInterval = parsedSettings.syncInterval || 30000;
        }
    } catch (error) {
        console.error('Error loading sync settings:', error);
    }
}

// Save sync settings to localStorage
function saveSyncSettings() {
    try {
        const settings = {
            autoSyncEnabled,
            syncInterval,
            lastSyncTime
        };
        localStorage.setItem('quoteGenerator_syncSettings', JSON.stringify(settings));
        return true;
    } catch (error) {
        console.error('Error saving sync settings:', error);
        return false;
    }
}

// Simulate fetching quotes from server
async function fetchQuotesFromServer() {
    try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate server response with some random variations
        const simulatedServerResponse = [...serverQuotes];
        
        // Occasionally add new quotes to simulate server updates
        if (Math.random() < 0.3) { // 30% chance of new quote
            const newQuote = {
                id: Date.now(),
                text: `Server update ${new Date().toLocaleTimeString()}: ${getRandomServerQuote()}`,
                category: "Server Update"
            };
            simulatedServerResponse.push(newQuote);
            serverQuotes.push(newQuote);
            saveServerQuotesToStorage();
        }
        
        return simulatedServerResponse;
    } catch (error) {
        console.error('Error fetching from server:', error);
        throw error;
    }
}

// Get random server quote for simulation
function getRandomServerQuote() {
    const serverQuotes = [
        "Technology is best when it brings people together.",
        "The future belongs to those who believe in the beauty of their dreams.",
        "Innovation distinguishes between a leader and a follower.",
        "The only way to do great work is to love what you do.",
        "Success is not final, failure is not fatal: it is the courage to continue that counts."
    ];
    return serverQuotes[Math.floor(Math.random() * serverQuotes.length)];
}

// Simulate posting quotes to server
async function postQuotesToServer(quotesToSync) {
    try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Simulate server processing
        const processedQuotes = quotesToSync.map(quote => ({
            ...quote,
            serverId: `server_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            lastModified: new Date().toISOString()
        }));
        
        return processedQuotes;
    } catch (error) {
        console.error('Error posting to server:', error);
        throw error;
    }
}

// Manual sync function
async function manualSync() {
    updateSyncStatus('Syncing...', 'info');
    
    try {
        // Fetch from server
        const serverData = await fetchQuotesFromServer();
        
        // Compare with local data
        const conflicts = detectConflicts(quotes, serverData);
        
        if (conflicts.length > 0) {
            pendingConflicts = conflicts;
            showConflictNotification(conflicts);
            updateSyncStatus('Conflicts detected. Manual resolution required.', 'warning');
        } else {
            // Merge server data with local data
            const mergedQuotes = mergeQuotes(quotes, serverData);
            quotes = mergedQuotes;
            saveQuotesToStorage();
            updateQuoteStats();
            populateCategories();
            
            updateSyncStatus(`Sync completed successfully. ${mergedQuotes.length} quotes synchronized.`, 'success');
        }
        
        lastSyncTime = new Date();
        saveSyncSettings();
        
    } catch (error) {
        updateSyncStatus('Sync failed. Please try again.', 'error');
        console.error('Sync error:', error);
    }
}

// Detect conflicts between local and server data
function detectConflicts(localQuotes, serverQuotes) {
    const conflicts = [];
    
    // Check for quotes that exist in both but have different content
    localQuotes.forEach(localQuote => {
        const serverQuote = serverQuotes.find(sq => 
            sq.text === localQuote.text || sq.id === localQuote.id
        );
        
        if (serverQuote && serverQuote.text !== localQuote.text) {
            conflicts.push({
                type: 'content_mismatch',
                local: localQuote,
                server: serverQuote,
                message: 'Quote content differs between local and server'
            });
        }
    });
    
    // Check for quotes that exist locally but not on server
    const localOnlyQuotes = localQuotes.filter(localQuote => 
        !serverQuotes.some(serverQuote => 
            serverQuote.text === localQuote.text || serverQuote.id === localQuote.id
        )
    );
    
    localOnlyQuotes.forEach(quote => {
        conflicts.push({
            type: 'local_only',
            local: quote,
            server: null,
            message: 'Quote exists locally but not on server'
        });
    });
    
    return conflicts;
}

// Merge quotes from local and server
function mergeQuotes(localQuotes, serverQuotes) {
    const merged = [...localQuotes];
    
    serverQuotes.forEach(serverQuote => {
        const existingIndex = merged.findIndex(localQuote => 
            localQuote.text === serverQuote.text || localQuote.id === serverQuote.id
        );
        
        if (existingIndex === -1) {
            // New quote from server
            merged.push({
                ...serverQuote,
                source: 'server'
            });
        } else {
            // Update existing quote with server data
            merged[existingIndex] = {
                ...merged[existingIndex],
                ...serverQuote,
                source: 'merged'
            };
        }
    });
    
    return merged;
}

// Toggle auto sync
function toggleAutoSync() {
    autoSyncEnabled = !autoSyncEnabled;
    
    if (autoSyncEnabled) {
        startAutoSync();
        document.getElementById('syncToggle').textContent = 'Disable Auto Sync';
        document.getElementById('syncToggle').style.backgroundColor = '#dc3545';
        document.getElementById('syncSettings').style.display = 'block';
    } else {
        stopAutoSync();
        document.getElementById('syncToggle').textContent = 'Enable Auto Sync';
        document.getElementById('syncToggle').style.backgroundColor = '#28a745';
        document.getElementById('syncSettings').style.display = 'none';
    }
    
    saveSyncSettings();
}

// Start auto sync
function startAutoSync() {
    if (syncTimer) {
        clearInterval(syncTimer);
    }
    
    syncTimer = setInterval(() => {
        manualSync();
    }, syncInterval);
    
    updateSyncStatus(`Auto sync enabled. Next sync in ${syncInterval / 1000} seconds.`, 'info');
}

// Stop auto sync
function stopAutoSync() {
    if (syncTimer) {
        clearInterval(syncTimer);
        syncTimer = null;
    }
    
    updateSyncStatus('Auto sync disabled.', 'info');
}

// Update sync interval
function updateSyncInterval() {
    const newInterval = parseInt(document.getElementById('syncInterval').value) * 1000;
    
    if (newInterval >= 10000 && newInterval <= 300000) {
        syncInterval = newInterval;
        
        if (autoSyncEnabled) {
            startAutoSync(); // Restart with new interval
        }
        
        saveSyncSettings();
        updateSyncStatus(`Sync interval updated to ${newInterval / 1000} seconds.`, 'success');
    } else {
        updateSyncStatus('Invalid interval. Please enter a value between 10 and 300 seconds.', 'error');
    }
}

// Show sync status
function showSyncStatus() {
    const status = autoSyncEnabled ? 'Enabled' : 'Disabled';
    const lastSync = lastSyncTime ? lastSyncTime.toLocaleString() : 'Never';
    const nextSync = autoSyncEnabled ? `${syncInterval / 1000} seconds` : 'N/A';
    
    const statusMessage = `
        Auto Sync: ${status}<br>
        Last Sync: ${lastSync}<br>
        Next Sync: ${nextSync}<br>
        Pending Conflicts: ${pendingConflicts.length}
    `;
    
    updateSyncStatus(statusMessage, 'info');
}

// Update sync status display
function updateSyncStatus(message, type) {
    const statusElement = document.getElementById('syncStatus');
    statusElement.innerHTML = message;
    
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    
    statusElement.style.color = colors[type] || '#666';
    statusElement.style.fontWeight = 'bold';
}

// Show conflict notification
function showConflictNotification(conflicts) {
    const notificationElement = document.getElementById('conflictNotification');
    const resolveBtn = document.getElementById('resolveBtn');
    
    notificationElement.innerHTML = `
        <strong>⚠️ Data Conflicts Detected</strong><br>
        ${conflicts.length} conflict(s) found between local and server data.<br>
        <small>Click "Resolve Conflicts" to review and resolve them.</small>
    `;
    
    notificationElement.style.backgroundColor = '#fff3cd';
    notificationElement.style.borderColor = '#ffeaa7';
    notificationElement.style.color = '#856404';
    notificationElement.style.display = 'block';
    
    resolveBtn.style.display = 'inline-block';
}

// Resolve conflicts manually
function resolveConflicts() {
    if (pendingConflicts.length === 0) {
        updateSyncStatus('No conflicts to resolve.', 'info');
        return;
    }
    
    // Simple conflict resolution: server takes precedence
    let resolvedCount = 0;
    
    pendingConflicts.forEach(conflict => {
        if (conflict.type === 'content_mismatch') {
            // Use server version
            const localIndex = quotes.findIndex(q => q.text === conflict.local.text);
            if (localIndex !== -1) {
                quotes[localIndex] = { ...conflict.server, source: 'server_resolved' };
                resolvedCount++;
            }
        } else if (conflict.type === 'local_only') {
            // Keep local quote but mark it
            const localIndex = quotes.findIndex(q => q.text === conflict.local.text);
            if (localIndex !== -1) {
                quotes[localIndex] = { ...conflict.local, source: 'local_kept' };
                resolvedCount++;
            }
        }
    });
    
    // Save resolved quotes
    saveQuotesToStorage();
    updateQuoteStats();
    populateCategories();
    
    // Clear conflicts
    pendingConflicts = [];
    
    // Hide notification
    document.getElementById('conflictNotification').style.display = 'none';
    document.getElementById('resolveBtn').style.display = 'none';
    
    updateSyncStatus(`Resolved ${resolvedCount} conflicts. Data synchronized.`, 'success');
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
    
    // Initialize server simulation
    initializeServerSimulation();
    
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
    // Server sync functions
    manualSync,
    toggleAutoSync,
    showSyncStatus,
    resolveConflicts,
    fetchQuotesFromServer,
    postQuotesToServer,
    detectConflicts,
    mergeQuotes,
    initializeServerSimulation,
    quotes: () => quotes // Getter function to access quotes array
};
