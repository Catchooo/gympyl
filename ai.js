/**
 * ai.js - Логіка AI асистента для Пилиповицької Гімназії
 */

// Функція, яку викликає головний файл при натисканні на іконку робота
function launchChat(container) {
    container.innerHTML = `
        <div id="chat-container" style="display: flex; flex-direction: column; height: 100%; max-height: 100%;">
            <div id="chat-messages" style="flex: 1; overflow-y: auto; padding: 15px; background: #ffffff; border-radius: 12px; margin-bottom: 15px; border: 1px solid #f0f0f0;">
                <div class="bot-msg" style="background: #f0edff; padding: 10px 15px; border-radius: 15px 15px 15px 0; margin-bottom: 10px; align-self: flex-start; max-width: 85%; font-size: 14px; color: #4834d4;">
                    Привіт! Я твій інтелектуальний помічник. Можу підказати розклад або допомогти з оцінками. Що тебе цікавить?
                </div>
            </div>
            
            <div style="display: flex; gap: 8px; background: #fff; padding: 5px; border-radius: 12px; border: 1px solid #ddd;">
                <input type="text" id="chat-input" placeholder="Напиши повідомлення..." 
                    style="flex: 1; border: none; padding: 10px; outline: none; font-size: 14px;">
                <button onclick="handleSendMessage()" 
                    style="background: #6c5ce7; color: white; border: none; padding: 10px 15px; border-radius: 10px; cursor: pointer; transition: 0.3s;">
                    ➤
                </button>
            </div>
        </div>
    `;

    // Додаємо можливість відправки через Enter
    document.getElementById('chat-input').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') handleSendMessage();
    });
}

// Функція обробки відправки повідомлення
function handleSendMessage() {
    const input = document.getElementById('chat-input');
    const container = document.getElementById('chat-messages');
    const text = input.value.trim();

    if (text === "") return;

    // 1. Додаємо повідомлення користувача в чат
    container.innerHTML += `
        <div style="background: #6c5ce7; color: white; padding: 10px 15px; border-radius: 15px 15px 0 15px; margin-bottom: 10px; align-self: flex-end; max-width: 85%; margin-left: auto; font-size: 14px; box-shadow: 0 4px 10px rgba(108, 92, 231, 0.2);">
            ${text}
        </div>
    `;

    input.value = "";
    container.scrollTop = container.scrollHeight;

    // 2. Імітуємо "мислення" бота
    setTimeout(() => {
        const response = generateBotResponse(text);
        container.innerHTML += `
            <div style="background: #f1f2f6; color: #2d3436; padding: 10px 15px; border-radius: 15px 15px 15px 0; margin-bottom: 10px; align-self: flex-start; max-width: 85%; font-size: 14px;">
                ${response}
            </div>
        `;
        container.scrollTop = container.scrollHeight;
    }, 800);
}

// Функція генерації відповідей (логіка бота)
function generateBotResponse(input) {
    const msg = input.toLowerCase();
    
    if (msg.includes("привіт") || msg.includes("хай")) {
        return "Вітаю! Готовий до навчання сьогодні?";
    }
    
    if (msg.includes("розклад")) {
        return "Розклад можна подивитися, натиснувши на іконку 📖 або 📅 в меню зліва.";
    }
    
    if (msg.includes("оцінк") || msg.includes("бали")) {
        return "Твої оцінки тепер надійно зберігаються у Firebase. Перевір вкладку 📊!";
    }

    if (msg.includes("хто ти")) {
        return "Я — AI асистент Пилиповицької Гімназії. Допомагаю учням не забувати про уроки та дз.";
    }

    if (msg.includes("дякую")) {
        return "Завжди радий допомогти! Успіхів у навчанні! 🎓";
    }

    return "Цікава думка! Я поки що вчуся, але обов'язково передам це розробнику.";
}
