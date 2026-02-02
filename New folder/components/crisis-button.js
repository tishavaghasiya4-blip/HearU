class HearuAnonymousToggle extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                }
                .toggle-container {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    padding: 0.25rem;
                    border-radius: 9999px;
                    background: rgba(255,255,255,0.5);
                    transition: all 0.3s;
                }
                .toggle-container:hover {
                    background: rgba(255,255,255,0.8);
                }
                .toggle-switch {
                    width: 44px;
                    height: 24px;
                    background: #e5e7eb;
                    border-radius: 9999px;
                    position: relative;
                    transition: all 0.3s;
                }
                .toggle-switch.active {
                    background: #14b8a6;
                }
                .toggle-knob {
                    width: 20px;
                    height: 20px;
                    background: white;
                    border-radius: 50%;
                    position: absolute;
                    top: 2px;
                    left: 2px;
                    transition: all 0.3s;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                .toggle-switch.active .toggle-knob {
                    left: 22px;
                }
                .label {
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: #6b7280;
                }
                .toggle-container.active .label {
                    color: #14b8a6;
                }
                .mask-icon {
                    width: 14px;
                    height: 14px;
                    color: #6b7280;
                }
                .toggle-container.active .mask-icon {
                    color: #14b8a6;
                }
            </style>
            
            <div class="toggle-container" onclick="this.classList.toggle('active'); this.querySelector('.toggle-switch').classList.toggle('active'); window.toggleAnonymousMode()">
                <svg class="mask-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
                <div class="toggle-switch">
                    <div class="toggle-knob"></div>
                </div>
                <span class="label">Ghost Mode</span>
            </div>
        `;
    }
}

customElements.define('hearu-anonymous-toggle', HearuAnonymousToggle);