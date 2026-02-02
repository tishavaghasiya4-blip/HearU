class HearuMoodTracker extends HTMLElement {
    constructor() {
        super();
        this.currentMood = null;
        this.moods = [
            { emoji: '😢', label: 'Sad', color: '#93c5fd', value: 1 },
            { emoji: '😰', label: 'Anxious', color: '#c4b5fd', value: 2 },
            { emoji: '😐', label: 'Neutral', color: '#d1d5db', value: 3 },
            { emoji: '🙂', label: 'Good', color: '#86efac', value: 4 },
            { emoji: '🤩', label: 'Great', color: '#fde047', value: 5 }
        ];
    }

    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.render();
        this.attachEvents();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 1.5rem;
                    padding: 1.5rem;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                    border: 1px solid rgba(20, 184, 166, 0.1);
                }
                h3 {
                    margin: 0 0 1rem 0;
                    color: #1f2937;
                    font-size: 1.25rem;
                    font-weight: 600;
                }
                .mood-grid {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }
                .mood-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    cursor: pointer;
                    padding: 0.75rem;
                    border-radius: 1rem;
                    transition: all 0.3s;