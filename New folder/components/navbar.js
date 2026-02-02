class HearuNavbar extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 50;
                }
                nav {
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(12px);
                    border-bottom: 1px solid rgba(20, 184, 166, 0.1);
                    transition: all 0.3s ease;
                }
                .nav-link {
                    position: relative;
                    color: #4b5563;
                    text-decoration: none;
                    font-weight: 500;
                    font-size: 0.875rem;
                    padding: 0.5rem 0.75rem;
                    border-radius: 0.5rem;
                    transition: all 0.2s;
                }
                .nav-link:hover {
                    color: #14b8a6;
                    background: rgba(20, 184, 166, 0.1);
                }
                .logo {
                    font-size: 1.5rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, #14b8a6, #8b5cf6);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    text-decoration: none;
                }
                .mobile-menu {
                    display: none;
                }
                @media (max-width: 768px) {
                    .desktop-menu {
                        display: none;
                    }
                    .mobile-menu {
                        display: block;
                    }
                }
                .menu-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #4b5563;
                    padding: 0.5rem;
                }
            </style>
            
            <nav class="px-4 sm:px-6 lg:px-8 py-4">
                <div class="max-w-7xl mx-auto flex justify-between items-center">
                    <a href="#" class="logo">HearU 🌸</a>
                    
                    <div class="desktop-menu flex items-center gap-1">
                        <a href="#mood-tracker" class="nav-link">Mood</a>
                        <a href="#ai-assistant" class="nav-link">AI Assistant</a>
                        <a href="#ar-meditation" class="nav-link">AR Meditation</a>
                        <a href="#community" class="nav-link">Community</a>
                        <a href="#reflection" class="nav-link">Journal</a>
                    </div>
                    
                    <div class="flex items-center gap-3">
                        <button class="px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors shadow-md shadow-primary-200">
                            Sign In
                        </button>
                        <button class="mobile-menu menu-btn" onclick="this.closest('nav').querySelector('.mobile-nav').classList.toggle('hidden')">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <line x1="3" y1="18" x2="21" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div class="mobile-nav hidden md:hidden mt-4 pb-4 space-y-2">
                    <a href="#mood-tracker" class="block px-4 py-2 text-gray-600 hover:bg-primary-50 rounded-lg">Mood Tracker</a>
                    <a href="#ai-assistant" class="block px-4 py-2 text-gray-600 hover:bg-primary-50 rounded-lg">AI Assistant</a>
                    <a href="#ar-meditation" class="block px-4 py-2 text-gray-600 hover:bg-primary-50 rounded-lg">AR Meditation</a>
                    <a href="#community" class="block px-4 py-2 text-gray-600 hover:bg-primary-50 rounded-lg">Community</a>
                </div>
            </nav>
        `;
    }
}

customElements.define('hearu-navbar', HearuNavbar);