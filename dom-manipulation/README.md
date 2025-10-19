# Dynamic Quote Generator

A web application that demonstrates advanced DOM manipulation techniques in JavaScript, featuring web storage integration and JSON import/export functionality.

## Features

- **Random Quote Display**: Shows random quotes from a predefined collection
- **Dynamic Quote Addition**: Allows users to add their own quotes through a form interface
- **Local Storage Persistence**: Quotes are automatically saved and restored across browser sessions
- **Session Storage**: Remembers the last viewed quote within the same session
- **JSON Import/Export**: Import quotes from JSON files or export your collection
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
3. Use the form to add your own quotes
4. Press Enter in the category field to quickly add quotes
5. Use "Export to JSON" to download your quote collection
6. Use "Import from JSON" to add quotes from a file
7. Use "Clear All Quotes" or "Reset to Defaults" for data management

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

## Error Handling

The application includes robust error handling for:
- Invalid JSON imports
- Storage quota exceeded
- File reading errors
- Network issues
- Browser compatibility issues
