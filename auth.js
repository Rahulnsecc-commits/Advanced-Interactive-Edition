// Authentication System
const AUTH_STORAGE_KEY = 'studyGuide_auth';
const DATA_STORAGE_PREFIX = 'studyGuide_data_';

let currentUser = null;

// Initialize authentication
function initAuth() {
    const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (savedAuth) {
        try {
            const authData = JSON.parse(savedAuth);
            if (authData.rememberMe && authData.user) {
                autoLogin(authData.user);
            }
        } catch (e) {
            console.error('Error loading saved auth:', e);
        }
    }
}

// Show login form
function showLoginForm() {
    document.getElementById('modalOverlay').classList.add('active');
    document.getElementById('loginModal').classList.add('active');
}

// Close login form
function closeLoginForm() {
    document.getElementById('modalOverlay').classList.remove('active');
    document.getElementById('loginModal').classList.remove('active');
}

// Handle login
function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }

    // Simple validation (in production, this would be server-side)
    if (!validateEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }

    // Create user object
    const user = {
        id: generateUserId(email),
        email: email,
        name: email.split('@')[0],
        loginTime: new Date().toISOString()
    };

    // Save auth state
    if (rememberMe) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
            user: user,
            rememberMe: true
        }));
    }

    // Perform login
    performLogin(user);
}

// Auto login with saved credentials
function autoLogin(user) {
    performLogin(user);
}

// Perform the login action
function performLogin(user) {
    currentUser = user;

    // Update UI
    updateUserUI(user);

    // Load user data
    loadUserData(user.id);

    // Hide login, show app
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('appContainer').style.display = 'block';

    // Close login modal if open
    closeLoginForm();

    // Initialize app
    if (typeof init === 'function') {
        init();
    }
}

// Update user interface with user info
function updateUserUI(user) {
    document.getElementById('userName').textContent = user.name || user.email.split('@')[0];
    document.getElementById('userEmail').textContent = user.email;
    
    // Set user avatar (initials)
    const initials = getUserInitials(user);
    document.getElementById('userAvatar').textContent = initials;
}

// Get user initials
function getUserInitials(user) {
    const name = user.name || user.email;
    const parts = name.split(/[\s@]/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

// Validate email format
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Generate consistent user ID from email
function generateUserId(email) {
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
        const char = email.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
}

// Load user-specific data
function loadUserData(userId) {
    const storageKey = DATA_STORAGE_PREFIX + userId;
    const saved = localStorage.getItem(storageKey);
    
    if (saved) {
        try {
            const userData = JSON.parse(saved);
            
            // Apply user's data to global state
            if (userData.studyTopics) {
                studyTopics = userData.studyTopics;
            }
            if (userData.completed) {
                completedTopics = new Set(userData.completed);
            }
            if (userData.customData) {
                // Apply any custom user data
                Object.assign(window.customUserData || {}, userData.customData);
            }
        } catch (e) {
            console.error('Error loading user data:', e);
        }
    }
}

// Save user-specific data
function saveUserData() {
    if (!currentUser) return;
    
    const storageKey = DATA_STORAGE_PREFIX + currentUser.id;
    const data = {
        completed: Array.from(completedTopics),
        studyTopics: studyTopics,
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

// Override the global saveProgress function
window.saveProgress = saveUserData;

// Toggle user dropdown
function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('active');
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const profile = document.querySelector('.user-profile');
    const dropdown = document.getElementById('userDropdown');
    if (profile && !profile.contains(e.target) && dropdown) {
        dropdown.classList.remove('active');
    }
});

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        currentUser = null;
        
        // Clear auth if not remember me
        const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
        if (savedAuth) {
            try {
                const authData = JSON.parse(savedAuth);
                if (!authData.rememberMe) {
                    localStorage.removeItem(AUTH_STORAGE_KEY);
                }
            } catch (e) {
                localStorage.removeItem(AUTH_STORAGE_KEY);
            }
        }
        
        // Reset UI
        document.getElementById('appContainer').style.display = 'none';
        document.getElementById('loginScreen').style.display = 'flex';
        
        // Clear form
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
        document.getElementById('rememberMe').checked = false;
    }
}

// Export user data
function exportData() {
    if (!currentUser) return;
    
    const data = {
        user: currentUser.email,
        exported: new Date().toISOString(),
        studyTopics: studyTopics,
        completed: Array.from(completedTopics),
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

// Import user data
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
                    if (data.studyTopics) {
                        // Merge topics instead of replacing
                        studyTopics = { ...studyTopics, ...data.studyTopics };
                    }
                    if (data.completed) {
                        data.completed.forEach(id => completedTopics.add(id));
                    }
                    if (data.customData) {
                        window.customUserData = { ...(window.customUserData || {}), ...data.customData };
                    }
                    
                    saveUserData();
                    renderTopicsList();
                    updateProgress();
                    
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

// User settings (placeholder for future expansion)
function showUserSettings() {
    alert('Settings\n\nComing soon:\n• Theme customization\n• Notification preferences\n• Data sync options\n• Export/Import settings');
}

// Show export options
function showExportOptions() {
    if (confirm('Export your study data?\n\nThis will download a JSON file with all your topics and progress.')) {
        exportData();
    }
}

// Show saved indicator
function showSavedIndicator() {
    const indicator = document.getElementById('saveIndicator');
    indicator.classList.add('show');
    setTimeout(() => {
        indicator.classList.remove('show');
    }, 2000);
}

// Initialize auth on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
} else {
    initAuth();
}
