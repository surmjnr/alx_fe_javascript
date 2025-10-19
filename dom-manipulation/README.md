# Dynamic Quote Generator

A web application that demonstrates advanced DOM manipulation techniques in JavaScript.

## Features

- **Random Quote Display**: Shows random quotes from a predefined collection
- **Dynamic Quote Addition**: Allows users to add their own quotes through a form interface
- **Real-time Validation**: Form validation with user feedback
- **Smooth Animations**: CSS transitions for better user experience
- **Responsive Design**: Works on desktop and mobile devices
- **Quote Statistics**: Displays total quotes and categories count

## Files

- `index.html` - Main HTML structure with embedded CSS styling
- `script.js` - JavaScript functionality with DOM manipulation

## Key Functions

### Core Functions
- `showRandomQuote()` - Displays a random quote from the quotes array
- `addQuote()` - Adds a new quote to the array and updates the display
- `createAddQuoteForm()` - Sets up enhanced form with validation

### Utility Functions
- `filterQuotesByCategory(category)` - Filters quotes by category
- `searchQuotes(searchTerm)` - Searches quotes by text content
- `getRandomQuoteFromCategory(category)` - Gets random quote from specific category

## Usage

1. Open `index.html` in a web browser
2. Click "Show New Quote" to display random quotes
3. Use the form to add your own quotes
4. Press Enter in the category field to quickly add quotes

## DOM Manipulation Techniques Demonstrated

- Dynamic element creation using `document.createElement()`
- Event listener management
- Real-time form validation
- CSS class manipulation
- Animation effects with transitions
- Array management and filtering
- Input validation and user feedback

## Browser Compatibility

Works in all modern browsers that support ES6+ features.
