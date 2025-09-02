# ExpenseTracker - Personal Finance Management

A modern, professional expense tracking web application built with Next.js 14, TypeScript, and Tailwind CSS. Manage your personal finances with an intuitive, responsive interface that works seamlessly on desktop and mobile devices.

## ✨ Features

### Core Functionality
- ➕ **Add Expenses** - Record expenses with date, amount, category, and description
- 📋 **View All Expenses** - Clean, organized list with advanced filtering
- ✏️ **Edit Expenses** - Update existing expense records
- 🗑️ **Delete Expenses** - Remove unwanted expense entries
- 🔍 **Search & Filter** - Find expenses by text, category, or date range

### Analytics & Insights
- 📊 **Dashboard Overview** - Summary cards showing key metrics
- 📈 **Visual Charts** - Pie charts and bar graphs for spending patterns  
- 📋 **Category Breakdown** - Detailed spending by category with progress bars
- 💰 **Monthly Tracking** - Current month spending vs. all-time totals

### Data Management
- 💾 **Local Storage** - All data persists in your browser
- 📤 **CSV Export** - Export your expense data for external analysis
- 🔄 **Real-time Updates** - Instant UI updates when data changes

### Categories
- 🍽️ **Food** - Restaurant meals, groceries, snacks
- 🚗 **Transportation** - Gas, public transport, rideshare
- 🎬 **Entertainment** - Movies, games, subscriptions
- 🛍️ **Shopping** - Clothing, electronics, misc purchases  
- 📄 **Bills** - Utilities, rent, insurance
- 📝 **Other** - Everything else

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed on your machine
- npm or yarn package manager

### Installation

1. **Navigate to the project directory**
   ```bash
   cd expense-tracker-claude
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🎯 How to Use

### Adding Your First Expense
1. Click the **"Add Expense"** button on the dashboard
2. Fill in the expense details:
   - **Date**: When the expense occurred
   - **Amount**: How much you spent (in USD)
   - **Category**: Select from 6 predefined categories
   - **Description**: What the expense was for
3. Click **"Add Expense"** to save

### Managing Expenses
- **View All**: Navigate to "All Expenses" to see your complete history
- **Search**: Use the search bar to find specific expenses
- **Filter**: Filter by category or date range
- **Edit**: Click the edit icon on any expense to modify it
- **Delete**: Click the trash icon to remove an expense (with confirmation)

### Analyzing Your Spending
- **Dashboard**: Get a quick overview of your financial activity
- **Analytics**: View detailed charts and spending breakdowns
- **Export**: Download your data as CSV for external analysis

### Features Overview
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Form Validation**: Ensures data quality with client-side validation  
- **Professional UI**: Clean, modern interface with intuitive navigation
- **Fast Performance**: Built with Next.js 14 for optimal speed
- **Type Safety**: Full TypeScript implementation for reliability

## 🛠️ Technical Details

### Built With
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for responsive design
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React for consistent iconography
- **Storage**: Browser localStorage for data persistence

### Project Structure
```
src/
├── app/                 # Next.js app router pages
├── components/          # Reusable UI components
├── contexts/           # React context providers
├── lib/                # Utility functions and helpers
├── types/              # TypeScript type definitions
└── constants/          # Application constants
```

## 🧪 Testing All Features

The application is now running at http://localhost:3000. Here's how to test each feature:

### ✅ Navigation
- Navigate between Dashboard, Add Expense, All Expenses, and Analytics
- Test mobile navigation (resize browser or use dev tools)
- Verify active page highlighting

### ✅ Adding Expenses
1. Go to "Add Expense" page
2. Test form validation (try submitting empty fields)
3. Add a few sample expenses with different categories
4. Verify redirect to dashboard after adding

### ✅ Dashboard Features
- View summary cards with spending totals
- See recent expenses list (limited to 5)
- Check category breakdown visualization
- Test quick action buttons

### ✅ All Expenses Page
- View complete expense list
- Test search functionality
- Filter by category and date range
- Try "Clear Filters" button
- Test CSV export

### ✅ Edit & Delete
- Click edit icon on any expense
- Modify expense details and save
- Test delete functionality with confirmation

### ✅ Analytics Page
- View pie and bar charts
- Check that charts update with your data
- Review spending insights panel

### ✅ Mobile Responsiveness
- Test on mobile device or use browser dev tools
- Verify navigation collapses correctly
- Check form usability on small screens

## 📱 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+  
- ✅ Safari 14+
- ✅ Edge 90+

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

---

**🎉 Your ExpenseTracker application is now ready to use!**

The app is fully functional with all requested features implemented. Data persists in your browser's localStorage, so your expenses will be saved between sessions. For production use, you can build and deploy the application using the commands above.
