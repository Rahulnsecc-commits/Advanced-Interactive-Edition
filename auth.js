// Authentication + per-user storage (static-site friendly)
// NOTE: This is client-side only. For real security, use a server/Netlify Identity.

const AUTH_STORAGE_KEY = 'studyGuide_auth';
const USERS_STORAGE_KEY = 'studyGuide_users_v1';
const DATA_STORAGE_PREFIX = 'studyGuide_data_';

let currentUser = null;

// ---------- Helpers ----------
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function generateUserId(email) {
  // Stable ID per email (for per-user storage keys)
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    const char = email.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

function hashPassword(pw) {
  // Lightweight hash (NOT cryptographically secure) – good enough for demo/offline.
  // If you need stronger, switch to SubtleCrypto SHA-256 with async calls.
  let h = 5381;
  for (let i = 0; i < pw.length; i++) h = ((h << 5) + h) ^ pw.charCodeAt(i);
  return (h >>> 0).toString(16);
}

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function setUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function showSavedIndicator() {
  const indicator = document.getElementById('saveIndicator');
  indicator?.classList.add('show');
  setTimeout(() => indicator?.classList.remove('show'), 2000);
}

// ---------- UI: Login / Register modals ----------
function showLoginForm() {
  document.getElementById('modalOverlay')?.classList.add('active');
  document.getElementById('loginModal')?.classList.add('active');
  document.getElementById('registerModal')?.classList.remove('active');
}

function closeLoginForm() {
  document.getElementById('modalOverlay')?.classList.remove('active');
  document.getElementById('loginModal')?.classList.remove('active');
}

function showRegisterForm() {
  document.getElementById('modalOverlay')?.classList.add('active');
  document.getElementById('registerModal')?.classList.add('active');
  document.getElementById('loginModal')?.classList.remove('active');
}

function closeRegisterForm() {
  document.getElementById('modalOverlay')?.classList.remove('active');
  document.getElementById('registerModal')?.classList.remove('active');
}

function closeAllAuthModals() {
  closeLoginForm();
  closeRegisterForm();
}

// ---------- Auth ----------
function initAuth() {
  // If user previously chose "remember me"
  const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
  if (savedAuth) {
    try {
      const authData = JSON.parse(savedAuth);
      if (authData.rememberMe && authData.user) {
        performLogin(authData.user, { skipSave: true });
        return;
      }
    } catch (e) {
      console.error('Error loading saved auth:', e);
    }
  }

  // Ensure initial UI state
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('appContainer').style.display = 'none';
}

function handleRegister() {
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim().toLowerCase();
  const password = document.getElementById('registerPassword').value;
  const confirmPw = document.getElementById('registerConfirmPassword').value;

  if (!name || !email || !password || !confirmPw) {
    alert('Please fill all fields.');
    return;
  }
  if (!validateEmail(email)) {
    alert('Please enter a valid email address.');
    return;
  }
  if (password.length < 6) {
    alert('Password must be at least 6 characters.');
    return;
  }
  if (password !== confirmPw) {
    alert('Passwords do not match.');
    return;
  }

  const users = getUsers();
  if (users[email]) {
    alert('Account already exists. Please sign in.');
    showLoginForm();
    return;
  }

  const user = {
    id: generateUserId(email),
    email,
    name,
    createdAt: new Date().toISOString()
  };

  users[email] = { ...user, passwordHash: hashPassword(password) };
  setUsers(users);

  // Auto-login after registration
  performLogin(user);
}

function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;
  const rememberMe = document.getElementById('rememberMe').checked;

  if (!email || !password) {
    alert('Please enter both email and password.');
    return;
  }
  if (!validateEmail(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  const users = getUsers();
  const record = users[email];

  if (!record) {
    alert('No account found for this email. Please create an account.');
    showRegisterForm();
    return;
  }

  if (record.passwordHash !== hashPassword(password)) {
    alert('Incorrect password.');
    return;
  }

  const user = {
    id: record.id,
    email: record.email,
    name: record.name,
    loginTime: new Date().toISOString()
  };

  if (rememberMe) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, rememberMe: true }));
  } else {
    // Store session-less user in memory only
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, rememberMe: false }));
  }

  performLogin(user);
}

function performLogin(user, opts = {}) {
  currentUser = user;

  updateUserUI(user);

  // Load user data (topics + completion)
  loadUserData(user.id);

  // Hide login, show app
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('appContainer').style.display = 'block';

  closeAllAuthModals();

  // Initialize app after auth (init is defined in app.js)
  if (typeof init === 'function') init();

  // Ensure saveProgress is user-scoped (app.js defines saveProgress; we override it here)
  window.saveProgress = saveUserData;

  // Persist (optional) handled in handleLogin; but for auto-login we don't re-save
  if (!opts.skipSave) {
    // no-op
  }
}

function updateUserUI(user) {
  document.getElementById('userName').textContent = user.name || user.email.split('@')[0];
  document.getElementById('userEmail').textContent = user.email;

  const initials = getUserInitials(user);
  document.getElementById('userAvatar').textContent = initials;
}

function getUserInitials(user) {
  const name = user.name || user.email;
  const parts = name.split(/[\s@]/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
}

// ---------- Per-user data ----------
function loadUserData(userId) {
  const storageKey = DATA_STORAGE_PREFIX + userId;
  const saved = localStorage.getItem(storageKey);

  if (saved) {
    try {
      const userData = JSON.parse(saved);
      if (userData.studyTopics) window.studyTopics = userData.studyTopics;
      if (userData.completed) {
      window.completedTopics = new Set(userData.completed);
      // sync app.js binding
      if (typeof completedTopics !== 'undefined') completedTopics = window.completedTopics;
    }
      if (userData.customData) window.customUserData = { ...(window.customUserData || {}), ...userData.customData };
    } catch (e) {
      console.error('Error loading user data:', e);
    }
  } else {
    // First-time user: ensure we start from the default data.js content (already in window.studyTopics)
    window.completedTopics = window.completedTopics || new Set();
    if (typeof completedTopics !== 'undefined') completedTopics = window.completedTopics;
  }
}

function saveUserData() {
  if (!currentUser) return;

  const storageKey = DATA_STORAGE_PREFIX + currentUser.id;
  const data = {
    completed: Array.from(window.completedTopics || []),
    studyTopics: window.studyTopics || {},
    customData: window.customUserData || {},
    lastUpdated: new Date().toISOString()
  };

  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
    showSavedIndicator();
  } catch (e) {
    console.error('Error saving user data:', e);
    alert('Error saving data. Storage may be full.');
  }
}

// ---------- User dropdown / logout / import-export ----------
function toggleUserDropdown() {
  const dropdown = document.getElementById('userDropdown');
  dropdown?.classList.toggle('active');
}

document.addEventListener('click', (e) => {
  const profile = document.querySelector('.user-profile');
  const dropdown = document.getElementById('userDropdown');
  if (profile && !profile.contains(e.target) && dropdown) dropdown.classList.remove('active');
});

function logout() {
  if (!confirm('Are you sure you want to logout?')) return;

  currentUser = null;

  // Clear remembered auth
  localStorage.removeItem(AUTH_STORAGE_KEY);

  // Reset UI
  document.getElementById('appContainer').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';

  // Clear forms
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginPassword').value = '';
  document.getElementById('rememberMe').checked = false;

  // Optional: collapse dropdown
  document.getElementById('userDropdown')?.classList.remove('active');
}

function exportData() {
  if (!currentUser) return;

  const data = {
    user: currentUser.email,
    exported: new Date().toISOString(),
    studyTopics: window.studyTopics || {},
    completed: Array.from(window.completedTopics || []),
    customData: window.customUserData || {}
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `study-guide-backup-${currentUser.id}-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  alert('Data exported successfully!');
}

function importData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';

  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);

        if (confirm('This will merge with your current data. Continue?')) {
          if (data.studyTopics) window.studyTopics = { ...(window.studyTopics || {}), ...data.studyTopics };
          if (data.completed) data.completed.forEach(id => (window.completedTopics || new Set()).add(id));
          if (data.customData) window.customUserData = { ...(window.customUserData || {}), ...data.customData };

          saveUserData();
          if (typeof renderTopicsList === 'function') renderTopicsList();
          if (typeof updateProgress === 'function') updateProgress();

          alert('Data imported successfully!');
        }
      } catch (error) {
        alert('Error importing data: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  input.click();
}

function showUserSettings() {
  alert('Settings\n\nComing soon:\n• Theme customization\n• Notification preferences\n• Data sync options\n• Export/Import settings');
}

function showExportOptions() {
  if (confirm('Export your study data?\n\nThis will download a JSON file with all your topics and progress.')) {
    exportData();
  }
}

// Init
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuth);
} else {
  initAuth();
}
