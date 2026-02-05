# GenAI Study Guide - Netlify Identity Setup Instructions

## 🚀 Quick Setup Guide

This guide will help you deploy your GenAI Study Guide with Netlify Identity authentication.

## 📋 Prerequisites

- A GitHub account
- A Netlify account (free tier is sufficient)
- Your application files ready to deploy

## 🔧 Step-by-Step Deployment

### 1. Prepare Your Repository

Create the following file structure in your GitHub repository:

```
your-repo/
├── index.html (your main app file)
├── app-advanced.js
├── data-latest.js
├── admin/
│   ├── index.html (admin.html)
│   └── config.yml
└── assets/
    └── images/ (for uploaded images)
```

**Important:** Rename `genai-study-guide-with-login.html` to `index.html` in your repository root.

### 2. Deploy to Netlify

#### Option A: Deploy via Netlify Dashboard

1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to your GitHub repository
4. Configure build settings:
   - **Build command:** (leave empty for static site)
   - **Publish directory:** `/` (root)
5. Click "Deploy site"

#### Option B: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init
netlify deploy --prod
```

### 3. Enable Netlify Identity

1. Go to your site dashboard on Netlify
2. Navigate to **Site settings** → **Identity**
3. Click **Enable Identity**
4. Configure the following settings:

#### Registration Preferences
- **Registration:** Open or Invite only (recommended: Invite only)
- **External providers:** Enable if you want Google/GitHub login
- **Email confirmations:** Enable (recommended)

#### Git Gateway (for CMS access)
1. Scroll down to **Services** → **Git Gateway**
2. Click **Enable Git Gateway**
3. This allows authenticated users to edit content via the CMS

### 4. Configure Identity Settings

#### Email Templates (Optional)
Customize the email templates:
- **Invitation template:** Welcome email for new users
- **Confirmation template:** Email verification
- **Recovery template:** Password reset email

#### Identity Settings
```
Site URL: https://your-site.netlify.app
Identity API: https://your-site.netlify.app/.netlify/identity
```

### 5. Invite Users

There are two ways to add users:

#### Method 1: Via Netlify Dashboard
1. Go to **Identity** tab in your site dashboard
2. Click **Invite users**
3. Enter email addresses
4. Users will receive an invitation email

#### Method 2: Allow Open Registration
1. In **Identity** settings
2. Set **Registration** to "Open"
3. Users can sign up directly at your site

### 6. Test the Authentication

1. Visit your deployed site: `https://your-site.netlify.app`
2. Click "Login / Sign Up"
3. Try logging in with an invited user or create a new account (if open registration)
4. Verify that the app loads after successful login

### 7. Access the CMS Admin Panel

1. Navigate to: `https://your-site.netlify.app/admin/`
2. Log in with your Netlify Identity credentials
3. You can now manage content through the CMS interface

## 🔐 Security Best Practices

1. **Use Invite-Only Registration** for production
2. **Enable Email Confirmations** to verify users
3. **Set up 2FA** in Netlify account settings
4. **Configure Webhook Secrets** for Git Gateway
5. **Regular Security Audits** of user access

## 📁 File Structure Explanation

### Main Files

**index.html (genai-study-guide-with-login.html)**
- Main application with login integration
- Includes Netlify Identity widget
- Handles authentication states

**admin/index.html**
- CMS admin interface
- Only accessible to authenticated users
- Manages content editing

**admin/config.yml**
- CMS configuration
- Defines content types and fields
- Specifies backend (Git Gateway)

## 🛠️ Customization Options

### Change Site Name
In `index.html`, update:
```html
<h1>GenAI Study Guide</h1>
<title>GenAI Solution Architect - Advanced Study Guide</title>
```

### Customize Login Screen
Modify the `.login-container` section in `index.html`:
```html
<div class="login-header">
    <h1>Your Custom Title</h1>
    <p>Your custom description</p>
</div>
```

### Add Custom Branding
Replace the emoji logo with your own:
```html
<div class="login-logo">🎓</div>
<!-- Change to -->
<div class="login-logo">
    <img src="/assets/logo.png" alt="Logo">
</div>
```

## 🔄 Syncing User Data

### Using Local Storage (Current Implementation)
- Data is stored in browser's localStorage
- Synced per-device, per-user
- Key: `studyGuideData`

### Upgrading to Cloud Sync (Optional)
To sync data across devices, you can:

1. **Use Netlify Functions**
   - Create serverless functions
   - Store data in a database (e.g., FaunaDB, MongoDB)
   - Sync on login/logout

2. **Use Firebase**
   - Set up Firebase Authentication
   - Use Firestore for data storage
   - Real-time sync across devices

## 📊 User Management

### View Users
1. Go to Netlify Dashboard
2. Click on your site
3. Navigate to **Identity** tab
4. See all registered users

### Remove Users
1. In **Identity** tab
2. Click on a user
3. Click **Delete user**

### Export User Data
1. In **Identity** tab
2. Use Netlify API to export user list:
```bash
netlify api listSiteIdentityUsers --data '{"site_id": "YOUR_SITE_ID"}'
```

## 🐛 Troubleshooting

### Issue: Login button doesn't work
**Solution:**
- Check browser console for errors
- Verify Netlify Identity is enabled
- Clear browser cache and cookies

### Issue: Users can't sign up
**Solution:**
- Check registration is set to "Open" or users are invited
- Verify email confirmation is not blocking registration
- Check spam folder for invitation emails

### Issue: CMS admin panel shows 404
**Solution:**
- Ensure `admin/index.html` exists in your repository
- Check Git Gateway is enabled
- Verify file path is `/admin/` not `/admin.html`

### Issue: Changes in CMS don't appear on site
**Solution:**
- Check if Netlify is rebuilding after commits
- Verify Git Gateway has write permissions
- Check build logs for errors

## 🔗 Useful Links

- [Netlify Identity Documentation](https://docs.netlify.com/visitor-access/identity/)
- [Decap CMS Documentation](https://decapcms.org/docs/intro/)
- [Git Gateway Setup](https://docs.netlify.com/visitor-access/git-gateway/)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)

## 📞 Support

For issues or questions:
- Check [Netlify Support Forums](https://answers.netlify.com/)
- Review [Decap CMS Community](https://github.com/decaporg/decap-cms/discussions)
- File issues on your GitHub repository

## 🎉 You're All Set!

Your GenAI Study Guide is now protected with Netlify Identity authentication. Users must log in to access the content, and you can manage everything through the Netlify dashboard.

Happy studying! 🚀
