// ============================================
// GLOBAL STATE
// ============================================
let completedTopics = new Set();
let currentTopic = null;
let editingCategory = null;
let editingTopic = null;
let currentUser = null;

// ============================================
// AUTHENTICATION (Netlify Identity)
// ============================================
function handleLogin() {
    if (window.netlifyIdentity) {
        window.netlifyIdentity.open();
    } else {
        alert('Authentication service not available. Please refresh the page.');
    }
}

function handleLogout() {
    if (window.netlifyIdentity) {
        window.netlifyIdentity.logout();
    }
    currentUser = null;
    showAuthScreen();
}

function continueAsGuest() {
    currentUser = { guest: true, email: 'guest@local' };
    showMainApp(null);
}

function showAuthScreen() {
    document.getElementById('authContainer').style.display = 'flex';
    document.getElementById('mainContainer').classList.remove('active');
}

function showMainApp(user) {
    document.getElementById('authContainer').style.display = 'none';
    document.getElementById('mainContainer').classList.add('active');
    
    if (user) {
        currentUser = user;
        document.getElementById('userInfo').style.display = 'flex';
        document.getElementById('userName').textContent = user.user_metadata?.full_name || 'User';
        document.getElementById('userEmail').textContent = user.email || '';
        document.getElementById('linkedinUserName').textContent = user.user_metadata?.full_name || 'Your Name';
    } else {
        document.getElementById('userInfo').style.display = 'none';
    }
    
    init();
}

// ============================================
// THEME TOGGLE
// ============================================
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    document.getElementById('themeIcon').textContent = newTheme === 'dark' ? '🌙' : '☀️';
    document.getElementById('themeText').textContent = newTheme === 'dark' ? 'Dark' : 'Light';
    
    // Update highlight.js theme
    const hljsTheme = document.getElementById('hljs-theme');
    if (hljsTheme) {
        hljsTheme.href = newTheme === 'dark' 
            ? 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/atom-one-dark.min.css'
            : 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/atom-one-light.min.css';
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.getElementById('themeIcon').textContent = savedTheme === 'dark' ? '🌙' : '☀️';
    document.getElementById('themeText').textContent = savedTheme === 'dark' ? 'Dark' : 'Light';
}

// ============================================
// INITIALIZATION
// ============================================
function init() {
    loadTheme();
    loadProgress();
    renderTopicsList();
    updateProgress();
    
    // Initialize pen size display
    const penSize = document.getElementById('penSize');
    if (penSize) {
        penSize.addEventListener('input', function() {
            document.getElementById('penSizeValue').textContent = this.value + 'px';
        });
    }
    
    // Initialize math preview
    const mathInput = document.getElementById('mathInput');
    if (mathInput) {
        mathInput.addEventListener('input', function() {
            const preview = document.getElementById('mathPreview');
            if (window.katex) {
                try {
                    katex.render(this.value, preview, { throwOnError: false, displayMode: true });
                } catch (e) {
                    preview.textContent = 'Invalid LaTeX';
                }
            }
        });
    }
}

// ============================================
// DATA PERSISTENCE
// ============================================
function loadProgress() {
    const storageKey = currentUser?.email ? `studyProgress_${currentUser.email}` : 'studyProgress';
    const saved = localStorage.getItem(storageKey);
    
    if (saved) {
        const data = JSON.parse(saved);
        completedTopics = new Set(data.completed || []);
        if (data.studyTopics) {
            studyTopics = data.studyTopics;
        }
    }
}

function saveProgress() {
    const storageKey = currentUser?.email ? `studyProgress_${currentUser.email}` : 'studyProgress';
    const data = {
        completed: Array.from(completedTopics),
        studyTopics: studyTopics
    };
    localStorage.setItem(storageKey, JSON.stringify(data));
    showSavedIndicator();
}

function showSavedIndicator() {
    const indicator = document.getElementById('savedIndicator');
    indicator.classList.add('show');
    setTimeout(() => indicator.classList.remove('show'), 2000);
}

// ============================================
// SIDEBAR RENDERING (OPTIMIZED)
// ============================================
function renderTopicsList() {
    const topicsList = document.getElementById('topicsList');
    const fragment = document.createDocumentFragment();
    
    Object.entries(studyTopics).forEach(([categoryKey, category]) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'topic-category';
        categoryDiv.innerHTML = `
            <div class="category-header" onclick="toggleCategory('${categoryKey}', this)">
                <div class="category-left">
                    <span class="category-icon">▶</span>
                    <span>${category.icon || '📁'} ${category.name}</span>
                </div>
                <div class="category-actions">
                    <button onclick="event.stopPropagation(); showAddTopicModal('${categoryKey}')" title="Add Topic">➕</button>
                    <button onclick="event.stopPropagation(); showEditCategoryModal('${categoryKey}')" title="Edit">✏️</button>
                    <button onclick="event.stopPropagation(); deleteCategory('${categoryKey}')" title="Delete">🗑️</button>
                </div>
            </div>
            <div class="category-items" id="category-${categoryKey}">
                ${renderCategoryTopics(category.topics, categoryKey)}
            </div>
        `;
        fragment.appendChild(categoryDiv);
    });
    
    topicsList.innerHTML = '';
    topicsList.appendChild(fragment);
    
    // Expand first category
    const firstKey = Object.keys(studyTopics)[0];
    if (firstKey) {
        toggleCategory(firstKey, document.querySelector('.category-header'));
    }
}

function renderCategoryTopics(topics, categoryKey) {
    if (!topics || topics.length === 0) {
        return '<div style="padding: 10px 20px; color: var(--text-muted); font-size: 0.85rem;">No topics yet</div>';
    }
    
    return topics.map(topic => {
        const isCompleted = completedTopics.has(topic.id);
        const topicData = encodeURIComponent(JSON.stringify(topic));
        return `
            <div class="topic-item ${isCompleted ? 'completed' : ''}" data-topic-id="${topic.id}">
                <div class="topic-item-content" onclick="loadTopicById('${topic.id}', '${categoryKey}')">
                    <div class="progress-indicator">${isCompleted ? '✓' : ''}</div>
                    <span>${topic.name}</span>
                </div>
                <div class="topic-item-actions">
                    <button onclick="event.stopPropagation(); showEditTopicModal('${categoryKey}', '${topic.id}')" title="Edit">✏️</button>
                    <button onclick="event.stopPropagation(); deleteTopic('${categoryKey}', '${topic.id}')" title="Delete">🗑️</button>
                </div>
            </div>
        `;
    }).join('');
}

function toggleCategory(categoryKey, headerEl) {
    const items = document.getElementById(`category-${categoryKey}`);
    const header = headerEl || document.querySelector(`[onclick*="toggleCategory('${categoryKey}'"]`);
    
    if (items) {
        const isActive = items.classList.contains('active');
        
        // Close all categories
        document.querySelectorAll('.category-items').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.category-header').forEach(el => el.classList.remove('expanded'));
        
        // Open clicked one if it wasn't active
        if (!isActive) {
            items.classList.add('active');
            if (header) header.classList.add('expanded');
        }
    }
}

function loadTopicById(topicId, categoryKey) {
    const category = studyTopics[categoryKey];
    if (category) {
        const topic = category.topics.find(t => t.id === topicId);
        if (topic) {
            loadTopic(topic);
            
            // Update active state
            document.querySelectorAll('.topic-item').forEach(el => el.classList.remove('active'));
            const topicEl = document.querySelector(`[data-topic-id="${topicId}"]`);
            if (topicEl) topicEl.classList.add('active');
        }
    }
}

// ============================================
// TOPIC LOADING & RENDERING
// ============================================
function loadTopic(topic) {
    currentTopic = topic;
    const contentArea = document.getElementById('contentArea');
    
    let html = `
        <div class="content-header">
            <div class="content-title">
                <h2>${topic.name}</h2>
                <div class="content-meta">
                    ${topic.time ? `<span class="meta-tag">⏱️ ${topic.time}</span>` : ''}
                    ${topic.difficulty ? `<span class="meta-tag">📊 ${topic.difficulty}</span>` : ''}
                </div>
            </div>
            <div class="action-buttons">
                <button class="btn ${completedTopics.has(topic.id) ? 'btn-primary' : 'btn-secondary'}" onclick="markComplete()">
                    ${completedTopics.has(topic.id) ? '✓ Completed' : '☐ Mark Complete'}
                </button>
                <button class="btn btn-linkedin" onclick="createLinkedInPost()">📱 LinkedIn</button>
            </div>
        </div>
    `;
    
    if (topic.description) {
        html += `<div class="content-section"><p style="color: var(--text-muted);">${topic.description}</p></div>`;
    }
    
    // Key Points
    html += `
        <div class="content-section" id="keyPointsSection">
            <div class="section-header">
                <h3 class="section-title">🎯 Key Points</h3>
                <div class="section-actions">
                    <button class="icon-btn" onclick="showMathModal()">➕ Math</button>
                    <button class="icon-btn" onclick="showCodeModal()">💻 Code</button>
                    <button class="icon-btn" onclick="addKeyPoint()">➕ Point</button>
                </div>
            </div>
            <div id="keyPointsList">${renderKeyPoints(topic.content?.keyPoints, topic.id)}</div>
        </div>
    `;
    
    // Examples
    html += `
        <div class="content-section" id="examplesSection">
            <div class="section-header">
                <h3 class="section-title">📚 Examples</h3>
                <div class="section-actions"><button class="icon-btn" onclick="addExample()">➕ Add</button></div>
            </div>
            <div id="examplesList">${renderExamples(topic.content?.examples, topic.id)}</div>
        </div>
    `;
    
    // Warnings
    html += `
        <div class="content-section" id="warningsSection">
            <div class="section-header">
                <h3 class="section-title">⚠️ Important Notes</h3>
                <div class="section-actions"><button class="icon-btn" onclick="addWarning()">➕ Add</button></div>
            </div>
            <div id="warningsList">${renderWarnings(topic.content?.warnings, topic.id)}</div>
        </div>
    `;
    
    // Handwritten Notes
    html += `
        <div class="content-section" id="handwrittenNotesSection">
            <div class="section-header">
                <h3 class="section-title">✍️ Handwritten Notes</h3>
                <div class="section-actions"><button class="icon-btn" onclick="addHandwrittenNote()">➕ New Pad</button></div>
            </div>
            <div id="handwrittenNotesList">${renderHandwrittenNotes(topic.content?.handwrittenNotes, topic.id)}</div>
        </div>
    `;
    
    contentArea.innerHTML = html;
    
    // Render math equations
    if (window.renderMathInElement) {
        renderMathInElement(contentArea, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false}
            ]
        });
    }
    
    // Highlight code blocks
    contentArea.querySelectorAll('pre code').forEach(block => {
        hljs.highlightElement(block);
    });
    
    attachInlineEditing();
}

function renderKeyPoints(keyPoints, topicId) {
    if (!keyPoints || keyPoints.length === 0) {
        return '<p style="color: var(--text-muted);">No key points yet. Click "Add Point" to create one.</p>';
    }
    
    return keyPoints.map((point, index) => `
        <div class="key-point" id="kp-${topicId}-${index}">
            <div class="key-point-header">
                <div class="key-point-title" id="kp-title-${topicId}-${index}">${point.title}</div>
                <div class="key-point-actions">
                    <button class="edit-btn" onclick="startEditingKeyPoint('${topicId}', ${index})">✏️</button>
                    <button class="delete-btn" onclick="deleteKeyPoint(${index})">🗑️</button>
                </div>
            </div>
            <div class="formatting-toolbar" id="toolbar-${topicId}-${index}">
                <div class="toolbar-group">
                    <button class="toolbar-btn" onclick="formatText('bold')"><b>B</b></button>
                    <button class="toolbar-btn" onclick="formatText('italic')"><i>I</i></button>
                    <button class="toolbar-btn" onclick="formatText('underline')"><u>U</u></button>
                </div>
                <div class="toolbar-group">
                    <button class="toolbar-btn" onclick="formatText('insertUnorderedList')">• List</button>
                    <button class="toolbar-btn" onclick="formatText('insertOrderedList')">1. List</button>
                </div>
                <div class="toolbar-group">
                    <select class="toolbar-select" onchange="formatText('foreColor', this.value)">
                        <option value="">Color</option>
                        <option value="#00a8e0">Blue</option>
                        <option value="#76b900">Green</option>
                        <option value="#ff9800">Orange</option>
                        <option value="#f44336">Red</option>
                    </select>
                    <select class="toolbar-select" onchange="formatText('hiliteColor', this.value)">
                        <option value="">Highlight</option>
                        <option value="#ffeb3b">Yellow</option>
                        <option value="#a5d6a7">Green</option>
                        <option value="#90caf9">Blue</option>
                    </select>
                </div>
                <div class="toolbar-group">
                    <button class="toolbar-btn" onclick="document.getElementById('img-${topicId}-${index}').click()">🖼️</button>
                    <button class="toolbar-btn" onclick="pasteImageIntoContent('${topicId}', ${index})">📋</button>
                </div>
                <div class="toolbar-group">
                    <button class="save-btn" onclick="saveKeyPointEdit('${topicId}', ${index})">💾 Save</button>
                    <button class="cancel-btn" onclick="cancelKeyPointEdit('${topicId}', ${index})">✖️</button>
                </div>
            </div>
            <input type="file" id="img-${topicId}-${index}" accept="image/*" style="display:none" onchange="insertImageInPoint('${topicId}', ${index}, event)">
            <div class="key-point-content" id="kp-content-${topicId}-${index}">${point.content}</div>
        </div>
    `).join('');
}

function renderExamples(examples, topicId) {
    if (!examples || examples.length === 0) {
        return '<p style="color: var(--text-muted);">No examples yet.</p>';
    }
    return examples.map((ex, i) => `
        <div class="example-box">
            <div class="example-title"><span>💡 ${ex.title}</span><button class="delete-btn" onclick="deleteExample(${i})">🗑️</button></div>
            <div class="example-content" contenteditable="true" data-type="example" data-index="${i}">${ex.content}</div>
        </div>
    `).join('');
}

function renderWarnings(warnings, topicId) {
    if (!warnings || warnings.length === 0) {
        return '<p style="color: var(--text-muted);">No notes yet.</p>';
    }
    return warnings.map((w, i) => `
        <div class="warning-box">
            <div class="warning-title"><span>⚠️ ${w.title}</span><button class="delete-btn" onclick="deleteWarning(${i})">🗑️</button></div>
            <div class="warning-content" contenteditable="true" data-type="warning" data-index="${i}">${w.content}</div>
        </div>
    `).join('');
}

function renderHandwrittenNotes(notes, topicId) {
    if (!notes || notes.length === 0) {
        return '<p style="color: var(--text-muted);">No handwritten notes yet.</p>';
    }
    return notes.map((note, i) => `
        <div class="handwritten-note">
            <div class="handwritten-note-header">
                <span class="handwritten-note-title">${note.title || 'Note #' + (i + 1)}</span>
                <div class="handwritten-note-actions">
                    <button class="edit-btn" onclick="editHandwrittenNote('${topicId}', ${i})">✏️</button>
                    <button class="delete-btn" onclick="deleteHandwrittenNote(${i})">🗑️</button>
                </div>
            </div>
            <div class="handwritten-note-preview"><img src="${note.data}" alt="Note"></div>
            ${note.caption ? `<div class="handwritten-note-caption">${note.caption}</div>` : ''}
        </div>
    `).join('');
}

// ============================================
// INLINE EDITING
// ============================================
function attachInlineEditing() {
    document.querySelectorAll('.example-content, .warning-content').forEach(el => {
        el.addEventListener('blur', function() { saveInlineEdit(this); });
    });
}

function saveInlineEdit(element) {
    if (!currentTopic) return;
    
    const type = element.dataset.type;
    const index = parseInt(element.dataset.index);
    
    for (const category of Object.values(studyTopics)) {
        const topic = category.topics.find(t => t.id === currentTopic.id);
        if (topic) {
            if (type === 'example' && topic.content.examples?.[index]) {
                topic.content.examples[index].content = element.innerHTML;
            } else if (type === 'warning' && topic.content.warnings?.[index]) {
                topic.content.warnings[index].content = element.innerHTML;
            }
            saveProgress();
            break;
        }
    }
}

function startEditingKeyPoint(topicId, index) {
    const toolbar = document.getElementById(`toolbar-${topicId}-${index}`);
    const title = document.getElementById(`kp-title-${topicId}-${index}`);
    const content = document.getElementById(`kp-content-${topicId}-${index}`);
    const keyPoint = document.getElementById(`kp-${topicId}-${index}`);
    
    toolbar.style.display = 'flex';
    title.contentEditable = 'true';
    content.contentEditable = 'true';
    keyPoint.classList.add('editing');
    
    title.dataset.original = title.innerHTML;
    content.dataset.original = content.innerHTML;
    content.focus();
}

function saveKeyPointEdit(topicId, index) {
    const toolbar = document.getElementById(`toolbar-${topicId}-${index}`);
    const title = document.getElementById(`kp-title-${topicId}-${index}`);
    const content = document.getElementById(`kp-content-${topicId}-${index}`);
    const keyPoint = document.getElementById(`kp-${topicId}-${index}`);
    
    toolbar.style.display = 'none';
    title.contentEditable = 'false';
    content.contentEditable = 'false';
    keyPoint.classList.remove('editing');
    
    // Save to data
    for (const category of Object.values(studyTopics)) {
        const topic = category.topics.find(t => t.id === topicId);
        if (topic?.content?.keyPoints?.[index]) {
            topic.content.keyPoints[index].title = title.innerHTML;
            topic.content.keyPoints[index].content = content.innerHTML;
            saveProgress();
            break;
        }
    }
}

function cancelKeyPointEdit(topicId, index) {
    const toolbar = document.getElementById(`toolbar-${topicId}-${index}`);
    const title = document.getElementById(`kp-title-${topicId}-${index}`);
    const content = document.getElementById(`kp-content-${topicId}-${index}`);
    const keyPoint = document.getElementById(`kp-${topicId}-${index}`);
    
    if (title.dataset.original) title.innerHTML = title.dataset.original;
    if (content.dataset.original) content.innerHTML = content.dataset.original;
    
    toolbar.style.display = 'none';
    title.contentEditable = 'false';
    content.contentEditable = 'false';
    keyPoint.classList.remove('editing');
}

function formatText(command, value = null) {
    document.execCommand(command, false, value);
}
 'px';
}

function setPenColor(color) {
    document.getElementById('penColor').value = color;
}

function toggleEraser() {
    isErasing = !isErasing;
    const btn = document.getElementById('eraserBtn');
    btn.style.background = isErasing ? 'var(--primary)' : '';
    btn.style.color = isErasing ? 'white' : '';
}

function clearHandwritingCanvas() {
    const canvas = document.getElementById('handwritingCanvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function resizeCanvas() {
    const canvas = document.getElementById('handwritingCanvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    const newWidth = parseInt(document.getElementById('canvasWidth').value) || 800;
    const newHeight = parseInt(document.getElementById('canvasHeight').value) || 600;
    
    canvas.width = newWidth;
    canvas.height = newHeight;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(imageData, 0, 0);
}

async function pasteImageToCanvas() {
    try {
        const items = await navigator.clipboard.read();
        for (const item of items) {
            for (const type of item.types) {
                if (type.startsWith('image/')) {
                    const blob = await item.getType(type);
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.getElementById('handwritingCanvas');
                        const ctx = canvas.getContext('2d');
                        const scale = Math.min(canvas.width / img.width, canvas.height / img.height, 1);
                        const x = (canvas.width - img.width * scale) / 2;
                        const y = (canvas.height - img.height * scale) / 2;
                        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                    };
                    img.src = URL.createObjectURL(blob);
                    return;
                }
            }
        }
        alert('No image in clipboard');
    } catch (e) {
        alert('Could not paste: ' + e.message);
    }
}

function saveHandwritingNote() {
    if (!currentTopic) return;
    
    const canvas = document.getElementById('handwritingCanvas');
    const noteData = {
        title: document.getElementById('handwritingTitle').value || 'Handwritten Note',
        caption: document.getElementById('handwritingCaption').value,
        data: canvas.toDataURL('image/png'),
        timestamp: new Date().toISOString()
    };
    
    for (const category of Object.values(studyTopics)) {
        const topic = category.topics.find(t => t.id === currentTopic.id);
        if (topic) {
            if (!topic.content.handwrittenNotes) topic.content.handwrittenNotes = [];
            
            if (currentHandwritingIndex !== null) {
                topic.content.handwrittenNotes[currentHandwritingIndex] = noteData;
            } else {
                topic.content.handwrittenNotes.push(noteData);
            }
            
            currentTopic = topic;
            loadTopic(topic);
            saveProgress();
            break;
        }
    }
    
    closeHandwritingPad();
}

// ============================================
// IMAGE HANDLING
// ============================================
let currentEditingImage = null;
let isDrawing = false;
let drawingContext = null;
let drawingEnabled = false;

function insertImageInPoint(topicId, index, event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const content = document.getElementById(`kp-content-${topicId}-${index}`);
        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.maxWidth = '100%';
        img.style.borderRadius = '8px';
        img.style.margin = '10px 0';
        img.style.cursor = 'pointer';
        img.onclick = () => openImageEditor(img);
        content.appendChild(img);
    };
    reader.readAsDataURL(file);
    event.target.value = '';
}

async function pasteImageIntoContent(topicId, index) {
    try {
        const items = await navigator.clipboard.read();
        for (const item of items) {
            for (const type of item.types) {
                if (type.startsWith('image/')) {
                    const blob = await item.getType(type);
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const content = document.getElementById(`kp-content-${topicId}-${index}`);
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.style.maxWidth = '100%';
                        img.style.borderRadius = '8px';
                        img.style.margin = '10px 0';
                        content.appendChild(img);
                    };
                    reader.readAsDataURL(blob);
                    return;
                }
            }
        }
    } catch (e) {
        alert('Could not paste image');
    }
}

function openImageEditor(imgEl) {
    currentEditingImage = imgEl;
    const modal = document.getElementById('imageEditorModal');
    const editImg = document.getElementById('editingImage');
    
    editImg.src = imgEl.src;
    document.getElementById('imgWidth').value = imgEl.width || 400;
    document.getElementById('widthValue').textContent = (imgEl.width || 400) + 'px';
    document.getElementById('imageCaption').value = '';
    
    drawingEnabled = false;
    document.getElementById('drawingCanvas').style.display = 'none';
    document.getElementById('drawBtn').textContent = '✏️ Draw';
    document.getElementById('clearDrawBtn').style.display = 'none';
    
    modal.classList.add('active');
}

function closeImageEditor() {
    document.getElementById('imageEditorModal').classList.remove('active');
    currentEditingImage = null;
}

function updateImageSize() {
    const width = document.getElementById('imgWidth').value;
    document.getElementById('editingImage').style.width = width + 'px';
    document.getElementById('widthValue').textContent = width + 'px';
}

function rotateImage(deg) {
    const img = document.getElementById('editingImage');
    const current = parseInt(img.dataset.rotation || 0);
    const newRot = current + deg;
    img.dataset.rotation = newRot;
    img.style.transform = `rotate(${newRot}deg)`;
}

function startDrawing() {
    drawingEnabled = !drawingEnabled;
    const canvas = document.getElementById('drawingCanvas');
    const btn = document.getElementById('drawBtn');
    const clearBtn = document.getElementById('clearDrawBtn');
    
    if (drawingEnabled) {
        const img = document.getElementById('editingImage');
        canvas.width = img.offsetWidth;
        canvas.height = img.offsetHeight;
        canvas.style.display = 'block';
        btn.textContent = '✏️ Stop';
        clearBtn.style.display = 'inline';
        
        drawingContext = canvas.getContext('2d');
        canvas.onmousedown = (e) => {
            isDrawing = true;
            const rect = canvas.getBoundingClientRect();
            drawingContext.beginPath();
            drawingContext.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        };
        canvas.onmousemove = (e) => {
            if (!isDrawing) return;
            const rect = canvas.getBoundingClientRect();
            drawingContext.strokeStyle = document.getElementById('drawColor').value;
            drawingContext.lineWidth = document.getElementById('drawSize').value;
            drawingContext.lineCap = 'round';
            drawingContext.lineTo(e.clientX - rect.left, e.clientY - rect.top);
            drawingContext.stroke();
        };
        canvas.onmouseup = canvas.onmouseout = () => { isDrawing = false; };
    } else {
        canvas.style.display = 'none';
        btn.textContent = '✏️ Draw';
        clearBtn.style.display = 'none';
    }
}

function clearDrawing() {
    const canvas = document.getElementById('drawingCanvas');
    drawingContext?.clearRect(0, 0, canvas.width, canvas.height);
}

function saveImageEdits() {
    if (!currentEditingImage) return;
    
    const editImg = document.getElementById('editingImage');
    const canvas = document.getElementById('drawingCanvas');
    
    if (drawingEnabled && canvas.style.display !== 'none') {
        const mergeCanvas = document.createElement('canvas');
        mergeCanvas.width = editImg.offsetWidth;
        mergeCanvas.height = editImg.offsetHeight;
        const ctx = mergeCanvas.getContext('2d');
        ctx.drawImage(editImg, 0, 0, mergeCanvas.width, mergeCanvas.height);
        ctx.drawImage(canvas, 0, 0);
        currentEditingImage.src = mergeCanvas.toDataURL();
    }
    
    currentEditingImage.style.width = editImg.style.width;
    currentEditingImage.style.transform = editImg.style.transform;
    
    closeImageEditor();
    showSavedIndicator();
}

function deleteEditingImage() {
    if (currentEditingImage && confirm('Delete image?')) {
        currentEditingImage.remove();
        closeImageEditor();
    }
}

// ============================================
// MATH & CODE MODALS
// ============================================
let mathTargetTopicId = null;
let mathTargetIndex = null;

function showMathModal() {
    if (!currentTopic) return;
    document.getElementById('mathInput').value = '';
    document.getElementById('mathPreview').innerHTML = '';
    document.getElementById('mathModal').classList.add('active');
}

function closeMathModal() {
    document.getElementById('mathModal').classList.remove('active');
}

function insertMathTemplate(template) {
    const input = document.getElementById('mathInput');
    input.value = template;
    input.dispatchEvent(new Event('input'));
}

function insertMathEquation() {
    const latex = document.getElementById('mathInput').value;
    if (!latex || !currentTopic) return;
    
    // Add to first key point or create one
    for (const category of Object.values(studyTopics)) {
        const topic = category.topics.find(t => t.id === currentTopic.id);
        if (topic) {
            if (!topic.content.keyPoints) topic.content.keyPoints = [];
            if (topic.content.keyPoints.length === 0) {
                topic.content.keyPoints.push({ title: 'Math Notes', content: '' });
            }
            topic.content.keyPoints[0].content += `<div class="math-block">$$${latex}$$</div>`;
            currentTopic = topic;
            loadTopic(topic);
            saveProgress();
            break;
        }
    }
    closeMathModal();
}

function showCodeModal() {
    if (!currentTopic) return;
    document.getElementById('codeInput').value = '';
    document.getElementById('codeModal').classList.add('active');
}

function closeCodeModal() {
    document.getElementById('codeModal').classList.remove('active');
}

function insertCodeBlock() {
    const code = document.getElementById('codeInput').value;
    const lang = document.getElementById('codeLanguage').value;
    if (!code || !currentTopic) return;
    
    const escapedCode = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    for (const category of Object.values(studyTopics)) {
        const topic = category.topics.find(t => t.id === currentTopic.id);
        if (topic) {
            if (!topic.content.keyPoints) topic.content.keyPoints = [];
            if (topic.content.keyPoints.length === 0) {
                topic.content.keyPoints.push({ title: 'Code Examples', content: '' });
            }
            topic.content.keyPoints[0].content += `<pre><code class="language-${lang}">${escapedCode}</code></pre>`;
            currentTopic = topic;
            loadTopic(topic);
            saveProgress();
            break;
        }
    }
    closeCodeModal();
}

// ============================================
// LINKEDIN POST GENERATOR
// ============================================
function createLinkedInPost() {
    if (!currentTopic) return;
    regenerateLinkedInPost();
    document.getElementById('linkedinModal').classList.add('active');
}

function closeLinkedInModal() {
    document.getElementById('linkedinModal').classList.remove('active');
}

function regenerateLinkedInPost() {
    if (!currentTopic) return;
    
    const style = document.getElementById('postStyle').value;
    const topic = currentTopic;
    let content = '';
    
    const hooks = {
        educational: [`🎓 Let's talk about ${topic.name}!`, `📚 Understanding ${topic.name}:`, `💡 Deep dive into ${topic.name}:`],
        storytelling: [`🚀 My journey learning ${topic.name}...`, `📖 Here's what I discovered about ${topic.name}:`, `✨ The story of mastering ${topic.name}:`],
        tips: [`💡 5 key insights about ${topic.name}:`, `🎯 Quick tips on ${topic.name}:`, `⚡ What you need to know about ${topic.name}:`],
        achievement: [`🏆 Just completed my study of ${topic.name}!`, `✅ Achievement unlocked: ${topic.name}`, `🎉 Milestone reached in ${topic.name}!`],
        question: [`❓ What's your experience with ${topic.name}?`, `🤔 How do you approach ${topic.name}?`, `💭 Let's discuss ${topic.name}:`]
    };
    
    const hook = hooks[style][Math.floor(Math.random() * hooks[style].length)];
    content = hook + '\n\n';
    
    if (topic.description) {
        content += topic.description + '\n\n';
    }
    
    if (topic.content?.keyPoints?.length > 0) {
        content += 'Key takeaways:\n';
        topic.content.keyPoints.slice(0, 3).forEach((kp, i) => {
            content += `${i + 1}. ${kp.title.replace(/<[^>]*>/g, '')}\n`;
        });
        content += '\n';
    }
    
    content += 'What are your thoughts? Share in the comments! 👇\n';
    
    document.getElementById('linkedinPostContent').textContent = content;
    document.getElementById('linkedinHashtags').textContent = '#AI #MachineLearning #GenAI #LearningInPublic #TechCommunity';
}

function copyLinkedInPost() {
    const content = document.getElementById('linkedinPostContent').textContent;
    const hashtags = document.getElementById('linkedinHashtags').textContent;
    navigator.clipboard.writeText(content + '\n' + hashtags).then(() => {
        alert('✓ Copied to clipboard!');
        closeLinkedInModal();
    });
}

// ============================================
// PDF & IMAGE EXPORT
// ============================================
async function exportFullPagePDF() {
    const progress = document.getElementById('exportProgress');
    const progressText = document.getElementById('exportProgressText');
    progress.classList.add('active');
    progressText.textContent = 'Generating PDF...';
    
    try {
        const content = document.getElementById('contentArea');
        const canvas = await html2canvas(content, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: getComputedStyle(document.body).getPropertyValue('--bg-dark')
        });
        
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        const filename = currentTopic ? `${currentTopic.name.replace(/[^a-z0-9]/gi, '_')}.pdf` : 'study-notes.pdf';
        pdf.save(filename);
        
    } catch (e) {
        alert('Export failed: ' + e.message);
    } finally {
        progress.classList.remove('active');
    }
}

async function exportAsImage() {
    const progress = document.getElementById('exportProgress');
    const progressText = document.getElementById('exportProgressText');
    progress.classList.add('active');
    progressText.textContent = 'Generating image...';
    
    try {
        const content = document.getElementById('contentArea');
        const canvas = await html2canvas(content, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: getComputedStyle(document.body).getPropertyValue('--bg-dark')
        });
        
        const link = document.createElement('a');
        link.download = currentTopic ? `${currentTopic.name.replace(/[^a-z0-9]/gi, '_')}.png` : 'study-notes.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        
    } catch (e) {
        alert('Export failed: ' + e.message);
    } finally {
        progress.classList.remove('active');
    }
}

// ============================================
// NETLIFY IDENTITY INIT
// ============================================
if (window.netlifyIdentity) {
    window.netlifyIdentity.on('init', user => {
        if (user) showMainApp(user);
    });
    window.netlifyIdentity.on('login', user => {
        showMainApp(user);
        window.netlifyIdentity.close();
    });
    window.netlifyIdentity.on('logout', () => showAuthScreen());
}

// Auto-init if no identity widget
document.addEventListener('DOMContentLoaded', () => {
    if (!window.netlifyIdentity) {
        // No Netlify Identity, show guest option
        setTimeout(() => {
            if (document.getElementById('authContainer').style.display !== 'none') {
                // Still on auth screen
            }
        }, 2000);
    }
});
