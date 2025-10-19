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
let offlineMode = false;
let syncQueue = [];
let isOnline = navigator.onLine;

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
    
    // Load sync settings and queue
    loadSyncSettings();
    loadSyncQueue();
    
    // Set up online/offline event listeners
    window.addEventListener('online', handleOnlineEvent);
    window.addEventListener('offline', handleOfflineEvent);
    
    // Initialize offline mode checkbox
    const offlineCheckbox = document.getElementById('offlineMode');
    if (offlineCheckbox) {
        offlineCheckbox.checked = offlineMode;
    }
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
            offlineMode = parsedSettings.offlineMode || false;
        }
    } catch (error) {
        console.error('Error loading sync settings:', error);
    }
}

// Load sync queue from localStorage
function loadSyncQueue() {
    try {
        const queue = localStorage.getItem('quoteGenerator_syncQueue');
        if (queue) {
            syncQueue = JSON.parse(queue);
        }
    } catch (error) {
        console.error('Error loading sync queue:', error);
        syncQueue = [];
    }
}

// Save sync queue to localStorage
function saveSyncQueue() {
    try {
        localStorage.setItem('quoteGenerator_syncQueue', JSON.stringify(syncQueue));
        return true;
    } catch (error) {
        console.error('Error saving sync queue:', error);
        return false;
    }
}

// Handle online event
function handleOnlineEvent() {
    isOnline = true;
    updateSyncStatus('Connection restored. Processing queued changes...', 'success');
    
    if (syncQueue.length > 0) {
        processSyncQueue();
    }
}

// Handle offline event
function handleOfflineEvent() {
    isOnline = false;
    updateSyncStatus('Connection lost. Changes will be queued for later sync.', 'warning');
}

// Toggle offline mode
function toggleOfflineMode() {
    const checkbox = document.getElementById('offlineMode');
    offlineMode = checkbox.checked;
    saveSyncSettings();
    
    if (offlineMode) {
        updateSyncStatus('Offline mode enabled. Changes will be queued when offline.', 'info');
    } else {
        updateSyncStatus('Offline mode disabled.', 'info');
    }
}

// Add change to sync queue
function addToSyncQueue(change) {
    if (!offlineMode && isOnline) {
        return; // Don't queue if online and offline mode is disabled
    }
    
    syncQueue.push({
        ...change,
        timestamp: new Date().toISOString(),
        id: `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });
    
    saveSyncQueue();
    updateSyncStatus(`Change queued. Queue size: ${syncQueue.length}`, 'info');
}

// Process sync queue
async function processSyncQueue() {
    if (syncQueue.length === 0) return;
    
    updateSyncStatus(`Processing ${syncQueue.length} queued changes...`, 'info');
    
    const processedItems = [];
    const failedItems = [];
    
    for (const item of syncQueue) {
        try {
            if (item.type === 'add_quote') {
                await postQuotesToServer([item.data]);
                processedItems.push(item);
            } else if (item.type === 'update_quote') {
                await postQuotesToServer([item.data]);
                processedItems.push(item);
            }
        } catch (error) {
            console.error('Failed to process queued item:', error);
            failedItems.push(item);
        }
    }
    
    // Remove processed items from queue
    syncQueue = failedItems;
    saveSyncQueue();
    
    if (processedItems.length > 0) {
        updateSyncStatus(`Successfully processed ${processedItems.length} queued changes.`, 'success');
    }
    
    if (failedItems.length > 0) {
        updateSyncStatus(`${failedItems.length} changes failed and remain in queue.`, 'warning');
    }
}

// Save sync settings to localStorage
function saveSyncSettings() {
    try {
        const settings = {
            autoSyncEnabled,
            syncInterval,
            offlineMode,
            lastSyncTime
        };
        localStorage.setItem('quoteGenerator_syncSettings', JSON.stringify(settings));
        return true;
    } catch (error) {
        console.error('Error saving sync settings:', error);
        return false;
    }
}

// Simulate fetching quotes from server using JSONPlaceholder
async function fetchQuotesFromServer() {
    try {
        // Fetch from JSONPlaceholder API
        const response = await fetch(`${SERVER_BASE_URL}${QUOTES_ENDPOINT}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const posts = await response.json();
        
        // Convert posts to quote format
        const serverQuotesFromAPI = posts.slice(0, 5).map((post, index) => ({
            id: `server_${post.id}`,
            text: post.title,
            category: `API Quote ${index + 1}`,
            source: 'jsonplaceholder',
            serverId: post.id
        }));
        
        // Merge with existing server quotes
        const existingServerQuotes = serverQuotes.filter(q => q.source !== 'jsonplaceholder');
        const allServerQuotes = [...existingServerQuotes, ...serverQuotesFromAPI];
        
        // Update server quotes storage
        serverQuotes = allServerQuotes;
        saveServerQuotesToStorage();
        
        return allServerQuotes;
        
    } catch (error) {
        console.error('Error fetching from JSONPlaceholder:', error);
        
        // Fallback to local simulation if API fails
        console.log('Falling back to local simulation...');
        return await fetchQuotesFromServerFallback();
    }
}

// Fallback function for when API is unavailable
async function fetchQuotesFromServerFallback() {
    try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate server response with some random variations
        const simulatedServerResponse = [...serverQuotes];
        
        // Occasionally add new quotes to simulate server updates
        if (Math.random() < 0.3) { // 30% chance of new quote
            const newQuote = {
                id: `fallback_${Date.now()}`,
                text: `Server update ${new Date().toLocaleTimeString()}: ${getRandomServerQuote()}`,
                category: "Server Update",
                source: 'fallback'
            };
            simulatedServerResponse.push(newQuote);
            serverQuotes.push(newQuote);
            saveServerQuotesToStorage();
        }
        
        return simulatedServerResponse;
    } catch (error) {
        console.error('Error in fallback fetch:', error);
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

// Post quotes to server using JSONPlaceholder
async function postQuotesToServer(quotesToSync) {
    try {
        // Simulate posting to JSONPlaceholder API
        const response = await fetch(`${SERVER_BASE_URL}${QUOTES_ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: quotesToSync[0]?.text || 'New Quote',
                body: quotesToSync[0]?.category || 'Quote Category',
                userId: 1
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Process the response and return updated quotes
        const processedQuotes = quotesToSync.map(quote => ({
            ...quote,
            serverId: result.id || `server_${Date.now()}`,
            lastModified: new Date().toISOString(),
            source: 'posted_to_server'
        }));
        
        return processedQuotes;
        
    } catch (error) {
        console.error('Error posting to JSONPlaceholder:', error);
        
        // Fallback to local simulation
        console.log('Falling back to local simulation for posting...');
        return await postQuotesToServerFallback(quotesToSync);
    }
}

// Fallback function for posting when API is unavailable
async function postQuotesToServerFallback(quotesToSync) {
    try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Simulate server processing
        const processedQuotes = quotesToSync.map(quote => ({
            ...quote,
            serverId: `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            lastModified: new Date().toISOString(),
            source: 'fallback_posted'
        }));
        
        return processedQuotes;
    } catch (error) {
        console.error('Error in fallback post:', error);
        throw error;
    }
}

// Main syncQuotes function - the primary sync function
async function syncQuotes() {
    try {
        updateSyncStatus('Starting sync...', 'info');
        
        // Fetch latest quotes from server
        const serverData = await fetchQuotesFromServer();
        
        // Detect conflicts
        const conflicts = detectConflicts(quotes, serverData);
        
        if (conflicts.length > 0) {
            // Handle conflicts
            pendingConflicts = conflicts;
            showConflictNotification(conflicts);
            updateSyncStatus(`Sync completed with ${conflicts.length} conflicts detected.`, 'warning');
            
            // Auto-resolve conflicts if auto-sync is enabled
            if (autoSyncEnabled) {
                setTimeout(() => {
                    resolveConflicts();
                }, 2000); // Auto-resolve after 2 seconds
            }
        } else {
            // No conflicts - merge data
            const mergedQuotes = mergeQuotes(quotes, serverData);
            quotes = mergedQuotes;
            saveQuotesToStorage();
            updateQuoteStats();
            populateCategories();
            
            updateSyncStatus(`Sync completed successfully. ${mergedQuotes.length} quotes synchronized.`, 'success');
        }
        
        // Update last sync time
        lastSyncTime = new Date();
        saveSyncSettings();
        
        // Show data update notification
        showDataUpdateNotification(serverData.length);
        
    } catch (error) {
        console.error('Sync error:', error);
        updateSyncStatus('Sync failed. Please check your connection and try again.', 'error');
        showErrorNotification('Sync failed: ' + error.message);
    }
}

// Enhanced periodic checking for new quotes
function startPeriodicQuoteCheck() {
    if (syncTimer) {
        clearInterval(syncTimer);
    }
    
    syncTimer = setInterval(async () => {
        try {
            console.log('Performing periodic quote check...');
            
            // Fetch latest quotes from server
            const serverData = await fetchQuotesFromServer();
            
            // Check for new quotes
            const newQuotes = serverData.filter(serverQuote => 
                !quotes.some(localQuote => 
                    localQuote.id === serverQuote.id || 
                    localQuote.text === serverQuote.text
                )
            );
            
            if (newQuotes.length > 0) {
                console.log(`Found ${newQuotes.length} new quotes from server`);
                
                // Add new quotes to local collection
                quotes.push(...newQuotes);
                saveQuotesToStorage();
                updateQuoteStats();
                populateCategories();
                
                // Show notification for new quotes
                showNewQuotesNotification(newQuotes);
                
                // Update sync status
                updateSyncStatus(`Found ${newQuotes.length} new quotes from server.`, 'success');
            } else {
                console.log('No new quotes found from server');
                updateSyncStatus('Periodic check completed. No new quotes found.', 'info');
            }
            
            lastSyncTime = new Date();
            saveSyncSettings();
            
        } catch (error) {
            console.error('Periodic check error:', error);
            updateSyncStatus('Periodic check failed. Will retry next interval.', 'error');
        }
    }, syncInterval);
    
    console.log(`Periodic quote checking started with ${syncInterval / 1000} second intervals`);
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
    
    // Use the enhanced periodic checking function
    startPeriodicQuoteCheck();
    
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
    const connectionStatus = isOnline ? 'Online' : 'Offline';
    const queueSize = syncQueue.length;
    
    const statusMessage = `
        Auto Sync: ${status}<br>
        Connection: ${connectionStatus}<br>
        Offline Mode: ${offlineMode ? 'Enabled' : 'Disabled'}<br>
        Last Sync: ${lastSync}<br>
        Next Sync: ${nextSync}<br>
        Pending Conflicts: ${pendingConflicts.length}<br>
        Queued Changes: ${queueSize}
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
    const conflictDetailsBtn = document.getElementById('conflictDetailsBtn');
    
    notificationElement.innerHTML = `
        <strong>⚠️ Data Conflicts Detected</strong><br>
        ${conflicts.length} conflict(s) found between local and server data.<br>
        <small>Click "Resolve Conflicts" to auto-resolve or "View Conflicts" to review them manually.</small>
    `;
    
    notificationElement.style.backgroundColor = '#fff3cd';
    notificationElement.style.borderColor = '#ffeaa7';
    notificationElement.style.color = '#856404';
    notificationElement.style.display = 'block';
    
    resolveBtn.style.display = 'inline-block';
    conflictDetailsBtn.style.display = 'inline-block';
}

// Show detailed conflict information
function showConflictDetails() {
    const conflictDetails = document.getElementById('conflictDetails');
    const conflictList = document.getElementById('conflictList');
    
    if (pendingConflicts.length === 0) {
        conflictList.innerHTML = '<p>No conflicts to display.</p>';
        return;
    }
    
    conflictList.innerHTML = '';
    
    pendingConflicts.forEach((conflict, index) => {
        const conflictElement = document.createElement('div');
        conflictElement.style.cssText = `
            background-color: white;
            padding: 15px;
            margin: 10px 0;
            border-radius: 8px;
            border-left: 4px solid #ffc107;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;
        
        let conflictHtml = `
            <div style="font-weight: bold; margin-bottom: 10px;">
                Conflict ${index + 1}: ${conflict.message}
            </div>
        `;
        
        if (conflict.type === 'content_mismatch') {
            conflictHtml += `
                <div style="margin-bottom: 10px;">
                    <strong>Local Version:</strong><br>
                    <div style="background-color: #f8f9fa; padding: 8px; margin: 5px 0; border-radius: 4px;">
                        "${conflict.local.text}" - ${conflict.local.category}
                    </div>
                    <strong>Server Version:</strong><br>
                    <div style="background-color: #e3f2fd; padding: 8px; margin: 5px 0; border-radius: 4px;">
                        "${conflict.server.text}" - ${conflict.server.category}
                    </div>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button onclick="resolveConflict(${index}, 'local')" style="background-color: #28a745; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Keep Local</button>
                    <button onclick="resolveConflict(${index}, 'server')" style="background-color: #007bff; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Use Server</button>
                </div>
            `;
        } else if (conflict.type === 'local_only') {
            conflictHtml += `
                <div style="margin-bottom: 10px;">
                    <strong>Local Quote:</strong><br>
                    <div style="background-color: #f8f9fa; padding: 8px; margin: 5px 0; border-radius: 4px;">
                        "${conflict.local.text}" - ${conflict.local.category}
                    </div>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button onclick="resolveConflict(${index}, 'keep')" style="background-color: #28a745; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Keep Local</button>
                    <button onclick="resolveConflict(${index}, 'remove')" style="background-color: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Remove</button>
                </div>
            `;
        }
        
        conflictElement.innerHTML = conflictHtml;
        conflictList.appendChild(conflictElement);
    });
    
    conflictDetails.style.display = 'block';
}

// Resolve individual conflict
function resolveConflict(conflictIndex, resolution) {
    const conflict = pendingConflicts[conflictIndex];
    
    if (conflict.type === 'content_mismatch') {
        const localIndex = quotes.findIndex(q => q.text === conflict.local.text);
        if (localIndex !== -1) {
            if (resolution === 'server') {
                quotes[localIndex] = { ...conflict.server, source: 'server_resolved' };
            } else {
                quotes[localIndex] = { ...conflict.local, source: 'local_kept' };
            }
        }
    } else if (conflict.type === 'local_only') {
        const localIndex = quotes.findIndex(q => q.text === conflict.local.text);
        if (localIndex !== -1) {
            if (resolution === 'remove') {
                quotes.splice(localIndex, 1);
            } else {
                quotes[localIndex] = { ...conflict.local, source: 'local_kept' };
            }
        }
    }
    
    // Remove resolved conflict
    pendingConflicts.splice(conflictIndex, 1);
    
    // Save changes
    saveQuotesToStorage();
    updateQuoteStats();
    populateCategories();
    
    // Update conflict display
    if (pendingConflicts.length === 0) {
        document.getElementById('conflictDetails').style.display = 'none';
        document.getElementById('conflictNotification').style.display = 'none';
        document.getElementById('resolveBtn').style.display = 'none';
        document.getElementById('conflictDetailsBtn').style.display = 'none';
        updateSyncStatus('All conflicts resolved successfully.', 'success');
    } else {
        showConflictDetails(); // Refresh the display
    }
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

// Show notification for data updates
function showDataUpdateNotification(serverDataCount) {
    const notificationElement = document.getElementById('conflictNotification');
    
    notificationElement.innerHTML = `
        <strong>✅ Data Updated</strong><br>
        Successfully synchronized with server. ${serverDataCount} quotes processed.<br>
        <small>Your local data has been updated with the latest server information.</small>
    `;
    
    notificationElement.style.backgroundColor = '#d4edda';
    notificationElement.style.borderColor = '#c3e6cb';
    notificationElement.style.color = '#155724';
    notificationElement.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        notificationElement.style.display = 'none';
    }, 5000);
}

// Show notification for new quotes
function showNewQuotesNotification(newQuotes) {
    const notificationElement = document.getElementById('conflictNotification');
    
    notificationElement.innerHTML = `
        <strong>🆕 New Quotes Available</strong><br>
        Found ${newQuotes.length} new quote(s) from the server.<br>
        <small>These quotes have been automatically added to your collection.</small>
    `;
    
    notificationElement.style.backgroundColor = '#cce5ff';
    notificationElement.style.borderColor = '#99d6ff';
    notificationElement.style.color = '#004085';
    notificationElement.style.display = 'block';
    
    // Auto-hide after 7 seconds
    setTimeout(() => {
        notificationElement.style.display = 'none';
    }, 7000);
}

// Show error notification
function showErrorNotification(errorMessage) {
    const notificationElement = document.getElementById('conflictNotification');
    
    notificationElement.innerHTML = `
        <strong>❌ Error Occurred</strong><br>
        ${errorMessage}<br>
        <small>Please check your connection and try again.</small>
    `;
    
    notificationElement.style.backgroundColor = '#f8d7da';
    notificationElement.style.borderColor = '#f5c6cb';
    notificationElement.style.color = '#721c24';
    notificationElement.style.display = 'block';
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        notificationElement.style.display = 'none';
    }, 10000);
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
        category: newQuoteCategory,
        id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString()
    };
    
    // Add to quotes array
    quotes.push(newQuote);
    
    // Save to local storage
    if (!saveQuotesToStorage()) {
        alert('Error saving quote. Please try again.');
        quotes.pop(); // Remove the quote if save failed
        return;
    }
    
    // Add to sync queue if offline or offline mode is enabled
    if (!isOnline || offlineMode) {
        addToSyncQueue({
            type: 'add_quote',
            data: newQuote
        });
    } else {
        // Try to sync immediately if online
        postQuotesToServer([newQuote]).catch(error => {
            console.error('Failed to sync new quote:', error);
            addToSyncQueue({
                type: 'add_quote',
                data: newQuote
            });
        });
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

// Manual sync function (wrapper for syncQuotes)
async function manualSync() {
    await syncQuotes();
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
    syncQuotes,
    manualSync,
    toggleAutoSync,
    showSyncStatus,
    resolveConflicts,
    showConflictDetails,
    resolveConflict,
    fetchQuotesFromServer,
    postQuotesToServer,
    detectConflicts,
    mergeQuotes,
    initializeServerSimulation,
    startPeriodicQuoteCheck,
    showDataUpdateNotification,
    showNewQuotesNotification,
    showErrorNotification,
    // Offline support functions
    toggleOfflineMode,
    addToSyncQueue,
    processSyncQueue,
    handleOnlineEvent,
    handleOfflineEvent,
    loadSyncQueue,
    saveSyncQueue,
    quotes: () => quotes // Getter function to access quotes array
};
