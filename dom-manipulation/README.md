# Dynamic Quote Generator

A web application that demonstrates advanced DOM manipulation techniques in JavaScript, featuring web storage integration and JSON import/export functionality.

## Features

- **Random Quote Display**: Shows random quotes from a predefined collection
- **Dynamic Quote Addition**: Allows users to add their own quotes through a form interface
- **Local Storage Persistence**: Quotes are automatically saved and restored across browser sessions
- **Session Storage**: Remembers the last viewed quote within the same session
- **Category Filtering**: Filter quotes by category with a dynamic dropdown menu
- **Filter Persistence**: Remember the last selected filter across browser sessions
- **Dynamic Category Management**: Categories are automatically updated when quotes are added
- **Server Simulation**: Simulates server interaction with mock API endpoints
- **Data Synchronization**: Automatic and manual sync with server data
- **Conflict Resolution**: Detects and resolves data conflicts between local and server
- **Auto Sync**: Configurable automatic synchronization at specified intervals
- **Sync Status**: Real-time sync status and conflict monitoring
- **Data Management**: Clear all quotes or reset to default collection
- **Real-time Validation**: Form validation with user feedback
- **Smooth Animations**: CSS transitions for better user experience
- **Responsive Design**: Works on desktop and mobile devices
- **Quote Statistics**: Displays total quotes and categories count

## Files

- `index.html` - Main HTML structure with embedded CSS styling
- `script.js` - JavaScript functionality with DOM manipulation and web storage
- `README.md` - Project documentation
- `TESTING.md` - Comprehensive testing guide

## Key Functions

### Core Functions
- `showRandomQuote()` - Displays a random quote from the quotes array
- `addQuote()` - Adds a new quote to the array and updates the display
- `createAddQuoteForm()` - Sets up enhanced form with validation

### Web Storage Functions
- `loadQuotesFromStorage()` - Loads quotes from localStorage
- `saveQuotesToStorage()` - Saves quotes to localStorage
- `saveLastViewedQuote(quote)` - Saves last viewed quote to sessionStorage
- `getLastViewedQuote()` - Retrieves last viewed quote from sessionStorage
- `saveUserPreferences(preferences)` - Saves user preferences to sessionStorage
- `getUserPreferences()` - Retrieves user preferences from sessionStorage

### Category Filtering Functions
- `populateCategories()` - Populates the category dropdown with unique categories
- `filterQuotes()` - Filters and displays quotes based on selected category
- `showRandomQuoteFromFilter()` - Shows random quote respecting current filter
- `saveLastSelectedFilter(category)` - Saves selected filter to localStorage
- `getLastSelectedFilter()` - Retrieves last selected filter from localStorage

### Server Sync Functions
- `initializeServerSimulation()` - Initializes server simulation and loads settings
- `manualSync()` - Performs manual synchronization with server
- `toggleAutoSync()` - Enables/disables automatic synchronization
- `showSyncStatus()` - Displays current sync status and settings
- `resolveConflicts()` - Resolves data conflicts between local and server
- `showConflictDetails()` - Shows detailed conflict information for manual resolution
- `resolveConflict(index, resolution)` - Resolves individual conflicts
- `fetchQuotesFromServer()` - Simulates fetching quotes from server
- `postQuotesToServer(quotes)` - Simulates posting quotes to server
- `detectConflicts(local, server)` - Detects conflicts between data sets
- `mergeQuotes(local, server)` - Merges local and server quote data
- `startPeriodicQuoteCheck()` - Starts periodic checking for new quotes
- `showDataUpdateNotification(count)` - Shows notification for data updates
- `showNewQuotesNotification(quotes)` - Shows notification for new quotes
- `showErrorNotification(message)` - Shows error notifications
- `toggleOfflineMode()` - Toggles offline mode for queuing changes
- `addToSyncQueue(change)` - Adds changes to sync queue
- `processSyncQueue()` - Processes queued changes when online
- `handleOnlineEvent()` - Handles online connection events
- `handleOfflineEvent()` - Handles offline connection events
- `loadSyncQueue()` - Loads sync queue from localStorage
- `saveSyncQueue()` - Saves sync queue to localStorage

### JSON Import/Export Functions
- `exportToJson()` - Exports quotes to a downloadable JSON file
- `importFromJsonFile(event)` - Imports quotes from a JSON file
- `clearAllQuotes()` - Clears all quotes with confirmation
- `resetToDefaults()` - Resets to default quote collection

### Utility Functions
- `filterQuotesByCategory(category)` - Filters quotes by category
- `searchQuotes(searchTerm)` - Searches quotes by text content
- `getRandomQuoteFromCategory(category)` - Gets random quote from specific category
- `updateQuoteStats()` - Updates and displays quote statistics

## Usage

1. Open `index.html` in a web browser
2. Click "Show New Quote" to display random quotes
3. Use the category dropdown to filter quotes by category
4. View filtered quotes in the dedicated display area
5. Use the form to add your own quotes
6. Press Enter in the category field to quickly add quotes
7. Enable "Auto Sync" for automatic server synchronization
8. Use "Manual Sync Now" to sync with server immediately
9. Resolve conflicts when detected between local and server data
10. Use "View Conflicts" to manually resolve individual conflicts
11. Enable "Offline Mode" to queue changes when offline
12. Monitor sync status and connection status
13. Use "Export to JSON" to download your quote collection
14. Use "Import from JSON" to add quotes from a file
15. Use "Clear All Quotes" or "Reset to Defaults" for data management

## Server Sync & Conflict Resolution Features

### Server Simulation
- **Mock API Integration**: Simulates real server interaction using JSONPlaceholder
- **Realistic Delays**: Includes API response delays for authentic testing
- **Dynamic Updates**: Server occasionally adds new quotes to simulate real-world updates
- **Data Persistence**: Server data is stored locally for consistent simulation
- **Fallback Support**: Graceful fallback to local simulation when API is unavailable

### Data Synchronization
- **Manual Sync**: On-demand synchronization with server data
- **Auto Sync**: Configurable automatic synchronization (10-300 seconds)
- **Smart Merging**: Intelligent merging of local and server data
- **Conflict Detection**: Automatic detection of data conflicts
- **Periodic Checking**: Enhanced periodic checking for new quotes from server

### Conflict Resolution
- **Automatic Detection**: Identifies conflicts between local and server data
- **Visual Notifications**: Clear conflict notifications with resolution options
- **Server Precedence**: Server data takes precedence in conflict resolution
- **Manual Resolution**: Option for manual conflict resolution when needed
- **Detailed Conflict View**: Individual conflict resolution with side-by-side comparison
- **Conflict Types**: Handles content mismatches and local-only quotes

### Offline Support
- **Offline Mode**: Queue changes when offline for later synchronization
- **Sync Queue**: Persistent queue that survives browser sessions
- **Online/Offline Detection**: Automatic detection of network status changes
- **Queue Processing**: Automatic processing of queued changes when connection is restored
- **Error Recovery**: Robust error handling for failed sync operations

### Sync Management
- **Status Monitoring**: Real-time sync status and conflict monitoring
- **Settings Persistence**: Sync settings persist across browser sessions
- **Error Handling**: Robust error handling for network issues
- **Performance Optimization**: Efficient sync algorithms with minimal overhead
- **Connection Status**: Real-time connection status monitoring
- **Queue Management**: Visual queue status and management

## Category Filtering Features

### Dynamic Category Management
- **Automatic Population**: Categories are extracted from quotes and populated in dropdown
- **Real-time Updates**: Categories dropdown updates when new quotes are added
- **Sorted Display**: Categories are displayed in alphabetical order
- **Persistent Selection**: Last selected filter is remembered across sessions

### Filtering Functionality
- **Category Selection**: Choose from "All Categories" or specific categories
- **Filtered Display**: View all quotes in selected category with proper formatting
- **Quote Numbering**: Each filtered quote shows its position (1 of X, 2 of X, etc.)
- **Empty State Handling**: Shows appropriate message when no quotes found in category

### Integration with Random Quotes
- **Filtered Random**: "Show New Quote" button respects current category filter
- **Smart Fallback**: Handles categories with no quotes gracefully
- **Session Memory**: Last viewed quote is saved even when filtered

## Web Storage Features

### Local Storage
- **Persistent Data**: Quotes are saved across browser sessions
- **Automatic Saving**: Quotes are saved immediately when added
- **Data Validation**: Invalid stored data is handled gracefully
- **Fallback Support**: Defaults to original quotes if storage fails

### Session Storage
- **Last Viewed Quote**: Remembers the last quote viewed in the session
- **User Preferences**: Stores session-specific user settings
- **Session Restoration**: Shows last quote when page is refreshed
- **Temporary Data**: Data is cleared when browser tab is closed

## JSON Import/Export

### Export Format
```json
[
  {
    "text": "Quote text here",
    "category": "Category name"
  }
]
```

### Import Requirements
- File must be valid JSON
- Must contain an array of quote objects
- Each quote must have `text` and `category` properties
- Both properties must be non-empty strings

## DOM Manipulation Techniques Demonstrated

- Dynamic element creation using `document.createElement()`
- Event listener management
- Real-time form validation
- CSS class manipulation
- Animation effects with transitions
- Array management and filtering
- Input validation and user feedback
- File handling with FileReader API
- Blob creation and URL management
- Local and session storage integration

## Browser Compatibility

Works in all modern browsers that support:
- ES6+ features
- Local Storage API
- Session Storage API
- FileReader API
- Blob API

## Testing

See `TESTING.md` for comprehensive testing instructions and validation procedures.

### Quick Testing Checklist
- [ ] Basic quote functionality (add, display, filter)
- [ ] Local storage persistence across sessions
- [ ] JSON import/export functionality
- [ ] Server sync initialization
- [ ] Manual sync operation
- [ ] Auto sync toggle and configuration
- [ ] Conflict detection and resolution
- [ ] Offline mode and sync queue
- [ ] Online/offline event handling
- [ ] Error handling and recovery
- [ ] Performance with large datasets
- [ ] Cross-browser compatibility

### Testing Server Sync Features
1. **Manual Sync**: Click "Manual Sync Now" and verify server data is fetched
2. **Auto Sync**: Enable auto sync and wait for automatic synchronization
3. **Conflict Resolution**: Create conflicts and test both automatic and manual resolution
4. **Offline Mode**: Enable offline mode, go offline, add quotes, then go online
5. **Sync Status**: Monitor sync status for accurate information display
6. **Error Handling**: Test with network issues and verify graceful error handling

## Error Handling

The application includes robust error handling for:
- Invalid JSON imports
- Storage quota exceeded
- File reading errors
- Network issues and API failures
- Browser compatibility issues
- Sync operation failures
- Conflict resolution errors
- Offline/online state changes
- Queue processing failures
- Data integrity issues
- Memory and performance issues
