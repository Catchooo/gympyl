// --- МОДУЛЬ ШІ (ОКРЕМИЙ ФАЙЛ) ---

// Отримуємо ключ із пам'яті браузера
const getApiKey = () => localStorage.getItem('my_ai_key') || "";

// Формуємо URL (вже з фіксом -latest)
const getApiUrl = () => `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${getApiKey()}`;

// Малюємо вікно чату, коли натискаєш на іконку робота
function launchChat(container) {
    container.innerHTML = `
        <div class="chat-wrap" style="display: flex; flex-direction: column; height: 100%;">
            <div class="chat-messages" id="chat-flow" style="flex: 1; overflow-y: auto; padding: 10px; display: flex; flex-direction: column; gap: 10px;">
                <div class="bubble ai" style="background: white; padding: 12px; border-radius: 15px; align-self: flex-start;">
                    Привіт! Я твій ШІ-помічник. Чим допомогти?
                </div>
            </div>
            <div id="ai-status" style="display: none; color: #6c5ce7; text-align: center; font-size: 12px; padding: 5px;">ШІ думає...</div>
            <div class="chat-controls" style="padding: 15px; display: flex; gap: 10px; background: white; border-top: 1px solid #eee;">
                <input type="text" class="chat-input" id="ai-input" placeholder="Запитай про розклад..." style="flex: 1; padding: 10px; border-radius: 20px; border: 1px solid #ddd; outline: none;">
                <button onclick="askAI()" style="background: #6c5ce7; color: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer;">➤</button>
            </div>
        </div>`;
    
    // Додаємо обробку Enter
    document.getElementById('ai-input')?.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') askAI();
    });
}

// Головна функція запиту
async function askAI() {
    const inp = document.getElementById('ai-input');
    const text = inp.value.trim();
    if(!text) return;
    
    const key = getApiKey();
    if(!key) {
        appendBubble("⚠️ Помилка: Ключ не встановлено. Натисни на 🔑.", 'ai');
        return;
    }

    appendBubble(text, 'user');
    inp.value = '';
    const status = document.getElementById('ai-status');
    status.style.display = 'block';

    // Контекст для ШІ (беремо розклад із глобальної змінної schedule в index.html)
    const aiPrompt = `Ти асистент Пилиповицької гімназії. Твій розклад: ${JSON.stringify(window.schedule)}. Відповідай дуже коротко. Запит: ${text}`;

    try {
        const response = await fetch(getApiUrl(), {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ contents: [{ parts: [{ text: aiPrompt }] }] })
        });
        
        const data = await response.json();
        status.style.display = 'none';

        if (data.error) {
            appendBubble("🔌 Помилка API: " + data.error.message, 'ai');
        } else {
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Немає відповіді.";
            appendBubble(reply, 'ai');
        }
    } catch(e) {
        status.style.display = 'none';
        appendBubble("⚠️ Проблема з мережею.", 'ai');
    }
}

// Функція створення бульбашок повідомлень
function appendBubble(msg, role) {
    const flow = document.getElementById('chat-flow');
    if(!flow) return;
    const div = document.createElement('div');
    div.className = `bubble ${role}`;
    
    // Стилі для бульбашок прямо в JS, щоб не захаращувати CSS
    const isUser = role === 'user';
    div.style.background = isUser ? '#6c5ce7' : 'white';
    div.style.color = isUser ? 'white' : 'black';
    div.style.alignSelf = isUser ? 'flex-end' : 'flex-start';
    div.style.padding = '12px 16px';
    div.style.borderRadius = '18px';
    div.style.maxWidth = '85%';
    div.style.fontSize = '14px';
    div.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
    
    div.innerText = msg;
    flow.appendChild(div);
    flow.scrollTop = flow.scrollHeight;
}
