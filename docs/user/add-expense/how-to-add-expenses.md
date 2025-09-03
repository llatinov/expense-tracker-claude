# How to Add Expenses - User Guide

## Overview
The Add Expense feature allows you to quickly record your spending and keep track of your finances. Whether it's a coffee purchase, gas fill-up, or monthly bill, you can easily add any expense to your personal expense tracker.

## Getting to the Add Expense Page

### Method 1: From the Dashboard
1. Open the ExpenseTracker application in your browser
2. On the main dashboard, click the **"Add Expense"** button (blue button with plus icon)
3. You'll be taken to the Add New Expense page

### Method 2: From Navigation Menu
1. Look for the navigation menu (at the top on desktop, hamburger menu on mobile)
2. Click **"Add Expense"** from the menu options
3. The add expense form will open

### Method 3: Direct URL
- Navigate directly to `/add` in your browser address bar

## Filling Out the Expense Form

The expense form has four required fields that help categorize and track your spending:

### 📅 Date Field
**What it's for:** When did you make this purchase?
- **Default:** Today's date (automatically filled in)
- **How to change:** Click the date field and use the calendar picker
- **Tip:** You can add expenses from previous days by selecting an earlier date

### 💰 Amount Field  
**What it's for:** How much money did you spend?
- **Format:** Enter numbers only (e.g., 15.99 for $15.99)
- **Currency:** Automatically displayed in USD ($) format
- **Decimals:** You can include cents (e.g., 12.50)
- **Validation:** Must be greater than $0.00

**Examples:**
- Coffee: `4.95`
- Lunch: `12.50` 
- Gas: `45.00`
- Groceries: `67.23`

### 🏷️ Category Field
**What it's for:** What type of expense was this?

**Available Categories:**
- **🍽️ Food** - Restaurant meals, groceries, snacks, coffee
- **🚗 Transportation** - Gas, public transport, rideshare, parking
- **🎬 Entertainment** - Movies, streaming, games, concerts, books  
- **🛍️ Shopping** - Clothing, electronics, household items
- **📄 Bills** - Utilities, rent, phone, insurance, subscriptions
- **📝 Other** - Everything that doesn't fit other categories

**How to select:** Click the dropdown and choose the most appropriate category for your expense.

### 📝 Description Field
**What it's for:** Add details about what you purchased
- **Required:** You must enter some description
- **Examples:** 
  - "Starbucks latte"
  - "Grocery shopping at Whole Foods"
  - "Electric bill payment"
  - "Movie tickets for Avengers"
  - "Gas fill-up at Shell station"

**Tips for good descriptions:**
- Be specific enough that you'll remember what it was later
- Include the store/vendor name if relevant
- Mention what you bought if it's not obvious from the category

## Submitting Your Expense

### Save the Expense
1. Fill in all four required fields (Date, Amount, Category, Description)
2. Review your information to make sure it's correct
3. Click the **"Add Expense"** button at the bottom of the form
4. You'll see a brief "Saving..." message while the expense is being added
5. Once saved, you'll automatically return to the main dashboard

### Cancel Changes
- If you decide not to add the expense, click the **"Cancel"** button
- This will take you back to the previous page without saving anything
- No data will be lost or changed

## Form Validation & Error Handling

The form will check your input and show helpful error messages if something is missing or incorrect:

### Common Error Messages
- **"Date is required"** - Make sure you've selected a date
- **"Amount must be greater than 0"** - Enter a valid dollar amount
- **"Description is required"** - Add some text describing the expense

### How Errors Are Shown
- Invalid fields will have a red border
- Error messages appear in red text below the problematic field
- Fix the error and the red styling will disappear automatically

## After Adding an Expense

### What Happens Next
1. Your expense is immediately saved to your browser's storage
2. You're redirected to the main dashboard
3. You'll see your new expense in the "Recent Expenses" list
4. Your spending totals and charts will update automatically

### Verifying Your Expense Was Saved
- Check the dashboard summary cards - totals should include your new expense
- Look at the "Recent Expenses" section - your new expense should appear at the top
- Visit the "All Expenses" page to see your complete expense history

## Tips for Effective Expense Tracking

### Best Practices
1. **Add expenses immediately** - Don't wait days to enter them, you might forget details
2. **Be consistent with categories** - Always put similar expenses in the same category
3. **Use clear descriptions** - Write descriptions that will make sense to you later
4. **Include vendor names** - "Starbucks coffee" is better than just "coffee"
5. **Round to nearest cent** - Don't worry about being exact to the penny unless necessary

### Common Workflow Examples

**📱 Quick Coffee Purchase**
1. Buy coffee at Starbucks for $4.75
2. Open ExpenseTracker on your phone
3. Tap "Add Expense"
4. Leave today's date, enter "4.75", select "Food", type "Starbucks latte"
5. Tap "Add Expense" - done in 30 seconds!

**🛒 Grocery Shopping**
1. Finish grocery shopping, total was $87.23
2. While still in parking lot, add the expense
3. Date: today, Amount: 87.23, Category: Food, Description: "Weekly groceries at Kroger"
4. Submit and you're done

**⛽ Gas Fill-up**
1. Fill up gas tank for $52.00
2. Add expense: Amount: 52.00, Category: Transportation, Description: "Gas fill-up at Shell"
3. Helps track your monthly transportation costs

## Mobile Usage Tips

### Adding Expenses on Your Phone
- The form is fully responsive and works great on mobile devices
- Use the number keypad that appears for the amount field
- Date picker is touch-friendly
- Category dropdown is easy to navigate on small screens

### Mobile-Specific Features
- Form fields stack vertically for easy scrolling
- Large touch targets for buttons and form elements
- Keyboard automatically opens for text fields
- Form validates on mobile just like desktop

## Troubleshooting

### Common Issues & Solutions

**❌ "Nothing happens when I click Add Expense"**
- Make sure all required fields are filled in
- Check for error messages in red text
- Try clicking the button again if the page seems frozen

**❌ "My expense didn't save"**
- Check that you weren't in private/incognito browsing mode
- Make sure your browser allows localStorage
- Try refreshing the page and adding the expense again

**❌ "The form looks broken on my phone"**  
- Try refreshing the page
- Make sure you're using a modern mobile browser
- Clear your browser cache if styling issues persist

**❌ "I can't find the Add Expense button"**
- On mobile, look for the hamburger menu (three lines) to access navigation
- On desktop, the button should be prominently displayed on the dashboard

### Browser Requirements
- **Desktop:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile:** Modern mobile browsers from the last 2-3 years
- **Requirements:** JavaScript enabled, localStorage supported

## Data Privacy & Storage

### How Your Data is Stored
- All expense data is stored locally in your browser
- No data is sent to external servers
- Your information stays completely private on your device
- Data persists between browser sessions

### Backing Up Your Data
- Use the CSV export feature in "All Expenses" to backup your data
- Bookmark the application URL for easy access
- Consider manually backing up important data periodically

---

**🎉 You're Ready to Start Tracking!**

Adding expenses is quick and easy once you get the hang of it. Start by adding a few recent purchases to get familiar with the process, then make it a habit to add expenses as they happen. Your future self will thank you when you can see exactly where your money is going!