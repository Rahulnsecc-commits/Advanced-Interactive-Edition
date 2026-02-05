# GenAI Study Guide - Advanced

An interactive study guide application with handwriting support, theme switching, and Netlify Identity authentication.

## Features

- 🔐 **Authentication**: Netlify Identity for login/register
- 🌓 **Dark/Light Theme**: Toggle between themes
- ✍️ **Handwriting Pad**: Draw notes with XP-Pen tablet support
  - Resizable canvas
  - Pressure sensitivity
  - Copy/Paste images
  - Eraser tool
- 📐 **Math Equations**: LaTeX support with KaTeX
- 💻 **Code Highlighting**: Syntax highlighting with Highlight.js
- 📄 **Export**: Download as PDF or Image
- 📱 **LinkedIn Posts**: Generate posts from your notes
- ☁️ **Cloud Sync**: Save progress per user

## Deployment to Netlify

### Method 1: Drag & Drop
1. Go to [Netlify Drop](https://app.netlify.com/drop)
2. Drag the entire project folder

### Method 2: Git Deploy
1. Push to GitHub/GitLab
2. Connect repo in Netlify dashboard
3. Deploy

### Enable Identity (Login Feature)
1. Go to Site Settings → Identity
2. Click "Enable Identity"
3. Under Registration, choose:
   - **Open** - Anyone can register
   - **Invite only** - You send invites
4. Optional: Enable external providers (Google, GitHub)
5. Go to Identity → Settings → Services
6. Enable "Git Gateway" if needed

## File Structure

```
├── index.html      # Main HTML with all styles
├── app.js          # Application logic
├── data.js         # Study topics data
├── netlify.toml    # Netlify configuration
└── README.md       # This file
```

## Local Development

Simply open `index.html` in a browser. Authentication will work in guest mode locally.

For full Identity testing, use Netlify CLI:
```bash
npm install -g netlify-cli
netlify dev
```

## Customization

### Adding Topics
Edit `data.js` to add your own study topics.

### Changing Theme Colors
Modify CSS variables in `index.html`:
```css
:root {
    --primary: #76b900;
    --accent: #00a8e0;
    /* ... */
}
```

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

Requires JavaScript enabled and localStorage for saving progress.

## License

MIT License - Feel free to use and modify!
