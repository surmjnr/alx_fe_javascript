# Testing Guide for Dynamic Quote Generator

## Test Plan for Web Storage and JSON Import/Export Features

### Prerequisites
1. Open `index.html` in a web browser
2. Open browser developer tools (F12) to monitor console logs
3. Have a sample JSON file ready for import testing

### Test 1: Local Storage Persistence
**Objective**: Verify quotes persist across browser sessions

**Steps**:
1. Add a new quote using the form
2. Refresh the page (F5)
3. Verify the quote is still there
4. Close and reopen the browser
5. Verify the quote persists

**Expected Result**: Quotes should persist across sessions

### Test 2: Session Storage Features
**Objective**: Verify session-specific data storage

**Steps**:
1. View a random quote
2. Refresh the page
3. Check if the same quote is displayed with "(Restored from previous session)" note
4. Open a new tab and navigate to the same page
5. Verify different behavior (no session restoration)

**Expected Result**: Last viewed quote should be restored in the same session

### Test 3: JSON Export Functionality
**Objective**: Verify quotes can be exported to JSON file

**Steps**:
1. Add several quotes
2. Click "Export to JSON" button
3. Check downloads folder for the JSON file
4. Open the JSON file and verify content

**Expected Result**: JSON file should contain all quotes in proper format

### Test 4: JSON Import Functionality
**Objective**: Verify quotes can be imported from JSON file

**Steps**:
1. Create a test JSON file with this content:
```json
[
  {
    "text": "Test quote 1",
    "category": "Test"
  },
  {
    "text": "Test quote 2", 
    "category": "Testing"
  }
]
```
2. Click "Import from JSON" button
3. Select the test JSON file
4. Verify success message appears
5. Check that quotes were added to the collection

**Expected Result**: Quotes should be imported and added to existing collection

### Test 5: Error Handling
**Objective**: Verify robust error handling

**Steps**:
1. Try to import an invalid JSON file
2. Try to import a JSON file with invalid quote format
3. Try to import an empty JSON file
4. Verify appropriate error messages appear

**Expected Result**: Clear error messages should be displayed

### Test 6: Clear and Reset Functions
**Objective**: Verify data management functions

**Steps**:
1. Click "Clear All Quotes" button
2. Confirm the action
3. Verify all quotes are removed
4. Click "Reset to Defaults" button
5. Confirm the action
6. Verify default quotes are restored

**Expected Result**: Clear and reset should work as expected

### Test 7: Statistics Update
**Objective**: Verify statistics are updated correctly

**Steps**:
1. Note the initial quote count and categories
2. Add a new quote
3. Verify statistics update
4. Import quotes
5. Verify statistics update again
6. Clear quotes
7. Verify statistics reflect empty state

**Expected Result**: Statistics should update in real-time

### Test 8: Category Filtering System
**Objective**: Verify category filtering functionality works correctly

**Steps**:
1. Check that categories dropdown is populated with all available categories
2. Select a specific category from the dropdown
3. Verify that filtered quotes are displayed below
4. Check that quote count is shown correctly
5. Select "All Categories" and verify filtered display is hidden
6. Add a new quote with a new category
7. Verify the new category appears in the dropdown
8. Test filtering with the new category

**Expected Result**: Category filtering should work seamlessly with real-time updates

### Test 9: Filter Persistence
**Objective**: Verify filter selection persists across sessions

**Steps**:
1. Select a specific category filter
2. Refresh the page (F5)
3. Verify the same category is still selected
4. Close and reopen the browser
5. Verify the filter selection is restored
6. Test with different categories

**Expected Result**: Last selected filter should persist across sessions

### Test 10: Random Quote with Filtering
**Objective**: Verify "Show New Quote" button respects category filter

**Steps**:
1. Select a specific category
2. Click "Show New Quote" multiple times
3. Verify all quotes shown belong to the selected category
4. Select "All Categories"
5. Click "Show New Quote" and verify quotes from any category can appear
6. Test with categories that have only one quote

**Expected Result**: Random quotes should respect the current filter selection

### Test 11: Category Management
**Objective**: Verify category dropdown updates correctly

**Steps**:
1. Note initial categories in dropdown
2. Add quotes with existing categories
3. Verify dropdown doesn't duplicate categories
4. Add quotes with new categories
5. Verify new categories appear in dropdown
6. Clear all quotes
7. Verify dropdown shows only "All Categories"
8. Reset to defaults
9. Verify default categories are restored

**Expected Result**: Category dropdown should update dynamically and accurately

### Test 12: Filtered Quotes Display
**Objective**: Verify filtered quotes display correctly

**Steps**:
1. Select a category with multiple quotes
2. Verify all quotes in that category are displayed
3. Check that quotes are numbered correctly (1 of X, 2 of X, etc.)
4. Verify styling and formatting of filtered quotes
5. Select a category with no quotes
6. Verify "No quotes found" message appears
7. Test with categories that have one quote

**Expected Result**: Filtered quotes should display with proper formatting and numbering

### Test 13: Browser Compatibility
**Objective**: Verify functionality across different browsers

**Steps**:
1. Test in Chrome
2. Test in Firefox
3. Test in Safari (if available)
4. Test in Edge

**Expected Result**: Should work consistently across modern browsers

## Sample Test Data

### Valid JSON for Import Testing
```json
[
  {
    "text": "The only impossible journey is the one you never begin.",
    "category": "Inspiration"
  },
  {
    "text": "Success is not the key to happiness. Happiness is the key to success.",
    "category": "Success"
  },
  {
    "text": "The way to get started is to quit talking and begin doing.",
    "category": "Action"
  }
]
```

### Invalid JSON for Error Testing
```json
{
  "invalid": "format",
  "not": "an array"
}
```

## Console Commands for Advanced Testing

Open browser console and use these commands:

```javascript
// Check current quotes
console.log(QuoteGenerator.quotes());

// Check local storage
console.log(localStorage.getItem('quoteGenerator_quotes'));

// Check session storage
console.log(sessionStorage.getItem('quoteGenerator_lastQuote'));
console.log(sessionStorage.getItem('quoteGenerator_preferences'));

// Check filter storage
console.log(localStorage.getItem('quoteGenerator_lastFilter'));

// Test utility functions
console.log(QuoteGenerator.filterQuotesByCategory('Motivation'));
console.log(QuoteGenerator.searchQuotes('success'));

// Test filtering functions
QuoteGenerator.populateCategories();
QuoteGenerator.filterQuotes();

// Manual export test
QuoteGenerator.exportToJson();

// Manual storage test
QuoteGenerator.saveQuotesToStorage();

// Test category filtering
QuoteGenerator.showRandomQuoteFromFilter();
```

## Expected Console Output

When everything is working correctly, you should see:
- No error messages in console
- Successful storage operations
- Proper data validation
- Clean error handling

## Performance Considerations

The application should:
- Load quickly (< 1 second)
- Handle large quote collections efficiently
- Provide smooth animations
- Maintain responsive UI during operations
