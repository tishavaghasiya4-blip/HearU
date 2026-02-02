// Firebase Configuration - Replace with your config
const firebaseConfig = {
    apiKey: "AIzaSyAOIvwchZtA-G5zxzgTrbp-Ywxzxgf-xAk",
    authDomain: "hearu-44bf9.firebaseapp.com",
    projectId: "hearu-44bf9",
    storageBucket: "hearu-44bf9.firebasestorage.app",
    messagingSenderId: "939169979514",
    appId: "1:939169979514:web:34f14c77ed014ab92b6fc3"
};

// Initialize Firebase (commented out until config is provided)
// firebase.initializeApp(firebaseConfig);
// const db = firebase.firestore();
// const auth = firebase.auth();

// Global State
let isAnonymous = false;
let currentUser = null;
let arStream = null;
let breathingActive = false;

// Utility Functions
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// Anonymous Mode Toggle
function toggleAnonymousMode() {
    isAnonymous = !isAnonymous;
    document.body.classList.toggle('anonymous-mode', isAnonymous);
    
    // Update UI elements to reflect anonymity
    const userElements = document.querySelectorAll('.user-identifiable');
    userElements.forEach(el => {
        if (isAnonymous) {
            el.classList.add('anonymous-blur');
        } else {
            el.classList.remove('anonymous-blur');
        }
    });
    
    // Show notification
    showNotification(isAnonymous ? 'Anonymous mode activated. Your identity is hidden.' : 'Anonymous mode deactivated.');
}

// AI Chat Functions
const chatResponses = {
    'anxious': "I hear that you're feeling anxious. Let's try a quick grounding exercise: Name 5 things you can see right now. Take your time. 🌿",
    'motivation': "Remember, motivation follows action, not the other way around. What's one tiny step you could take in the next 5 minutes? You've got this! 💪",
    'sleep': "Let's prepare your mind for rest. Try the 4-7-8 breathing technique in our AR meditation section. Inhale for 4, hold for 7, exhale for 8. 🌙",
    'default': "Thank you for sharing that with me. Remember, all emotions are valid. Would you like to try journaling about this feeling or explore a calming exercise?"
};

function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message) return;

    // Add user message
    addMessageToChat(message, 'user');
    input.value = '';

    // Simulate AI response
    setTimeout(() => {
        let response = chatResponses['default'];
        const lowerMsg = message.toLowerCase();
        
        for (const [key, value] of Object.entries(chatResponses)) {
            if (lowerMsg.includes(key)) {
                response = value;
                break;
            }
        }
        
        addMessageToChat(response, 'bot');
    }, 1000);
}

function quickChat(topic) {
    document.getElementById('chat-input').value = topic;
    sendMessage();
}

function addMessageToChat(text, sender) {
    const container = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = `flex items-start gap-3 message-bubble ${sender === 'user' ? 'flex-row-reverse' : ''}`;
    
    const avatar = sender === 'user' 
        ? `<div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center"><i data-feather="user" class="w-4 h-4 text-primary-600"></i></div>`
        : `<div class="w-8 h-8 rounded-full bg-secondary-100 flex items-center justify-center"><i data-feather="bot" class="w-4 h-4 text-secondary-600"></i></div>`;
    
    const bubble = `
        ${avatar}
        <div class="${sender === 'user' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700'} rounded-2xl ${sender === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'} p-3 text-sm max-w-[80%]">
            ${text}
        </div>
    `;
    
    div.innerHTML = bubble;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    feather.replace();
}

// Journal Functions
const journalPrompts = [
    "What small moment brought you peace today?",
    "If your emotions were weather, what would today's forecast be?",
    "What's one thing you're proud of from today?",
    "Describe a color that matches your current mood and why.",
    "What would you tell your past self from one year ago?"
];

function changePrompt() {
    const prompt = journalPrompts[Math.floor(Math.random() * journalPrompts.length)];
    document.getElementById('journal-prompt').textContent = `"${prompt}"`;
}

function insertTimestamp() {
    const textarea = document.getElementById('journal-entry');
    const timestamp = new Date().toLocaleTimeString();
    textarea.value += `\n[${timestamp}] `;
    textarea.focus();
}

function saveJournal() {
    const entry = document.getElementById('journal-entry').value;
    if (!entry.trim()) {
        showNotification('Please write something before saving.', 'error');
        return;
    }
    
    // Simulate save to Firebase
    const entryData = {
        content: entry,
        timestamp: new Date().toISOString(),
        anonymous: isAnonymous,
        userId: isAnonymous ? 'anonymous_' + generateId() : (currentUser?.uid || 'temp_user')
    };
    
    console.log('Saving journal:', entryData);
    showNotification('Journal entry saved securely. 🌸');
    document.getElementById('journal-entry').value = '';
}

// AR Meditation Functions
async function toggleAR() {
    const video = document.getElementById('ar-video');
    const button = document.getElementById('ar-toggle');
    const guide = document.getElementById('breathing-guide');
    
    if (!arStream) {
        try {
            arStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' },
                audio: false 
            });
            video.srcObject = arStream;
            button.innerHTML = '<i data-feather="video-off"></i> Stop Camera';
            guide.style.opacity = '1';
            startAREffects();
            showNotification('AR Meditation activated. Find a comfortable space.');
        } catch (err) {
            showNotification('Camera access denied. Using simulated environment.', 'error');
            // Fallback: Show gradient background with effects
            video.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }
    } else {
        arStream.getTracks().forEach(track => track.stop());
        arStream = null;
        video.srcObject = null;
        button.innerHTML = '<i data-feather="camera"></i> Start Camera';
        guide.style.opacity = '0';
        stopAREffects();
    }
    feather.replace();
}

let arAnimationId;
function startAREffects() {
    const canvas = document.getElementById('ar-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const particles = [];
    for (let i = 0; i < 20; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 20 + 10,
            speedY: Math.random() * 0.5 + 0.2,
            opacity: Math.random() * 0.5 + 0.2
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
            ctx.fill();
            
            p.y -= p.speedY;
            if (p.y < -50) p.y = canvas.height + 50;
        });
        
        arAnimationId = requestAnimationFrame(animate);
    }
    animate();
}

function stopAREffects() {
    if (arAnimationId) cancelAnimationFrame(arAnimationId);
    const canvas = document.getElementById('ar-canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function changeAREnvironment() {
    const scenes = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    ];
    const video = document.getElementById('ar-video');
    if (!arStream) {
        const randomScene = scenes[Math.floor(Math.random() * scenes.length)];
        video.style.background = randomScene;
    }
    showNotification('Environment changed. Breathe with the new colors.');
}

// Gamification Functions
function startBreathingGame() {
    showNotification('Starting Breathing Sync... Follow the expanding circle.');
    // In a full implementation, this would open a modal with interactive breathing game
    document.getElementById('ar-meditation').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
        if (!arStream) toggleAR();
    }, 500);
}

function startGratitudeGame() {
    showNotification('Planting gratitude seeds... Check your garden growing in the reflection section!');
    document.getElementById('reflection').scrollIntoView({ behavior: 'smooth' });
}

function startCognitiveGame() {
    const thoughts = [
        "I'm not good enough",
        "Everything is going wrong",
        "I can't handle this"
    ];
    const reframes = [
        "I'm learning and growing every day",
        "Some things are challenging, but I have overcome difficulties before",
        "I have handled tough situations before and I can do it again"
    ];
    
    const randomIdx = Math.floor(Math.random() * thoughts.length);
    const message = `Thought Reframer:\n\nNegative: "${thoughts[randomIdx]}"\n\nReframed: "${reframes[randomIdx]}"\n\nPractice catching these thoughts!`;
    alert(message);
}

// Community Functions
function postToCommunity() {
    const input = document.getElementById('community-input');
    const text = input.value.trim();
    if (!text) return;
    
    const feed = document.getElementById('community-feed');
    const post = document.createElement('div');
    post.className = 'p-4 bg-white rounded-2xl shadow-sm border border-gray-100 message-bubble';
    
    const seedId = Math.floor(Math.random() * 9999);
    post.innerHTML = `
        <p class="text-sm text-gray-700 mb-2">"${text}"</p>
        <div class="flex justify-between items-center text-xs text-gray-500">
            <span>Seed #${isAnonymous ? '****' : seedId}</span>
            <div class="flex gap-2">
                <button class="hover:text-primary-500 flex items-center gap-1" onclick="this.classList.toggle('text-red-500')">
                    <i data-feather="heart" class="w-3 h-3"></i> 0
                </button>
                <button class="hover:text-primary-500">Support</button>
            </div>
        </div>
    `;
    
    feed.insertBefore(post, feed.firstChild);
    input.value = '';
    feather.replace();
    showNotification('Your whisper has been planted in the garden. 🌱');
}

// Emotion Weather Map (Canvas Animation)
function initEmotionWeather() {
    const canvas = document.getElementById('emotionCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const clouds = [];
    const colors = ['rgba(147, 197, 253, 0.4)', 'rgba(167, 139, 250, 0.4)', 'rgba(251, 146, 60, 0.3)'];
    
    for (let i = 0; i < 5; i++) {
        clouds.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height * 0.6,
            size: Math.random() * 60 + 40,
            speed: Math.random() * 0.5 + 0.2,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'rgba(219, 234, 254, 0.3)');
        gradient.addColorStop(0.5, 'rgba(243, 232, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 228, 230, 0.3)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw clouds
        clouds.forEach(cloud => {
            ctx.beginPath();
            ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
            ctx.fillStyle = cloud.color;
            ctx.fill();
            
            cloud.x += cloud.speed;
            if (cloud.x > canvas.width + cloud.size) {
                cloud.x = -cloud.size;
                cloud.y = Math.random() * canvas.height * 0.6;
            }
        });
        
        requestAnimationFrame(animate);
    }
    animate();
}

// Gratitude Submission
function submitGratitude() {
    const inputs = document.querySelectorAll('#reflection input');
    const values = Array.from(inputs).map(i => i.value).filter(v => v);
    
    if (values.length === 0) {
        showNotification('Please share at least one gratitude.', 'error');
        return;
    }
    
    showNotification(`Beautiful! You've planted ${values.length} seeds in your gratitude garden. 🌸`);
    inputs.forEach(i => i.value = '');
    
    // Update progress bar in Mind Gym
    const progressBars = document.querySelectorAll('.bg-secondary-400');
    if (progressBars.length > 0) {
        progressBars[0].style.width = '100%';
    }
}

// Notification System
function showNotification(message, type = 'success') {
    const div = document.createElement('div');
    div.className = `fixed bottom-4 right-4 px-6 py-3 rounded-xl shadow-lg transform translate-y-0 transition-all duration-300 z-50 ${
        type === 'error' ? 'bg-red-500 text-white' : 'bg-primary-500 text-white'
    }`;
    div.textContent = message;
    document.body.appendChild(div);
    
    setTimeout(() => {
        div.style.transform = 'translateY(100px)';
        div.style.opacity = '0';
        setTimeout(() => div.remove(), 300);
    }, 3000);
}

// Passive Stress Monitoring Simulation
function updatePassiveMetrics() {
    // Simulate changing metrics
    const screenTime = document.getElementById('screen-time');
    const typingRhythm = document.getElementById('typing-rhythm');
    
    if (screenTime) {
        const hours = Math.floor(Math.random() * 2) + 3;
        const mins = Math.floor(Math.random() * 60);
        screenTime.textContent = `${hours}h ${mins}m`;
    }
    
    if (typingRhythm) {
        const rhythms = ['Regular', 'Fast', 'Paused', 'Steady'];
        typingRhythm.textContent = rhythms[Math.floor(Math.random() * rhythms.length)];
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initEmotionWeather();
    
    // Update metrics every 30 seconds
    setInterval(updatePassiveMetrics, 30000);
    
    // Simulate anonymous auth check
    setTimeout(() => {
        showNotification('Welcome to HearU. Your safe space is ready. 🌸');
    }, 1000);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Quick exit for privacy
            document.body.style.opacity = '0';
            setTimeout(() => {
                window.location.href = 'https://www.google.com';
            }, 300);
        }
    });
});