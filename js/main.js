class DutyCalendar {
    constructor() {
        this.init();
    }

    init() {
        this.updateCurrentDate();
        this.renderCalendar();
        this.updateTodayHighlight();
        this.bindEvents();
        setInterval(() => this.updateTodayHighlight(), 60000);
    }

    updateCurrentDate() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        document.getElementById('currentDate').textContent = 
            now.toLocaleDateString('ru-RU', options);
    }

    renderCalendar() {
        const grid = document.getElementById('calendarGrid');
        grid.innerHTML = '';

        dutySchedule.forEach((duty, index) => {
            const dayElement = this.createDayCard(duty, index);
            grid.appendChild(dayElement);
        });
    }

    createDayCard(duty, index) {
    const dayCard = document.createElement('div');
    dayCard.className = 'day-card';
    dayCard.style.animationDelay = `${index * 0.1}s`;
    dayCard.setAttribute('data-date', duty.date);
    
    dayCard.innerHTML = `
        <div class="day-header">
            <div class="day-number">${this.formatDayNumber(duty.date)}</div>
            <div class="day-name">${duty.dayName}</div>
        </div>
        
        <div class="info-field" data-copy="${duty.person}">
            <div class="field-label">ФИО</div>
            <div class="field-value">${this.escapeHtml(duty.person)}</div>
            <svg class="copy-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
        </div>
        
        <div class="info-field" data-copy="${duty.phone}">
            <div class="field-label">Телефон</div>
            <div class="field-value">${this.escapeHtml(duty.phone)}</div>
            <svg class="copy-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
        </div>
        
        <div class="info-field" data-copy="${duty.teams}">
            <div class="field-label">Teams</div>
            <div class="field-value">${this.escapeHtml(duty.teams)}</div>
            <svg class="copy-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
        </div>
        
        <div class="info-field" data-copy="${duty.email}">
            <div class="field-label">Почта</div>
            <div class="field-value">${this.escapeHtml(duty.email)}</div>
            <svg class="copy-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
        </div>
        
        <div class="info-field" data-copy="${duty.rm}">
            <div class="field-label">Номер РМ</div>
            <div class="field-value">${this.escapeHtml(duty.rm)}</div>
            <svg class="copy-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
        </div>
        
        <div class="time-range">
            <div class="field-label">Время работы</div>
            <div class="field-value">${this.escapeHtml(duty.time)}</div>
        </div>
    `;

    return dayCard;
}


    formatDayNumber(dateStr) {
        return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric' });
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    updateTodayHighlight() {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        
        document.querySelectorAll('.day-card').forEach(card => {
            card.classList.remove('today');
        });

        const todayCard = document.querySelector(`[data-date="${todayStr}"]`);
        if (todayCard) {
            todayCard.classList.add('today');
        }
    }

    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.info-field[data-copy]')) {
                const field = e.target.closest('.info-field[data-copy]');
                this.copyToClipboard(field.dataset.copy, field);
            }
        });
    }

    copyToClipboard(text, element) {
        navigator.clipboard.writeText(text).then(() => {
            element.classList.add('copied');
            const originalText = element.querySelector('.field-value').textContent;
            element.querySelector('.field-value').textContent = '✓ Скопировано!';
            
            setTimeout(() => {
                element.classList.remove('copied');
                element.querySelector('.field-value').textContent = originalText;
            }, 1500);
        }).catch(() => {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DutyCalendar();
});
