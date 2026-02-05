# GenAI Study Guide - Enterprise Edition

A modern, enterprise-grade study guide platform with user authentication, progress tracking, and custom content management.

## 🚀 Features

### Core Functionality
- **User Authentication**: Simple email/password login with "Remember Me" option
- **Progress Tracking**: Visual progress indicators and completion tracking
- **Custom Content**: Create and manage your own categories and topics
- **Search & Filter**: Quickly find topics with real-time search
- **Data Management**: Import/Export functionality for backup and sharing
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### User Experience
- **Clean Interface**: Modern, dark-themed UI with intuitive navigation
- **Keyboard Shortcuts**: 
  - `ESC` - Close modals
  - `Ctrl/Cmd + K` - Focus search
- **Auto-Save**: Changes are automatically saved to browser storage
- **Print Support**: Print-friendly topic views

## 📁 Project Structure

```
genai-study-guide/
├── index.html          # Main application HTML
├── styles.css          # All CSS styles
├── auth.js            # Authentication system
├── app.js             # Main application logic
├── data.js            # Study topics data
└── admin/
    └── index.html     # Admin information page
```

## 🔧 Setup Instructions

### Option 1: Local Development

1. **Extract all files** to a directory
2. **Open `index.html`** in a modern web browser
3. **Sign in** with any email/password (no server required)
4. **Start learning!**

### Option 2: Deploy to Netlify

1. Create a new site on Netlify
2. Upload all files to your repository
3. Deploy with default settings
4. Access via your Netlify URL

### Option 3: Deploy to GitHub Pages

1. Create a new GitHub repository
2. Upload all files
3. Enable GitHub Pages in repository settings
4. Access via `https://yourusername.github.io/repo-name/`

## 👤 User Authentication

The application uses **browser-based authentication**:

- **Email**: Any valid email format
- **Password**: Any password (stored locally, not transmitted)
- **Remember Me**: Keeps you logged in between sessions

### Data Storage

Each user's data is stored in **browser LocalStorage**:
- Storage key: `studyGuide_data_{userId}`
- User ID: Generated hash from email
- Data includes: topics, categories, progress, custom content

## 📊 Managing Content

### Categories

**Add Category:**
1. Click "➕ Category" button
2. Enter name and select an icon
3. Click "Save"

**Edit Category:**
1. Click edit icon (✏️) on category header
2. Modify details
3. Click "Save"

**Delete Category:**
1. Click delete icon (🗑️) on category header
2. Confirm deletion

### Topics

**Add Topic:**
1. Click "➕" icon on category header
2. Enter topic details
3. Click "Save"

**Edit Topic:**
1. Click edit icon (✏️) on topic item
2. Modify details
3. Click "Save"

**Mark Complete:**
1. Open a topic
2. Click "Mark as Complete" button
3. Progress updates automatically

## 💾 Backup & Restore

### Export Data

1. Click user avatar (top-right)
2. Select "Export Data"
3. JSON file downloads automatically

### Import Data

1. Click user avatar (top-right)
2. Select "Import Data"
3. Choose your backup JSON file
4. Confirm merge/replace

## 🎨 Customization

### Changing Colors

Edit the CSS variables in `styles.css`:

```css
:root {
    --primary: #76b900;      /* Main brand color */
    --accent: #00a8e0;       /* Secondary color */
    --bg-dark: #0f0f0f;      /* Background */
    --text-light: #e0e0e0;   /* Text color */
}
```

### Adding Custom Data

Edit `data.js` to add pre-loaded topics:

```javascript
studyTopics = {
    "category-key": {
        "name": "Category Name",
        "icon": "🎯",
        "topics": [
            {
                "id": "unique-id",
                "name": "Topic Name",
                "description": "Description...",
                // ... more fields
            }
        ]
    }
}
```

## 🔒 Security Notes

**Current Implementation:**
- Client-side only (no server)
- Data stored in browser LocalStorage
- No data transmission
- No actual authentication validation

**For Production:**
- Implement backend API
- Use real authentication (OAuth, JWT)
- Store data in database (PostgreSQL, MongoDB)
- Add SSL/TLS encryption
- Implement role-based access control

## 🌐 Browser Compatibility

**Supported Browsers:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

**Required Features:**
- LocalStorage API
- ES6 JavaScript
- CSS Grid & Flexbox
- CSS Custom Properties

## 📱 Mobile Support

The application is fully responsive and works on:
- iOS Safari 14+
- Android Chrome 90+
- Mobile browsers with JavaScript enabled

## 🐛 Troubleshooting

### Data Not Saving

1. Check browser console for errors
2. Ensure LocalStorage is enabled
3. Clear browser cache and reload
4. Try incognito/private mode

### Login Issues

1. Use any valid email format
2. Password can be anything
3. Try without "Remember Me" first
4. Clear browser data if persistent

### Performance Issues

1. Reduce number of topics if too many (100+ topics)
2. Clear old browser data
3. Close other browser tabs
4. Update to latest browser version

## 🚀 Future Roadmap

- [ ] Backend API integration
- [ ] Real user authentication
- [ ] Database storage
- [ ] Collaborative features
- [ ] Analytics dashboard
- [ ] Mobile app
- [ ] Spaced repetition algorithm
- [ ] Quiz and assessment features
- [ ] Social sharing
- [ ] Multi-language support

## 📄 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

To contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📧 Support

For issues or questions:
- Check the troubleshooting section
- Review the code comments
- Contact your system administrator

---

**Version:** 2.0.0  
**Last Updated:** February 2026  
**Author:** Enterprise Learning Solutions
