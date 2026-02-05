// Advanced Study Guide - App Logic
let completedTopics = new Set();
let currentTopic = null;
let editingCategory = null;
let editingTopic = null;

// Initialize the app
function init() {
    loadProgress();
    renderTopicsList();
    updateProgress();
}

// Load progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem('studyProgress');
    if (saved) {
        const data = JSON.parse(saved);
        completedTopics = new Set(data.completed || []);
        
        // Load edited content
        if (data.studyTopics) {
            studyTopics = data.studyTopics;
        }
    }
}

// Save progress to localStorage
function saveProgress() {
    const data = {
        completed: Array.from(completedTopics),
        studyTopics: studyTopics
    };
    localStorage.setItem('studyProgress', JSON.stringify(data));
    showSavedIndicator();
}

// Render topics list in sidebar
function renderTopicsList() {
    const topicsList = document.getElementById('topicsList');
    topicsList.innerHTML = '';

    Object.entries(studyTopics).forEach(([categoryKey, category]) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'topic-category';

        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'category-header';
        categoryHeader.innerHTML = `
            <span onclick="toggleCategory('${categoryKey}')">${category.icon} ${category.name}</span>
            <div class="category-actions">
                <button onclick="showAddTopicModal('${categoryKey}')" title="Add Topic">➕</button>
                <button onclick="showEditCategoryModal('${categoryKey}')" title="Edit Category">✏️</button>
                <button onclick="deleteCategory('${categoryKey}')" title="Delete Category">🗑️</button>
            </div>
        `;

        const categoryItems = document.createElement('div');
        categoryItems.className = 'category-items';
        categoryItems.id = `category-${categoryKey}`;

        category.topics.forEach(topic => {
            const topicItem = document.createElement('div');
            topicItem.className = `topic-item ${completedTopics.has(topic.id) ? 'completed' : ''}`;
            
            topicItem.innerHTML = `
                <div class="topic-item-content" onclick="loadTopic(${JSON.stringify(topic).replace(/"/g, '&quot;')})">
                    <div class="progress-indicator">${completedTopics.has(topic.id) ? '✓' : ''}</div>
                    <span>${topic.name}</span>
                </div>
                <div class="topic-item-actions">
                    <button onclick="event.stopPropagation(); showEditTopicModal('${categoryKey}', '${topic.id}')" title="Edit">✏️</button>
                    <button onclick="event.stopPropagation(); deleteTopic('${categoryKey}', '${topic.id}')" title="Delete">🗑️</button>
                </div>
            `;

            categoryItems.appendChild(topicItem);
        });

        categoryDiv.appendChild(categoryHeader);
        categoryDiv.appendChild(categoryItems);
        topicsList.appendChild(categoryDiv);
    });

    const firstCategory = Object.keys(studyTopics)[0];
    if (firstCategory) {
        toggleCategory(firstCategory);
    }
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

    document.querySelectorAll('.topic-item').forEach(item => item.classList.remove('active'));
    if (event && event.currentTarget) {
        event.currentTarget.closest('.topic-item')?.classList.add('active');
    }

    let contentHTML = `
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
                    ${completedTopics.has(topic.id) ? '✓ Completed' : '□ Mark Complete'}
                </button>
                <button class="btn btn-linkedin" onclick="createLinkedInPost()">
                    📱 LinkedIn Post
                </button>
            </div>
        </div>
    `;

    if (topic.description) {
        contentHTML += `
            <div class="content-section">
                <p style="font-size: 1.1rem; color: var(--text-muted);">${topic.description}</p>
            </div>
        `;
    }

    // Key Points Section
    if (topic.content?.keyPoints) {
        contentHTML += `
            <div class="content-section" id="keyPointsSection">
                <div class="section-header">
                    <h3 class="section-title">🎯 Key Points</h3>
                    <div class="section-actions">
                        <button class="icon-btn" onclick="addKeyPoint()">➕ Add Point</button>
                    </div>
                </div>
                <div id="keyPointsList">
                    ${renderKeyPoints(topic.content.keyPoints, topic.id)}
                </div>
            </div>
        `;
    }

    // Examples Section
    if (topic.content?.examples || true) {
        contentHTML += `
            <div class="content-section" id="examplesSection">
                <div class="section-header">
                    <h3 class="section-title">📚 Learning Resources & Examples</h3>
                    <div class="section-actions">
                        <button class="icon-btn" onclick="addExample()">➕ Add Example</button>
                    </div>
                </div>
                <div id="examplesList">
                    ${topic.content?.examples ? renderExamples(topic.content.examples, topic.id) : '<p style="color: var(--text-muted);">No examples yet. Click "Add Example" to create one.</p>'}
                </div>
            </div>
        `;
    }

    // Warnings Section
    if (topic.content?.warnings || true) {
        contentHTML += `
            <div class="content-section" id="warningsSection">
                <div class="section-header">
                    <h3 class="section-title">⚠️ Important Notes</h3>
                    <div class="section-actions">
                        <button class="icon-btn" onclick="addWarning()">➕ Add Note</button>
                    </div>
                </div>
                <div id="warningsList">
                    ${topic.content?.warnings ? renderWarnings(topic.content.warnings, topic.id) : '<p style="color: var(--text-muted);">No important notes yet. Click "Add Note" to create one.</p>'}
                </div>
            </div>
        `;
    }

    // Handwritten Notes Section
    contentHTML += `
        <div class="content-section" id="handwrittenNotesSection">
            <div class="section-header">
                <h3 class="section-title">✍️ Handwritten Notes</h3>
                <div class="section-actions">
                    <button class="icon-btn" onclick="addHandwrittenNote()">➕ New Note Pad</button>
                </div>
            </div>
            <div id="handwrittenNotesList">
                ${topic.content?.handwrittenNotes ? renderHandwrittenNotes(topic.content.handwrittenNotes, topic.id) : '<p style="color: var(--text-muted);">No handwritten notes yet. Click "New Note Pad" to start writing!</p>'}
            </div>
        </div>
    `;

    contentArea.innerHTML = contentHTML;
    attachInlineEditing();
    
    // Enable drag and drop for reordering
    setTimeout(() => {
        enableDragAndDrop();
    }, 100);
}

// Render Key Points
function renderKeyPoints(keyPoints, topicId) {
    if (!keyPoints || keyPoints.length === 0) {
        return '<p style="color: var(--text-muted);">No key points yet. Click "Add Point" to create one.</p>';
    }
    
    return keyPoints.map((point, index) => `
        <div class="key-point" id="kp-${topicId}-${index}" data-index="${index}">
            <div class="key-point-header">
                <div class="key-point-title" id="kp-title-${topicId}-${index}" data-type="title" data-index="${index}">
                    ${point.title}
                </div>
                <div class="key-point-actions">
                    <button class="edit-btn" onclick="startEditingKeyPoint('${topicId}', ${index})">✏️ Edit</button>
                    <button class="delete-btn" onclick="deleteKeyPoint(${index})">🗑️ Delete</button>
                </div>
            </div>
            
            <!-- Formatting Toolbar (Hidden by default) -->
            <div class="formatting-toolbar" id="toolbar-${topicId}-${index}" style="display: none;">
                <div class="toolbar-group">
                    <button class="toolbar-btn" onclick="formatContent('${topicId}', ${index}, 'bold')" title="Bold">
                        <strong>B</strong>
                    </button>
                    <button class="toolbar-btn" onclick="formatContent('${topicId}', ${index}, 'italic')" title="Italic">
                        <em>I</em>
                    </button>
                    <button class="toolbar-btn" onclick="formatContent('${topicId}', ${index}, 'underline')" title="Underline">
                        <u>U</u>
                    </button>
                </div>
                <div class="toolbar-group">
                    <button class="toolbar-btn" onclick="formatContent('${topicId}', ${index}, 'insertUnorderedList')" title="Bullet List">
                        • List
                    </button>
                    <button class="toolbar-btn" onclick="formatContent('${topicId}', ${index}, 'insertOrderedList')" title="Numbered List">
                        1. List
                    </button>
                </div>
                <div class="toolbar-group">
                    <select class="toolbar-select" onchange="changeColor('${topicId}', ${index}, this.value)" title="Text Color">
                        <option value="">Color</option>
                        <option value="#ffffff">⚪ White</option>
                        <option value="#00a8e0">🔵 Blue</option>
                        <option value="#76b900">🟢 Green</option>
                        <option value="#ff9800">🟠 Orange</option>
                        <option value="#f44336">🔴 Red</option>
                    </select>
                    <select class="toolbar-select" onchange="highlightContent('${topicId}', ${index}, this.value)" title="Highlight">
                        <option value="">Highlight</option>
                        <option value="#ffeb3b">🟡 Yellow</option>
                        <option value="#4caf50">🟢 Green</option>
                        <option value="#2196f3">🔵 Blue</option>
                        <option value="#e91e63">🔴 Pink</option>
                    </select>
                </div>
                <div class="toolbar-group">
                    <button class="toolbar-btn" onclick="document.getElementById('img-${topicId}-${index}').click()" title="Insert Image">
                        🖼️ Image
                    </button>
                    <button class="toolbar-btn" onclick="pasteImageFromClipboard('${topicId}', ${index})" title="Paste Image">
                        📋 Paste
                    </button>
                    <button class="toolbar-btn" onclick="document.getElementById('file-${topicId}-${index}').click()" title="Attach File">
                        📎 File
                    </button>
                    <button class="toolbar-btn" onclick="insertLink('${topicId}', ${index})" title="Insert Link">
                        🔗 Link
                    </button>
                    <button class="toolbar-btn" onclick="insertYouTubeInPoint('${topicId}', ${index})" title="Embed YouTube">
                        ▶️ YouTube
                    </button>
                </div>
                <div class="toolbar-group">
                    <button class="save-btn" onclick="saveKeyPointEdit('${topicId}', ${index})">💾 Save</button>
                    <button class="cancel-btn" onclick="cancelKeyPointEdit('${topicId}', ${index})">✖️ Cancel</button>
                </div>
            </div>
            
            <input type="file" id="img-${topicId}-${index}" accept="image/*" style="display: none;" onchange="insertImageInPoint('${topicId}', ${index}, event)" multiple>
            <input type="file" id="file-${topicId}-${index}" accept=".pdf,.doc,.docx,.txt,.xlsx,.pptx" style="display: none;" onchange="insertFileInPoint('${topicId}', ${index}, event)" multiple>
            
            <div class="key-point-content" id="kp-content-${topicId}-${index}" data-type="content" data-index="${index}">
                ${point.content}
            </div>
        </div>
    `).join('');
}

// Render Examples
function renderExamples(examples, topicId) {
    if (!examples || examples.length === 0) {
        return '<p style="color: var(--text-muted);">No examples yet. Click "Add Example" to create one.</p>';
    }
    
    return examples.map((example, index) => `
        <div class="example-box" id="ex-${topicId}-${index}" data-index="${index}">
            <div class="example-title">
                <span>💡 ${example.title}</span>
                <button class="delete-btn" onclick="deleteExample(${index})">🗑️ Delete</button>
            </div>
            <div class="example-content" contenteditable="true" data-type="example" data-index="${index}">
                ${example.content}
            </div>
        </div>
    `).join('');
}

// Render Warnings
function renderWarnings(warnings, topicId) {
    if (!warnings || warnings.length === 0) {
        return '<p style="color: var(--text-muted);">No important notes yet. Click "Add Note" to create one.</p>';
    }
    
    return warnings.map((warning, index) => `
        <div class="warning-box" id="warn-${topicId}-${index}" data-index="${index}">
            <div class="warning-title">
                <span>⚠️ ${warning.title}</span>
                <button class="delete-btn" onclick="deleteWarning(${index})">🗑️ Delete</button>
            </div>
            <div class="warning-content" contenteditable="true" data-type="warning" data-index="${index}">
                ${warning.content}
            </div>
        </div>
    `).join('');
}

// Attach inline editing to all contenteditable elements
function attachInlineEditing() {
    // Title editing for examples and warnings remain simple
    const exampleContents = document.querySelectorAll('.example-content[contenteditable="true"]');
    const warningContents = document.querySelectorAll('.warning-content[contenteditable="true"]');
    
    [...exampleContents, ...warningContents].forEach(element => {
        element.addEventListener('focus', function() {
            this.closest('.example-box, .warning-box')?.classList.add('editing');
        });
        
        element.addEventListener('blur', function() {
            this.closest('.example-box, .warning-box')?.classList.remove('editing');
            saveInlineEdit(this);
        });
        
        let timeout;
        element.addEventListener('input', function() {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                saveInlineEdit(this);
            }, 1000);
        });
    });
}

// Start editing a key point - show toolbar and make content editable
function startEditingKeyPoint(topicId, index) {
    const toolbar = document.getElementById(`toolbar-${topicId}-${index}`);
    const titleEl = document.getElementById(`kp-title-${topicId}-${index}`);
    const contentEl = document.getElementById(`kp-content-${topicId}-${index}`);
    const keyPointDiv = document.getElementById(`kp-${topicId}-${index}`);
    
    // Show toolbar
    toolbar.style.display = 'flex';
    
    // Make content editable
    titleEl.contentEditable = 'true';
    contentEl.contentEditable = 'true';
    
    // Add editing class
    keyPointDiv.classList.add('editing');
    
    // Focus on content
    contentEl.focus();
    
    // Store original content for cancel
    titleEl.dataset.original = titleEl.innerHTML;
    contentEl.dataset.original = contentEl.innerHTML;
}

// Save key point edit - hide toolbar and make content non-editable
function saveKeyPointEdit(topicId, index) {
    const toolbar = document.getElementById(`toolbar-${topicId}-${index}`);
    const titleEl = document.getElementById(`kp-title-${topicId}-${index}`);
    const contentEl = document.getElementById(`kp-content-${topicId}-${index}`);
    const keyPointDiv = document.getElementById(`kp-${topicId}-${index}`);
    
    // Hide toolbar
    toolbar.style.display = 'none';
    
    // Make content non-editable
    titleEl.contentEditable = 'false';
    contentEl.contentEditable = 'false';
    
    // Remove editing class
    keyPointDiv.classList.remove('editing');
    
    // Save to data structure
    saveKeyPointToData(topicId, index, titleEl.innerHTML, contentEl.innerHTML);
    
    // Clear original data
    delete titleEl.dataset.original;
    delete contentEl.dataset.original;
}

// Cancel key point edit - restore original and hide toolbar
function cancelKeyPointEdit(topicId, index) {
    const toolbar = document.getElementById(`toolbar-${topicId}-${index}`);
    const titleEl = document.getElementById(`kp-title-${topicId}-${index}`);
    const contentEl = document.getElementById(`kp-content-${topicId}-${index}`);
    const keyPointDiv = document.getElementById(`kp-${topicId}-${index}`);
    
    // Restore original content
    if (titleEl.dataset.original) {
        titleEl.innerHTML = titleEl.dataset.original;
    }
    if (contentEl.dataset.original) {
        contentEl.innerHTML = contentEl.dataset.original;
    }
    
    // Hide toolbar
    toolbar.style.display = 'none';
    
    // Make content non-editable
    titleEl.contentEditable = 'false';
    contentEl.contentEditable = 'false';
    
    // Remove editing class
    keyPointDiv.classList.remove('editing');
    
    // Clear original data
    delete titleEl.dataset.original;
    delete contentEl.dataset.original;
}

// Save key point to data structure
function saveKeyPointToData(topicId, index, title, content) {
    if (!currentTopic) return;
    
    // Find the topic in the data structure
    for (const category of Object.values(studyTopics)) {
        const topic = category.topics.find(t => t.id === topicId);
        if (topic && topic.content.keyPoints[index]) {
            topic.content.keyPoints[index].title = title;
            topic.content.keyPoints[index].content = content;
            saveProgress();
            break;
        }
    }
}

// Formatting functions for key points
function formatContent(topicId, index, command, value = null) {
    const contentEl = document.getElementById(`kp-content-${topicId}-${index}`);
    contentEl.focus();
    document.execCommand(command, false, value);
}

function changeColor(topicId, index, color) {
    if (color) {
        const contentEl = document.getElementById(`kp-content-${topicId}-${index}`);
        contentEl.focus();
        document.execCommand('foreColor', false, color);
    }
}

function highlightContent(topicId, index, color) {
    if (color) {
        const contentEl = document.getElementById(`kp-content-${topicId}-${index}`);
        contentEl.focus();
        document.execCommand('backColor', false, color);
    }
}

function insertLink(topicId, index) {
    const url = prompt('Enter URL:');
    if (!url) return;
    
    let displayText = prompt('Enter link text (optional):');
    if (!displayText) displayText = url;
    
    const contentEl = document.getElementById(`kp-content-${topicId}-${index}`);
    contentEl.focus();
    
    const link = document.createElement('a');
    link.href = url;
    link.textContent = displayText;
    link.target = '_blank';
    link.style.color = '#00a8e0';
    link.style.textDecoration = 'underline';
    
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(link);
        range.insertNode(document.createTextNode(' '));
    }
}

function insertImageInPoint(topicId, index, event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const contentEl = document.getElementById(`kp-content-${topicId}-${index}`);
    
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgWrapper = document.createElement('div');
            imgWrapper.className = 'image-wrapper';
            imgWrapper.draggable = true;
            imgWrapper.contentEditable = 'false'; // Prevent editing the wrapper itself
            
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.style.borderRadius = '8px';
            img.style.display = 'block';
            img.dataset.rotation = '0';
            
            // Click to edit image
            img.onclick = function(e) {
                e.stopPropagation();
                openImageEditor(this);
            };
            
            imgWrapper.appendChild(img);
            
            // Insert at cursor position if possible, otherwise append
            const selection = window.getSelection();
            if (selection.rangeCount > 0 && contentEl.contains(selection.anchorNode)) {
                const range = selection.getRangeAt(0);
                range.deleteContents();
                range.insertNode(imgWrapper);
                
                // Add line break after image
                const br = document.createElement('br');
                imgWrapper.parentNode.insertBefore(br, imgWrapper.nextSibling);
                
                // Move cursor after the image
                range.setStartAfter(br);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
            } else {
                // Fallback: append to end
                contentEl.appendChild(imgWrapper);
                contentEl.appendChild(document.createElement('br'));
            }
            
            // Add drag and drop handlers
            attachDragHandlers(imgWrapper);
        };
        reader.readAsDataURL(file);
    });
    
    event.target.value = '';
}

// Image Editor Functions
let currentEditingImage = null;
let isDrawing = false;
let drawingContext = null;
let drawingEnabled = false;

function openImageEditor(imgElement) {
    currentEditingImage = imgElement;
    const modal = document.getElementById('imageEditorModal');
    const editingImage = document.getElementById('editingImage');
    const captionInput = document.getElementById('imageCaption');
    const widthSlider = document.getElementById('imgWidth');
    
    // Set current image
    editingImage.src = imgElement.src;
    editingImage.style.transform = imgElement.style.transform || 'rotate(0deg)';
    
    // Get current width or default
    const currentWidth = imgElement.width || 400;
    widthSlider.value = currentWidth;
    document.getElementById('widthValue').textContent = currentWidth + 'px';
    
    // Get caption if exists
    const wrapper = imgElement.closest('.image-wrapper');
    const existingCaption = wrapper?.querySelector('.image-caption');
    captionInput.value = existingCaption ? existingCaption.textContent : '';
    
    // Reset drawing
    const canvas = document.getElementById('drawingCanvas');
    canvas.style.display = 'none';
    drawingEnabled = false;
    document.getElementById('drawBtn').textContent = '✏️ Draw';
    document.getElementById('clearDrawBtn').style.display = 'none';
    
    modal.classList.add('active');
}

function closeImageEditor() {
    document.getElementById('imageEditorModal').classList.remove('active');
    currentEditingImage = null;
    drawingEnabled = false;
}

function updateImageSize() {
    const width = document.getElementById('imgWidth').value;
    const img = document.getElementById('editingImage');
    img.style.width = width + 'px';
    document.getElementById('widthValue').textContent = width + 'px';
    
    // Update canvas size if drawing
    if (drawingEnabled) {
        setupCanvas();
    }
}

function rotateImage(degrees) {
    const img = document.getElementById('editingImage');
    const currentRotation = parseInt(img.dataset.rotation || 0);
    const newRotation = currentRotation + degrees;
    img.dataset.rotation = newRotation;
    img.style.transform = `rotate(${newRotation}deg)`;
    
    // Update canvas if drawing
    if (drawingEnabled) {
        setupCanvas();
    }
}

function startDrawing() {
    drawingEnabled = !drawingEnabled;
    const canvas = document.getElementById('drawingCanvas');
    const btn = document.getElementById('drawBtn');
    const clearBtn = document.getElementById('clearDrawBtn');
    
    if (drawingEnabled) {
        canvas.style.display = 'block';
        btn.textContent = '✏️ Stop Drawing';
        clearBtn.style.display = 'inline-block';
        setupCanvas();
    } else {
        canvas.style.display = 'none';
        btn.textContent = '✏️ Draw';
        clearBtn.style.display = 'none';
    }
}

function setupCanvas() {
    const canvas = document.getElementById('drawingCanvas');
    const img = document.getElementById('editingImage');
    
    // Set canvas size to match image
    canvas.width = img.offsetWidth;
    canvas.height = img.offsetHeight;
    
    drawingContext = canvas.getContext('2d');
    
    // Helper function for coordinate calculation
    function getDrawingCoords(clientX, clientY) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }
    
    // Use pointer events for better pen tablet support
    canvas.onpointerdown = (e) => {
        e.preventDefault();
        canvas.setPointerCapture(e.pointerId);
        isDrawing = true;
        const coords = getDrawingCoords(e.clientX, e.clientY);
        drawingContext.beginPath();
        drawingContext.moveTo(coords.x, coords.y);
    };
    
    canvas.onpointermove = (e) => {
        if (!isDrawing) return;
        e.preventDefault();
        
        const coords = getDrawingCoords(e.clientX, e.clientY);
        const color = document.getElementById('drawColor').value;
        const size = parseInt(document.getElementById('drawSize').value);
        const pressure = e.pressure > 0 ? e.pressure : 1;
        
        drawingContext.strokeStyle = color;
        drawingContext.lineWidth = size * pressure;
        drawingContext.lineCap = 'round';
        drawingContext.lineJoin = 'round';
        
        drawingContext.lineTo(coords.x, coords.y);
        drawingContext.stroke();
    };
    
    canvas.onpointerup = (e) => {
        canvas.releasePointerCapture(e.pointerId);
        isDrawing = false;
    };
    
    canvas.onpointercancel = (e) => {
        canvas.releasePointerCapture(e.pointerId);
        isDrawing = false;
    };
    
    // Fallback mouse events
    canvas.onmousedown = startDrawingOnCanvas;
    canvas.onmousemove = drawOnCanvas;
    canvas.onmouseup = stopDrawingOnCanvas;
    canvas.onmouseout = stopDrawingOnCanvas;
    
    // Touch support
    canvas.ontouchstart = (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const coords = getDrawingCoords(touch.clientX, touch.clientY);
        isDrawing = true;
        drawingContext.beginPath();
        drawingContext.moveTo(coords.x, coords.y);
    };
    canvas.ontouchmove = (e) => {
        e.preventDefault();
        if (!isDrawing) return;
        const touch = e.touches[0];
        const coords = getDrawingCoords(touch.clientX, touch.clientY);
        const color = document.getElementById('drawColor').value;
        const size = parseInt(document.getElementById('drawSize').value);
        const pressure = touch.force || 1;
        
        drawingContext.strokeStyle = color;
        drawingContext.lineWidth = size * pressure;
        drawingContext.lineCap = 'round';
        drawingContext.lineJoin = 'round';
        
        drawingContext.lineTo(coords.x, coords.y);
        drawingContext.stroke();
    };
    canvas.ontouchend = stopDrawingOnCanvas;
}

// Helper for legacy mouse drawing coordinate calculation
function getDrawingCanvasCoords(canvas, clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}

function startDrawingOnCanvas(e) {
    isDrawing = true;
    const canvas = document.getElementById('drawingCanvas');
    const coords = getDrawingCanvasCoords(canvas, e.clientX, e.clientY);
    drawingContext.beginPath();
    drawingContext.moveTo(coords.x, coords.y);
}

function drawOnCanvas(e) {
    if (!isDrawing) return;
    
    const canvas = document.getElementById('drawingCanvas');
    const coords = getDrawingCanvasCoords(canvas, e.clientX, e.clientY);
    const color = document.getElementById('drawColor').value;
    const size = parseInt(document.getElementById('drawSize').value);
    
    drawingContext.strokeStyle = color;
    drawingContext.lineWidth = size;
    drawingContext.lineCap = 'round';
    drawingContext.lineJoin = 'round';
    
    drawingContext.lineTo(coords.x, coords.y);
    drawingContext.stroke();
}

function stopDrawingOnCanvas() {
    isDrawing = false;
}

function clearDrawing() {
    const canvas = document.getElementById('drawingCanvas');
    drawingContext.clearRect(0, 0, canvas.width, canvas.height);
}

function saveImageEdits() {
    if (!currentEditingImage) return;
    
    const editingImage = document.getElementById('editingImage');
    const captionText = document.getElementById('imageCaption').value;
    const canvas = document.getElementById('drawingCanvas');
    
    // If drawing is enabled, merge canvas with image
    if (drawingEnabled && canvas.style.display !== 'none') {
        const mergeCanvas = document.createElement('canvas');
        const mergeCtx = mergeCanvas.getContext('2d');
        
        mergeCanvas.width = editingImage.offsetWidth;
        mergeCanvas.height = editingImage.offsetHeight;
        
        // Draw image
        mergeCtx.drawImage(editingImage, 0, 0, mergeCanvas.width, mergeCanvas.height);
        
        // Draw annotations on top
        mergeCtx.drawImage(canvas, 0, 0);
        
        // Convert to data URL
        currentEditingImage.src = mergeCanvas.toDataURL('image/png');
    } else {
        currentEditingImage.src = editingImage.src;
    }
    
    // Apply size and rotation
    currentEditingImage.style.width = editingImage.style.width;
    currentEditingImage.style.transform = editingImage.style.transform;
    currentEditingImage.dataset.rotation = editingImage.dataset.rotation;
    
    // Handle caption
    const wrapper = currentEditingImage.closest('.image-wrapper');
    let captionEl = wrapper.querySelector('.image-caption');
    
    if (captionText) {
        if (!captionEl) {
            captionEl = document.createElement('span');
            captionEl.className = 'image-caption';
            wrapper.appendChild(captionEl);
        }
        captionEl.textContent = captionText;
    } else if (captionEl) {
        captionEl.remove();
    }
    
    closeImageEditor();
    showSavedIndicator();
}

function deleteEditingImage() {
    if (!currentEditingImage && confirm('Are you sure you want to delete this image?')) {
        const wrapper = currentEditingImage.closest('.image-wrapper');
        if (wrapper) {
            wrapper.remove();
        } else {
            currentEditingImage.remove();
        }
        closeImageEditor();
        showSavedIndicator();
    }
}

// Drag and Drop Functions
function attachDragHandlers(element) {
    element.addEventListener('dragstart', handleDragStart);
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('drop', handleDrop);
    element.addEventListener('dragend', handleDragEnd);
}

function enableDragAndDrop() {
    // Make all key points, examples, and warnings draggable
    const keyPoints = document.querySelectorAll('.key-point');
    const examples = document.querySelectorAll('.example-box');
    const warnings = document.querySelectorAll('.warning-box');
    
    [...keyPoints, ...examples, ...warnings].forEach(element => {
        element.classList.add('draggable');
        element.draggable = true;
        
        // Add drag handle
        if (!element.querySelector('.drag-handle')) {
            const handle = document.createElement('span');
            handle.className = 'drag-handle';
            handle.innerHTML = '⋮⋮';
            element.style.position = 'relative';
            element.appendChild(handle);
        }
        
        attachDragHandlers(element);
    });
}

let draggedElement = null;

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    
    const draggable = e.target.closest('.draggable');
    if (draggable && draggable !== draggedElement) {
        const rect = draggable.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;
        
        if (e.clientY < midpoint) {
            draggable.parentNode.insertBefore(draggedElement, draggable);
        } else {
            draggable.parentNode.insertBefore(draggedElement, draggable.nextSibling);
        }
    }
    
    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    return false;
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    
    // Save new order
    saveComponentOrder();
}

function saveComponentOrder() {
    if (!currentTopic) return;
    
    // Get new order of key points
    const keyPointsList = document.getElementById('keyPointsList');
    if (keyPointsList) {
        const keyPoints = Array.from(keyPointsList.querySelectorAll('.key-point'));
        const newOrder = keyPoints.map(kp => parseInt(kp.dataset.index));
        
        // Reorder in data structure
        for (const category of Object.values(studyTopics)) {
            const topic = category.topics.find(t => t.id === currentTopic.id);
            if (topic && topic.content.keyPoints) {
                const reordered = newOrder.map(i => topic.content.keyPoints[i]);
                topic.content.keyPoints = reordered;
                saveProgress();
                break;
            }
        }
    }
    
    showSavedIndicator();
}

function insertFileInPoint(topicId, index, event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const contentEl = document.getElementById(`kp-content-${topicId}-${index}`);
    
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const fileData = e.target.result;
            const fileName = file.name;
            const fileSize = (file.size / 1024).toFixed(2);
            
            let icon = '📄';
            if (fileName.endsWith('.pdf')) icon = '📕';
            else if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) icon = '📘';
            else if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) icon = '📊';
            else if (fileName.endsWith('.ppt') || fileName.endsWith('.pptx')) icon = '📙';
            
            const attachmentDiv = document.createElement('div');
            attachmentDiv.className = 'note-attachment';
            attachmentDiv.innerHTML = `
                <div class="attachment-card">
                    <span class="attachment-icon">${icon}</span>
                    <div class="attachment-info">
                        <div class="attachment-name">${fileName}</div>
                        <div class="attachment-size">${fileSize} KB</div>
                    </div>
                    <button class="attachment-download" onclick="downloadAttachment('${fileData}', '${fileName}')" title="Download">⬇️</button>
                    <button class="attachment-remove" onclick="this.closest('.note-attachment').remove();" title="Remove">✖️</button>
                </div>
            `;
            
            contentEl.appendChild(attachmentDiv);
            contentEl.appendChild(document.createElement('br'));
        };
        reader.readAsDataURL(file);
    });
    
    event.target.value = '';
}

function insertYouTubeInPoint(topicId, index) {
    const url = prompt('Enter YouTube URL or Video ID:');
    if (!url) return;
    
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.length === 11) {
        videoId = url;
    } else {
        alert('Invalid YouTube URL. Please enter a valid YouTube URL or video ID.');
        return;
    }
    
    const contentEl = document.getElementById(`kp-content-${topicId}-${index}`);
    
    const videoDiv = document.createElement('div');
    videoDiv.className = 'youtube-embed';
    videoDiv.innerHTML = `
        <div class="youtube-container">
            <iframe 
                width="100%" 
                height="300" 
                src="https://www.youtube.com/embed/${videoId}" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen
                style="border-radius: 8px;">
            </iframe>
            <button class="youtube-remove" onclick="this.closest('.youtube-embed').remove();" title="Remove Video">✖️ Remove</button>
        </div>
    `;
    
    contentEl.appendChild(videoDiv);
    contentEl.appendChild(document.createElement('br'));
}

// Download attachment
function downloadAttachment(dataUrl, fileName) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName;
    link.click();
}

// Save inline edits to data structure
function saveInlineEdit(element) {
    if (!currentTopic) return;
    
    const type = element.getAttribute('data-type');
    const index = parseInt(element.getAttribute('data-index'));
    const content = element.innerHTML;
    
    // Find the topic in the data structure
    let topic = null;
    let categoryKey = null;
    
    for (const [key, category] of Object.entries(studyTopics)) {
        const found = category.topics.find(t => t.id === currentTopic.id);
        if (found) {
            topic = found;
            categoryKey = key;
            break;
        }
    }
    
    if (!topic) return;
    
    // Update the appropriate section
    if (type === 'title') {
        if (topic.content.keyPoints[index]) {
            topic.content.keyPoints[index].title = content;
        }
    } else if (type === 'content') {
        if (topic.content.keyPoints[index]) {
            topic.content.keyPoints[index].content = content;
        }
    } else if (type === 'example') {
        if (topic.content.examples[index]) {
            topic.content.examples[index].content = content;
        }
    } else if (type === 'warning') {
        if (topic.content.warnings[index]) {
            topic.content.warnings[index].content = content;
        }
    }
    
    saveProgress();
}

// Add new key point
function addKeyPoint() {
    if (!currentTopic) return;
    
    // Find the topic
    for (const category of Object.values(studyTopics)) {
        const topic = category.topics.find(t => t.id === currentTopic.id);
        if (topic) {
            if (!topic.content.keyPoints) {
                topic.content.keyPoints = [];
            }
            topic.content.keyPoints.push({
                title: 'New Key Point',
                content: 'Click to edit this content...'
            });
            currentTopic = topic;
            loadTopic(topic);
            saveProgress();
            break;
        }
    }
}

// Delete key point
function deleteKeyPoint(index) {
    if (!currentTopic) return;
    if (!confirm('Are you sure you want to delete this key point?')) return;
    
    for (const category of Object.values(studyTopics)) {
        const topic = category.topics.find(t => t.id === currentTopic.id);
        if (topic && topic.content.keyPoints) {
            topic.content.keyPoints.splice(index, 1);
            currentTopic = topic;
            loadTopic(topic);
            saveProgress();
            break;
        }
    }
}

// Add new example
function addExample() {
    if (!currentTopic) return;
    
    for (const category of Object.values(studyTopics)) {
        const topic = category.topics.find(t => t.id === currentTopic.id);
        if (topic) {
            if (!topic.content.examples) {
                topic.content.examples = [];
            }
            topic.content.examples.push({
                title: 'New Example',
                content: 'Click to edit this example...'
            });
            currentTopic = topic;
            loadTopic(topic);
            saveProgress();
            break;
        }
    }
}

// Delete example
function deleteExample(index) {
    if (!currentTopic) return;
    if (!confirm('Are you sure you want to delete this example?')) return;
    
    for (const category of Object.values(studyTopics)) {
        const topic = category.topics.find(t => t.id === currentTopic.id);
        if (topic && topic.content.examples) {
            topic.content.examples.splice(index, 1);
            currentTopic = topic;
            loadTopic(topic);
            saveProgress();
            break;
        }
    }
}

// Add new warning
function addWarning() {
    if (!currentTopic) return;
    
    for (const category of Object.values(studyTopics)) {
        const topic = category.topics.find(t => t.id === currentTopic.id);
        if (topic) {
            if (!topic.content.warnings) {
                topic.content.warnings = [];
            }
            topic.content.warnings.push({
                title: 'New Important Note',
                content: 'Click to edit this note...'
            });
            currentTopic = topic;
            loadTopic(topic);
            saveProgress();
            break;
        }
    }
}

// Delete warning
function deleteWarning(index) {
    if (!currentTopic) return;
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    for (const category of Object.values(studyTopics)) {
        const topic = category.topics.find(t => t.id === currentTopic.id);
        if (topic && topic.content.warnings) {
            topic.content.warnings.splice(index, 1);
            currentTopic = topic;
            loadTopic(topic);
            saveProgress();
            break;
        }
    }
}

// Mark topic as complete
function markComplete() {
    if (!currentTopic) return;
    
    if (completedTopics.has(currentTopic.id)) {
        completedTopics.delete(currentTopic.id);
    } else {
        completedTopics.add(currentTopic.id);
    }
    
    saveProgress();
    renderTopicsList();
    updateProgress();
    loadTopic(currentTopic);
}

// Update progress bar
function updateProgress() {
    const totalTopics = Object.values(studyTopics).reduce((sum, cat) => sum + cat.topics.length, 0);
    const completed = completedTopics.size;
    const percentage = totalTopics > 0 ? (completed / totalTopics) * 100 : 0;
    
    document.getElementById('progressFill').style.width = `${percentage}%`;
}

// Create LinkedIn Post
function createLinkedInPost() {
    if (!currentTopic) return;
    
    let postContent = `🚀 Learning about ${currentTopic.name}\n\n`;
    
    if (currentTopic.description) {
        postContent += `${currentTopic.description}\n\n`;
    }
    
    if (currentTopic.content?.keyPoints && currentTopic.content.keyPoints.length > 0) {
        postContent += `🎯 Key Insights:\n\n`;
        currentTopic.content.keyPoints.forEach((point, index) => {
            const titleText = point.title.replace(/<[^>]*>/g, '');
            const contentText = point.content.replace(/<[^>]*>/g, '').substring(0, 100);
            postContent += `${index + 1}. ${titleText}\n${contentText}...\n\n`;
        });
    }
    
    postContent += `\n#GenAI #AI #MachineLearning #TechLearning #ProfessionalDevelopment`;
    
    if (currentTopic.difficulty) {
        postContent += ` #${currentTopic.difficulty}Level`;
    }
    
    document.getElementById('linkedinContent').value = postContent;
    document.getElementById('linkedinPreview').textContent = postContent;
    document.getElementById('linkedinModal').classList.add('active');
}

// Update LinkedIn preview
document.addEventListener('DOMContentLoaded', () => {
    const linkedinContent = document.getElementById('linkedinContent');
    if (linkedinContent) {
        linkedinContent.addEventListener('input', (e) => {
            document.getElementById('linkedinPreview').textContent = e.target.value;
        });
    }
});

// Copy LinkedIn post to clipboard
function copyLinkedInPost() {
    const content = document.getElementById('linkedinContent').value;
    navigator.clipboard.writeText(content).then(() => {
        alert('✓ Post copied to clipboard! You can now paste it on LinkedIn.');
        closeLinkedInModal();
    }).catch(err => {
        alert('Failed to copy. Please try manually selecting and copying the text.');
    });
}

// Close LinkedIn modal
function closeLinkedInModal() {
    document.getElementById('linkedinModal').classList.remove('active');
}

// Search functionality
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const topicItems = document.querySelectorAll('.topic-item');
    
    topicItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// Show saved indicator
function showSavedIndicator() {
    const indicator = document.getElementById('savedIndicator');
    indicator.classList.add('show');
    setTimeout(() => indicator.classList.remove('show'), 2000);
}

// Category Management Functions
function showAddCategoryModal() {
    editingCategory = null;
    document.getElementById('categoryModalTitle').textContent = 'Add New Category';
    document.getElementById('categoryName').value = '';
    document.getElementById('categoryIcon').value = '';
    document.getElementById('categoryModal').classList.add('active');
}

function showEditCategoryModal(categoryKey) {
    const category = studyTopics[categoryKey];
    editingCategory = categoryKey;
    document.getElementById('categoryModalTitle').textContent = 'Edit Category';
    document.getElementById('categoryName').value = category.name;
    document.getElementById('categoryIcon').value = category.icon;
    document.getElementById('categoryModal').classList.add('active');
}

function closeCategoryModal() {
    document.getElementById('categoryModal').classList.remove('active');
    editingCategory = null;
}

function saveCategoryForm(e) {
    e.preventDefault();
    const name = document.getElementById('categoryName').value;
    const icon = document.getElementById('categoryIcon').value || '📁';

    if (editingCategory) {
        studyTopics[editingCategory].name = name;
        studyTopics[editingCategory].icon = icon;
    } else {
        const categoryKey = name.toLowerCase().replace(/\s+/g, '-');
        studyTopics[categoryKey] = {
            name: name,
            icon: icon,
            topics: []
        };
    }

    saveProgress();
    renderTopicsList();
    closeCategoryModal();
}

function deleteCategory(categoryKey) {
    const category = studyTopics[categoryKey];
    if (confirm(`Are you sure you want to delete "${category.name}" and all its topics?`)) {
        delete studyTopics[categoryKey];
        saveProgress();
        renderTopicsList();
        
        if (currentTopic) {
            document.getElementById('contentArea').innerHTML = `
                <div class="content-header">
                    <div class="content-title">
                        <h2>🎯 Welcome to Advanced Study Guide</h2>
                        <p style="color: var(--text-muted); margin-top: 10px;">Select a topic to begin studying</p>
                    </div>
                </div>
            `;
            currentTopic = null;
        }
    }
}

// Topic Management Functions
function showAddTopicModal(categoryKey) {
    editingTopic = null;
    document.getElementById('topicModalTitle').textContent = 'Add New Topic';
    document.getElementById('topicCategory').value = categoryKey;
    document.getElementById('topicId').value = '';
    document.getElementById('topicName').value = '';
    document.getElementById('topicDescription').value = '';
    document.getElementById('topicTime').value = '';
    document.getElementById('topicDifficulty').value = 'Beginner';
    document.getElementById('topicModal').classList.add('active');
}

function showEditTopicModal(categoryKey, topicId) {
    const category = studyTopics[categoryKey];
    const topic = category.topics.find(t => t.id === topicId);
    
    editingTopic = { categoryKey, topicId };
    document.getElementById('topicModalTitle').textContent = 'Edit Topic';
    document.getElementById('topicCategory').value = categoryKey;
    document.getElementById('topicId').value = topicId;
    document.getElementById('topicName').value = topic.name;
    document.getElementById('topicDescription').value = topic.description || '';
    document.getElementById('topicTime').value = topic.time || '';
    document.getElementById('topicDifficulty').value = topic.difficulty || 'Beginner';
    document.getElementById('topicModal').classList.add('active');
}

function closeTopicModal() {
    document.getElementById('topicModal').classList.remove('active');
    editingTopic = null;
}

function saveTopicForm(e) {
    e.preventDefault();
    const categoryKey = document.getElementById('topicCategory').value;
    const name = document.getElementById('topicName').value;
    const description = document.getElementById('topicDescription').value;
    const time = document.getElementById('topicTime').value;
    const difficulty = document.getElementById('topicDifficulty').value;

    if (editingTopic) {
        const topic = studyTopics[categoryKey].topics.find(t => t.id === editingTopic.topicId);
        topic.name = name;
        topic.description = description;
        topic.time = time;
        topic.difficulty = difficulty;
    } else {
        const topicId = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
        const newTopic = {
            id: topicId,
            name: name,
            description: description,
            time: time,
            difficulty: difficulty,
            content: {
                keyPoints: [{ title: "New Key Point", content: "Add your content here..." }],
                examples: [{ title: "Example", content: "Add an example here..." }],
                warnings: [{ title: "Important Note", content: "Add important notes here..." }]
            }
        };
        
        // Ensure the category exists and has a topics array
        if (!studyTopics[categoryKey]) {
            studyTopics[categoryKey] = {
                name: categoryKey,
                icon: '📁',
                topics: []
            };
        }
        if (!studyTopics[categoryKey].topics) {
            studyTopics[categoryKey].topics = [];
        }
        
        studyTopics[categoryKey].topics.push(newTopic);
        console.log('New topic added:', newTopic);
        console.log('Category now has topics:', studyTopics[categoryKey].topics.length);
    }

    saveProgress();
    renderTopicsList();
    updateProgress();
    closeTopicModal();
    
    // Show confirmation
    showSavedIndicator();
}

function deleteTopic(categoryKey, topicId) {
    const category = studyTopics[categoryKey];
    const topic = category.topics.find(t => t.id === topicId);
    
    if (confirm(`Are you sure you want to delete "${topic.name}"?`)) {
        category.topics = category.topics.filter(t => t.id !== topicId);
        completedTopics.delete(topicId);
        
        saveProgress();
        renderTopicsList();
        
        if (currentTopic && currentTopic.id === topicId) {
            document.getElementById('contentArea').innerHTML = `
                <div class="content-header">
                    <div class="content-title">
                        <h2>🎯 Welcome to Advanced Study Guide</h2>
                        <p style="color: var(--text-muted); margin-top: 10px;">Select a topic to begin studying</p>
                    </div>
                </div>
            `;
            currentTopic = null;
        }
    }
}

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}


// ============================================
// HANDWRITTEN NOTES FUNCTIONALITY
// ============================================

// Render Handwritten Notes
function renderHandwrittenNotes(notes, topicId) {
    if (!notes || notes.length === 0) {
        return '<p style="color: var(--text-muted);">No handwritten notes yet. Click "New Note Pad" to start writing!</p>';
    }
    
    return notes.map((note, index) => `
        <div class="handwritten-note" id="hw-${topicId}-${index}" data-index="${index}">
            <div class="handwritten-note-header">
                <span class="handwritten-note-title">${note.title || 'Handwritten Note #' + (index + 1)}</span>
                <div class="handwritten-note-actions">
                    <button class="edit-btn" onclick="editHandwrittenNote('${topicId}', ${index})">✏️ Edit</button>
                    <button class="delete-btn" onclick="deleteHandwrittenNote(${index})">🗑️ Delete</button>
                </div>
            </div>
            <div class="handwritten-note-preview">
                <img src="${note.data}" alt="Handwritten note" style="max-width: 100%; border-radius: 8px;">
            </div>
            ${note.caption ? `<div class="handwritten-note-caption">${note.caption}</div>` : ''}
        </div>
    `).join('');
}

// Add new handwritten note
function addHandwrittenNote() {
    if (!currentTopic) return;
    openHandwritingPad();
}

// Edit existing handwritten note  
function editHandwrittenNote(topicId, index) {
    if (!currentTopic) return;
    
    for (const category of Object.values(studyTopics)) {
        const topic = category.topics.find(t => t.id === topicId);
        if (topic && topic.content.handwrittenNotes && topic.content.handwrittenNotes[index]) {
            const note = topic.content.handwrittenNotes[index];
            openHandwritingPad(note, index);
            break;
        }
    }
}

// Delete handwritten note
function deleteHandwrittenNote(index) {
    if (!currentTopic) return;
    if (!confirm('Are you sure you want to delete this handwritten note?')) return;
    
    for (const category of Object.values(studyTopics)) {
        const topic = category.topics.find(t => t.id === currentTopic.id);
        if (topic && topic.content.handwrittenNotes) {
            topic.content.handwrittenNotes.splice(index, 1);
            currentTopic = topic;
            loadTopic(topic);
            saveProgress();
            break;
        }
    }
}

let currentHandwritingNote = null;
let currentHandwritingIndex = null;

// Open handwriting pad modal
function openHandwritingPad(existingNote = null, index = null) {
    currentHandwritingNote = existingNote;
    currentHandwritingIndex = index;
    
    const modal = document.getElementById('handwritingPadModal');
    const canvas = document.getElementById('handwritingCanvas');
    const ctx = canvas.getContext('2d');
    const titleInput = document.getElementById('handwritingTitle');
    const captionInput = document.getElementById('handwritingCaption');
    
    // Set canvas dimensions
    canvas.width = 800;
    canvas.height = 600;
    
    // Always start with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Reset eraser state
    isErasing = false;
    const eraserBtn = document.getElementById('eraserBtn');
    if (eraserBtn) {
        eraserBtn.style.background = '';
        eraserBtn.style.color = '';
    }
    
    if (existingNote && existingNote.data) {
        // Load existing note image onto canvas
        const img = new Image();
        img.onload = function() {
            // Clear canvas first with white background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            // Draw the existing image
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.onerror = function() {
            console.error('Failed to load existing note image');
            // Keep white background on error
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        };
        img.src = existingNote.data;
        titleInput.value = existingNote.title || '';
        captionInput.value = existingNote.caption || '';
    } else {
        // New note - clear inputs
        titleInput.value = '';
        captionInput.value = '';
    }
    
    modal.classList.add('active');
    initializeHandwritingCanvas();
}

function closeHandwritingPad() {
    document.getElementById('handwritingPadModal').classList.remove('active');
    currentHandwritingNote = null;
    currentHandwritingIndex = null;
    isHandwriting = false;
    
    // Reset eraser state
    isErasing = false;
    const eraserBtn = document.getElementById('eraserBtn');
    if (eraserBtn) {
        eraserBtn.style.background = '';
        eraserBtn.style.color = '';
    }
}

let isHandwriting = false;
let lastX = 0;
let lastY = 0;

// Helper function to get correct canvas coordinates accounting for CSS scaling
function getCanvasCoordinates(canvas, clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    // Calculate the scale factor between displayed size and actual canvas size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Apply scale to get accurate canvas coordinates
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    
    return { x, y };
}

function initializeHandwritingCanvas() {
    const canvas = document.getElementById('handwritingCanvas');
    
    // Remove existing listeners to prevent duplicates
    canvas.onmousedown = null;
    canvas.onmousemove = null;
    canvas.onmouseup = null;
    canvas.onmouseout = null;
    canvas.onpointerdown = null;
    canvas.onpointermove = null;
    canvas.onpointerup = null;
    canvas.onpointerout = null;
    canvas.onpointercancel = null;
    
    // Use pointer events for better pen tablet support (XP-Pen, Wacom, etc.)
    canvas.onpointerdown = (e) => {
        e.preventDefault();
        canvas.setPointerCapture(e.pointerId);
        isHandwriting = true;
        const coords = getCanvasCoordinates(canvas, e.clientX, e.clientY);
        lastX = coords.x;
        lastY = coords.y;
    };
    
    canvas.onpointermove = (e) => {
        e.preventDefault();
        if (!isHandwriting) return;
        
        const coords = getCanvasCoordinates(canvas, e.clientX, e.clientY);
        const x = coords.x;
        const y = coords.y;
        
        const ctx = canvas.getContext('2d');
        const size = parseInt(document.getElementById('penSize').value);
        // Use pressure from pen tablet if available (0-1 range)
        const pressure = e.pressure > 0 ? e.pressure : 1;
        
        if (isErasing) {
            // Eraser mode
            ctx.globalCompositeOperation = 'destination-out';
            ctx.strokeStyle = 'rgba(0,0,0,1)';
            ctx.lineWidth = size * 3 * pressure;
        } else {
            // Drawing mode with pressure sensitivity
            ctx.globalCompositeOperation = 'source-over';
            const color = document.getElementById('penColor').value;
            ctx.strokeStyle = color;
            ctx.lineWidth = size * pressure;
        }
        
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        lastX = x;
        lastY = y;
    };
    
    canvas.onpointerup = (e) => {
        e.preventDefault();
        canvas.releasePointerCapture(e.pointerId);
        isHandwriting = false;
    };
    
    canvas.onpointerout = (e) => {
        // Only stop if pointer leaves canvas completely (not for pen hover)
        if (e.pointerType === 'mouse') {
            isHandwriting = false;
        }
    };
    
    canvas.onpointercancel = (e) => {
        canvas.releasePointerCapture(e.pointerId);
        isHandwriting = false;
    };
    
    // Fallback for touch events (older devices)
    canvas.ontouchstart = (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const coords = getCanvasCoordinates(canvas, touch.clientX, touch.clientY);
        lastX = coords.x;
        lastY = coords.y;
        isHandwriting = true;
    };
    
    canvas.ontouchmove = (e) => {
        e.preventDefault();
        if (!isHandwriting) return;
        
        const touch = e.touches[0];
        const coords = getCanvasCoordinates(canvas, touch.clientX, touch.clientY);
        const x = coords.x;
        const y = coords.y;
        
        const ctx = canvas.getContext('2d');
        const size = parseInt(document.getElementById('penSize').value);
        const pressure = touch.force || 1;
        
        if (isErasing) {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.strokeStyle = 'rgba(0,0,0,1)';
            ctx.lineWidth = size * 3 * pressure;
        } else {
            ctx.globalCompositeOperation = 'source-over';
            const color = document.getElementById('penColor').value;
            ctx.strokeStyle = color;
            ctx.lineWidth = size * pressure;
        }
        
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        lastX = x;
        lastY = y;
    };
    
    canvas.ontouchend = (e) => {
        e.preventDefault();
        isHandwriting = false;
    };
}

function startHandwriting(e) {
    isHandwriting = true;
    const canvas = e.target;
    const coords = getCanvasCoordinates(canvas, e.clientX, e.clientY);
    lastX = coords.x;
    lastY = coords.y;
}

function drawHandwriting(e) {
    if (!isHandwriting) return;
    
    const canvas = document.getElementById('handwritingCanvas');
    const ctx = canvas.getContext('2d');
    const coords = getCanvasCoordinates(canvas, e.clientX, e.clientY);
    const x = coords.x;
    const y = coords.y;
    
    const size = parseInt(document.getElementById('penSize').value);
    
    if (isErasing) {
        // Eraser mode - use destination-out composite
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.lineWidth = size * 3; // Larger eraser
    } else {
        // Drawing mode
        ctx.globalCompositeOperation = 'source-over';
        const color = document.getElementById('penColor').value;
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
    }
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    lastX = x;
    lastY = y;
}

function stopHandwriting() {
    isHandwriting = false;
}

function clearHandwritingCanvas() {
    const canvas = document.getElementById('handwritingCanvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

let isErasing = false;

function toggleEraser() {
    isErasing = !isErasing;
    const btn = document.getElementById('eraserBtn');
    if (isErasing) {
        btn.style.background = 'var(--primary)';
        btn.style.color = 'white';
    } else {
        btn.style.background = '';
        btn.style.color = '';
    }
}

function saveHandwritingNote() {
    if (!currentTopic) return;
    
    const canvas = document.getElementById('handwritingCanvas');
    const title = document.getElementById('handwritingTitle').value || 'Handwritten Note';
    const caption = document.getElementById('handwritingCaption').value;
    
    const noteData = {
        title: title,
        caption: caption,
        data: canvas.toDataURL('image/png'),
        timestamp: new Date().toISOString()
    };
    
    for (const category of Object.values(studyTopics)) {
        const topic = category.topics.find(t => t.id === currentTopic.id);
        if (topic) {
            if (!topic.content.handwrittenNotes) {
                topic.content.handwrittenNotes = [];
            }
            
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
// COPY/PASTE IMAGE FUNCTIONALITY
// ============================================

// Paste image from clipboard
async function pasteImageFromClipboard(topicId, index) {
    try {
        const clipboardItems = await navigator.clipboard.read();
        
        for (const clipboardItem of clipboardItems) {
            for (const type of clipboardItem.types) {
                if (type.startsWith('image/')) {
                    const blob = await clipboardItem.getType(type);
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        insertImageFromData(topicId, index, e.target.result);
                    };
                    
                    reader.readAsDataURL(blob);
                    return;
                }
            }
        }
        
        alert('No image found in clipboard. Please copy an image first.');
    } catch (err) {
        console.error('Failed to read clipboard:', err);
        alert('Unable to paste from clipboard. Make sure you have copied an image.');
    }
}

// Insert image from data URL
function insertImageFromData(topicId, index, dataUrl) {
    const contentEl = document.getElementById(`kp-content-${topicId}-${index}`);
    if (!contentEl) return;
    
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'image-wrapper';
    imgWrapper.draggable = true;
    imgWrapper.contentEditable = 'false';
    
    const img = document.createElement('img');
    img.src = dataUrl;
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.borderRadius = '8px';
    img.style.display = 'block';
    img.dataset.rotation = '0';
    
    img.onclick = function(e) {
        e.stopPropagation();
        openImageEditor(this);
    };
    
    imgWrapper.appendChild(img);
    
    // Insert at cursor position
    const selection = window.getSelection();
    if (selection.rangeCount > 0 && contentEl.contains(selection.anchorNode)) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(imgWrapper);
        
        const br = document.createElement('br');
        imgWrapper.parentNode.insertBefore(br, imgWrapper.nextSibling);
        
        range.setStartAfter(br);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    } else {
        contentEl.appendChild(imgWrapper);
        contentEl.appendChild(document.createElement('br'));
    }
    
    attachDragHandlers(imgWrapper);
    showSavedIndicator();
}

// Enable automatic paste detection in content editors
function enableAutoPasteDetection() {
    document.addEventListener('paste', async function(e) {
        const target = e.target;
        
        // Check if pasting in a key-point-content div
        if (target.classList.contains('key-point-content') && target.contentEditable === 'true') {
            const items = e.clipboardData.items;
            
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    e.preventDefault();
                    
                    const blob = items[i].getAsFile();
                    const reader = new FileReader();
                    
                    reader.onload = function(event) {
                        // Get topicId and index from the content element
                        const contentId = target.id;
                        const match = contentId.match(/kp-content-(.+)-(\d+)/);
                        
                        if (match) {
                            const topicId = match[1];
                            const index = parseInt(match[2]);
                            insertImageFromData(topicId, index, event.target.result);
                        }
                    };
                    
                    reader.readAsDataURL(blob);
                    break;
                }
            }
        }
    });
}

// Initialize auto-paste detection
enableAutoPasteDetection();

// Copy image to clipboard
function copyImageToClipboard(imgElement) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = imgElement.naturalWidth || imgElement.width;
    canvas.height = imgElement.naturalHeight || imgElement.height;
    
    ctx.drawImage(imgElement, 0, 0);
    
    canvas.toBlob(async function(blob) {
        try {
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]);
            
            // Show temporary notification
            const notification = document.createElement('div');
            notification.style.cssText = 'position:fixed;bottom:80px;right:30px;background:#4caf50;color:white;padding:15px 25px;border-radius:8px;z-index:9999;font-weight:600;';
            notification.textContent = '📋 Image copied to clipboard!';
            document.body.appendChild(notification);
            
            setTimeout(() => notification.remove(), 2000);
        } catch (err) {
            console.error('Failed to copy image:', err);
            alert('Unable to copy image to clipboard.');
        }
    });
}

// Add copy option to images
document.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'IMG' && e.target.closest('.key-point-content, .handwritten-note-preview')) {
        e.preventDefault();
        
        const menu = document.createElement('div');
        menu.style.cssText = `
            position: fixed;
            left: ${e.pageX}px;
            top: ${e.pageY}px;
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 10px;
            z-index: 9999;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;
        
        menu.innerHTML = `
            <button style="display:block;width:100%;padding:10px;background:transparent;border:none;color:var(--text-light);cursor:pointer;text-align:left;border-radius:4px;" onmouseover="this.style.background='var(--bg-dark)'" onmouseout="this.style.background='transparent'">
                📋 Copy Image
            </button>
            <button style="display:block;width:100%;padding:10px;background:transparent;border:none;color:var(--text-light);cursor:pointer;text-align:left;border-radius:4px;" onmouseover="this.style.background='var(--bg-dark)'" onmouseout="this.style.background='transparent'">
                ✏️ Edit Image
            </button>
        `;
        
        const buttons = menu.querySelectorAll('button');
        buttons[0].onclick = () => {
            copyImageToClipboard(e.target);
            menu.remove();
        };
        buttons[1].onclick = () => {
            openImageEditor(e.target);
            menu.remove();
        };
        
        document.body.appendChild(menu);
        
        setTimeout(() => {
            document.addEventListener('click', function removeMenu() {
                menu.remove();
                document.removeEventListener('click', removeMenu);
            });
        }, 100);
    }
});

// Paste image to handwriting canvas
async function pasteImageToCanvas() {
    try {
        const clipboardItems = await navigator.clipboard.read();
        
        for (const clipboardItem of clipboardItems) {
            for (const type of clipboardItem.types) {
                if (type.startsWith('image/')) {
                    const blob = await clipboardItem.getType(type);
                    const img = new Image();
                    const url = URL.createObjectURL(blob);
                    
                    img.onload = function() {
                        const canvas = document.getElementById('handwritingCanvas');
                        const ctx = canvas.getContext('2d');
                        
                        // Draw image scaled to fit canvas
                        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
                        const x = (canvas.width / 2) - (img.width / 2) * scale;
                        const y = (canvas.height / 2) - (img.height / 2) * scale;
                        
                        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                        URL.revokeObjectURL(url);
                        
                        // Show notification
                        const notification = document.createElement('div');
                        notification.style.cssText = 'position:fixed;bottom:80px;right:30px;background:#4caf50;color:white;padding:15px 25px;border-radius:8px;z-index:9999;font-weight:600;';
                        notification.textContent = '✓ Image pasted! Draw on it now.';
                        document.body.appendChild(notification);
                        setTimeout(() => notification.remove(), 2000);
                    };
                    
                    img.src = url;
                    return;
                }
            }
        }
        
        alert('No image found in clipboard. Please copy an image first (Ctrl+C on an image).');
    } catch (err) {
        console.error('Failed to paste image:', err);
        alert('Unable to paste from clipboard. Try copying an image first.');
    }
}
