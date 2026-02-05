// Main Application Logic
let completedTopics = new Set();
let currentTopic = null;
let editingCategory = null;
let editingTopic = null;

// Initialize the app
function init() {
    renderTopicsList();
    updateProgress();
}

// Render topics list in sidebar
function renderTopicsList() {
    const topicsList = document.getElementById('topicsList');
    topicsList.innerHTML = '';

    Object.entries(studyTopics).forEach(([categoryKey, category]) => {
        const categoryDiv = createCategoryElement(categoryKey, category);
        topicsList.appendChild(categoryDiv);
    });

    // Expand first category by default
    const firstCategory = Object.keys(studyTopics)[0];
    if (firstCategory) {
        toggleCategory(firstCategory);
    }
}

// Create category element
function createCategoryElement(categoryKey, category) {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'topic-category';

    const categoryHeader = document.createElement('div');
    categoryHeader.className = 'category-header';
    categoryHeader.innerHTML = `
        <span onclick="toggleCategory('${categoryKey}')">${category.icon} ${category.name}</span>
        <div class="category-actions">
            <button onclick="event.stopPropagation(); showAddTopicModal('${categoryKey}')" title="Add Topic">➕</button>
            <button onclick="event.stopPropagation(); showEditCategoryModal('${categoryKey}')" title="Edit">✏️</button>
            <button onclick="event.stopPropagation(); deleteCategory('${categoryKey}')" title="Delete">🗑️</button>
        </div>
    `;

    const categoryItems = document.createElement('div');
    categoryItems.className = 'category-items';
    categoryItems.id = `category-${categoryKey}`;

    category.topics.forEach(topic => {
        const topicItem = createTopicElement(categoryKey, topic);
        categoryItems.appendChild(topicItem);
    });

    categoryDiv.appendChild(categoryHeader);
    categoryDiv.appendChild(categoryItems);
    return categoryDiv;
}

// Create topic element
function createTopicElement(categoryKey, topic) {
    const topicItem = document.createElement('div');
    const isCompleted = completedTopics.has(topic.id);
    topicItem.className = `topic-item ${isCompleted ? 'completed' : ''}`;
    
    // Escape JSON for HTML attribute
    const topicJson = JSON.stringify(topic).replace(/"/g, '&quot;');
    
    topicItem.innerHTML = `
        <div class="topic-item-content" onclick="loadTopic(${topicJson})">
            <div class="progress-indicator">${isCompleted ? '✓' : ''}</div>
            <span>${topic.name}</span>
        </div>
        <div class="topic-item-actions">
            <button onclick="event.stopPropagation(); showEditTopicModal('${categoryKey}', '${topic.id}')" title="Edit">✏️</button>
            <button onclick="event.stopPropagation(); deleteTopic('${categoryKey}', '${topic.id}')" title="Delete">🗑️</button>
        </div>
    `;

    return topicItem;
}

// Toggle category expansion
function toggleCategory(categoryKey) {
    const categoryItems = document.getElementById(`category-${categoryKey}`);
    if (categoryItems) {
        categoryItems.classList.toggle('active');
    }
}

// Load topic content
function loadTopic(topic) {
    currentTopic = topic;
    const contentArea = document.getElementById('contentArea');
    
    contentArea.innerHTML = `
        <div class="topic-header">
            <h1 class="topic-title">${topic.name}</h1>
            <div class="topic-meta">
                <span>⏱️ ${topic.time || 'Self-paced'}</span>
                <span>📊 ${topic.difficulty || 'Intermediate'}</span>
            </div>
        </div>
        
        <div class="topic-description">
            ${topic.description || ''}
        </div>
        
        ${renderTopicContent(topic.content)}
        
        <div class="topic-actions">
            ${completedTopics.has(topic.id) 
                ? '<button class="btn-secondary" onclick="markIncomplete()">Mark as Incomplete</button>'
                : '<button class="btn-primary" onclick="markComplete()">Mark as Complete</button>'
            }
            <button class="btn-secondary" onclick="showPrintView()">Print</button>
        </div>
    `;
    
    // Highlight active topic in sidebar
    document.querySelectorAll('.topic-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.topic-item')?.classList.add('active');
}

// Render topic content sections
function renderTopicContent(content) {
    if (!content) return '';
    
    let html = '';
    
    // Key Points
    if (content.keyPoints && content.keyPoints.length > 0) {
        html += '<div class="topic-section"><h3>📝 Key Points</h3>';
        content.keyPoints.forEach(point => {
            html += `
                <div class="topic-content">
                    <h4>${point.title}</h4>
                    ${point.content}
                </div>
            `;
        });
        html += '</div>';
    }
    
    // Examples
    if (content.examples && content.examples.length > 0) {
        html += '<div class="topic-section"><h3>💡 Examples</h3>';
        content.examples.forEach(example => {
            html += `<div class="topic-content">${example}</div>`;
        });
        html += '</div>';
    }
    
    // Warnings
    if (content.warnings && content.warnings.length > 0) {
        html += '<div class="topic-section"><h3>⚠️ Important Notes</h3>';
        content.warnings.forEach(warning => {
            html += `<div class="topic-content">${warning}</div>`;
        });
        html += '</div>';
    }
    
    return html;
}

// Mark topic as complete
function markComplete() {
    if (currentTopic) {
        completedTopics.add(currentTopic.id);
        saveProgress();
        renderTopicsList();
        updateProgress();
        loadTopic(currentTopic);
    }
}

// Mark topic as incomplete
function markIncomplete() {
    if (currentTopic) {
        completedTopics.delete(currentTopic.id);
        saveProgress();
        renderTopicsList();
        updateProgress();
        loadTopic(currentTopic);
    }
}

// Update progress bar
function updateProgress() {
    const totalTopics = Object.values(studyTopics).reduce((sum, cat) => sum + cat.topics.length, 0);
    const completed = completedTopics.size;
    const percentage = totalTopics > 0 ? Math.round((completed / totalTopics) * 100) : 0;
    
    document.getElementById('progressFill').style.width = percentage + '%';
    document.getElementById('progressPercent').textContent = percentage + '%';
}

// Filter topics by search
function filterTopics() {
    const searchTerm = document.getElementById('searchBox').value.toLowerCase();
    
    document.querySelectorAll('.topic-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(searchTerm) ? 'flex' : 'none';
    });
    
    // Show all categories when searching
    if (searchTerm) {
        document.querySelectorAll('.category-items').forEach(cat => {
            cat.classList.add('active');
        });
    }
}

// Modal Management
function closeAllModals() {
    document.getElementById('modalOverlay').classList.remove('active');
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

// Category Modal Functions
function showAddCategoryModal() {
    editingCategory = null;
    document.getElementById('categoryModalTitle').textContent = 'Add Category';
    document.getElementById('categoryName').value = '';
    document.getElementById('categoryIcon').value = '📁';
    
    document.getElementById('modalOverlay').classList.add('active');
    document.getElementById('categoryModal').classList.add('active');
}

function showEditCategoryModal(categoryKey) {
    editingCategory = categoryKey;
    const category = studyTopics[categoryKey];
    
    document.getElementById('categoryModalTitle').textContent = 'Edit Category';
    document.getElementById('categoryName').value = category.name;
    document.getElementById('categoryIcon').value = category.icon;
    
    document.getElementById('modalOverlay').classList.add('active');
    document.getElementById('categoryModal').classList.add('active');
}

function closeCategoryModal() {
    closeAllModals();
    editingCategory = null;
}

function saveCategory() {
    const name = document.getElementById('categoryName').value.trim();
    const icon = document.getElementById('categoryIcon').value.trim();
    
    if (!name) {
        alert('Please enter a category name');
        return;
    }
    
    if (editingCategory) {
        // Edit existing category
        studyTopics[editingCategory].name = name;
        studyTopics[editingCategory].icon = icon || '📁';
    } else {
        // Add new category
        const key = name.toLowerCase().replace(/\s+/g, '-');
        studyTopics[key] = {
            name: name,
            icon: icon || '📁',
            topics: []
        };
    }
    
    saveProgress();
    renderTopicsList();
    closeCategoryModal();
}

function deleteCategory(categoryKey) {
    const category = studyTopics[categoryKey];
    if (confirm(`Delete category "${category.name}" and all its topics?`)) {
        delete studyTopics[categoryKey];
        saveProgress();
        renderTopicsList();
        updateProgress();
        
        // Clear content if showing deleted category's topic
        if (currentTopic && category.topics.some(t => t.id === currentTopic.id)) {
            document.getElementById('contentArea').innerHTML = `
                <div class="welcome-screen">
                    <div class="welcome-icon">📚</div>
                    <h2>Select a topic</h2>
                    <p>Choose a topic from the sidebar to continue studying.</p>
                </div>
            `;
        }
    }
}

// Topic Modal Functions
function showAddTopicModal(categoryKey) {
    editingTopic = null;
    editingCategory = categoryKey;
    
    document.getElementById('topicModalTitle').textContent = 'Add Topic';
    document.getElementById('topicName').value = '';
    document.getElementById('topicDescription').value = '';
    document.getElementById('topicContent').value = '';
    
    document.getElementById('modalOverlay').classList.add('active');
    document.getElementById('topicModal').classList.add('active');
}

function showEditTopicModal(categoryKey, topicId) {
    editingCategory = categoryKey;
    editingTopic = topicId;
    
    const topic = studyTopics[categoryKey].topics.find(t => t.id === topicId);
    
    document.getElementById('topicModalTitle').textContent = 'Edit Topic';
    document.getElementById('topicName').value = topic.name;
    document.getElementById('topicDescription').value = topic.description || '';
    
    // Extract content for editing
    let contentText = '';
    if (topic.content && topic.content.keyPoints) {
        contentText = topic.content.keyPoints.map(p => p.content).join('\n\n');
    }
    document.getElementById('topicContent').value = contentText;
    
    document.getElementById('modalOverlay').classList.add('active');
    document.getElementById('topicModal').classList.add('active');
}

function closeTopicModal() {
    closeAllModals();
    editingTopic = null;
}

function saveTopic() {
    const name = document.getElementById('topicName').value.trim();
    const description = document.getElementById('topicDescription').value.trim();
    const content = document.getElementById('topicContent').value.trim();
    
    if (!name) {
        alert('Please enter a topic name');
        return;
    }
    
    if (!editingCategory) {
        alert('No category selected');
        return;
    }
    
    const topicData = {
        id: editingTopic || generateId(name),
        name: name,
        description: description,
        time: 'Self-paced',
        difficulty: 'Intermediate',
        content: {
            keyPoints: content ? [{
                title: 'Content',
                content: content
            }] : [],
            examples: [],
            warnings: []
        }
    };
    
    if (editingTopic) {
        // Edit existing topic
        const index = studyTopics[editingCategory].topics.findIndex(t => t.id === editingTopic);
        if (index !== -1) {
            studyTopics[editingCategory].topics[index] = topicData;
        }
    } else {
        // Add new topic
        studyTopics[editingCategory].topics.push(topicData);
    }
    
    saveProgress();
    renderTopicsList();
    closeTopicModal();
}

function deleteTopic(categoryKey, topicId) {
    const topic = studyTopics[categoryKey].topics.find(t => t.id === topicId);
    if (confirm(`Delete topic "${topic.name}"?`)) {
        studyTopics[categoryKey].topics = studyTopics[categoryKey].topics.filter(t => t.id !== topicId);
        completedTopics.delete(topicId);
        saveProgress();
        renderTopicsList();
        updateProgress();
        
        // Clear content if showing deleted topic
        if (currentTopic && currentTopic.id === topicId) {
            document.getElementById('contentArea').innerHTML = `
                <div class="welcome-screen">
                    <div class="welcome-icon">📚</div>
                    <h2>Select a topic</h2>
                    <p>Choose a topic from the sidebar to continue studying.</p>
                </div>
            `;
        }
    }
}

// Utility function to generate ID from name
function generateId(name) {
    return name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        + '-' + Date.now();
}

// Print view
function showPrintView() {
    window.print();
}

// Save progress (will be overridden by auth.js for user-specific storage)
function saveProgress() {
    if (typeof saveUserData === 'function') {
        saveUserData();
    } else {
        // Fallback for non-authenticated mode
        const data = {
            completed: Array.from(completedTopics),
            studyTopics: studyTopics
        };
        localStorage.setItem('studyProgress', JSON.stringify(data));
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // ESC to close modals
    if (e.key === 'Escape') {
        closeAllModals();
    }
    
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchBox').focus();
    }
});

// Print styles
const style = document.createElement('style');
style.textContent = `
    @media print {
        .sidebar, .topic-actions, .modal, .modal-overlay, .save-indicator {
            display: none !important;
        }
        .main-content {
            width: 100%;
            margin: 0;
            padding: 20px;
        }
        body {
            background: white;
            color: black;
        }
    }
`;
document.head.appendChild(style);
