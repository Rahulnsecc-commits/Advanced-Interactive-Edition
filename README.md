# GenAI Study Guide (Advanced)

## Deploy on Netlify via GitHub

1. Create a GitHub repo (or use your existing repo).
2. Add these files to repo root:
   - genai-study-guide-advanced.html
   - app-advanced.js
   - data-latest.js
   - netlify.toml
3. Commit + push to GitHub.

## Netlify steps
1. In Netlify: **Add new site → Import from Git**
2. Choose your GitHub repo
3. Build settings:
   - Build command: (leave empty)
   - Publish directory: `.` (repo root)
4. Deploy.

## Local run
Just open `genai-study-guide-advanced.html` in a browser (or use a simple static server).

## Multi-user
Click the 👤 button in the sidebar header to create/switch users.
Edits (topic content, progress, handwritten notes, home title/subtitle) are saved per user in `localStorage`.
