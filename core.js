const bellTimes = [
    {s: "08:30", e: "09:15"}, {s: "09:25", e: "10:10"},
    {s: "10:30", e: "11:15"}, {s: "11:25", e: "12:10"},
    {s: "12:20", e: "13:05"}, {s: "13:10", e: "13:55"},
    {s: "14:00", e: "14:45"}, {s: "14:50", e: "15:35"}
];

const allSchedules = {
    "5": { /* твій розклад для 5 класу */ },
    "6": { /* твій розклад для 6 класу */ },
    "7": { /* твій розклад для 7 класу */ }
};

const currentClass = localStorage.getItem('user_class') || '6';
const isEditMode = localStorage.getItem('gym_admin') === 'true';

// Функція для відтворення карток (використовується в розкладах)
function renderDayUI(dayIdx, isLive) {
    const classSchedule = allSchedules[currentClass];
    const dayNames = {1: "Понеділок", 2: "Вівторок", 3: "Середа", 4: "Четвер", 5: "П'ятниця"};
    const dayName = (classSchedule && classSchedule[dayIdx]) ? classSchedule[dayIdx].name : dayNames[dayIdx];

    let html = `<div class="day-header"><span>${dayName} (${currentClass} клас)</span></div>`;

    if (!classSchedule || !classSchedule[dayIdx]) {
        return html + `<div class="no-data">Розкладу немає...</div>`;
    }

    classSchedule[dayIdx].lessons.forEach((name, i) => {
        const hwKey = `hw_${currentClass}_${name}`;
        const hw = localStorage.getItem(hwKey) || "Не записано";
        html += `
            <div class="lesson-card">
                <div class="lesson-info">
                    <span class="lesson-name">${i+1}. ${name}</span>
                    <span class="lesson-time">${bellTimes[i]?.s || '--'} - ${bellTimes[i]?.e || '--'}</span>
                </div>
                <div class="homework-box">
                    ${isEditMode ? `<input type="text" class="homework-input" value="${hw === 'Не записано' ? '' : hw}" onchange="localStorage.setItem('${hwKey}', this.value || 'Не записано')">` : 'ДЗ: ' + hw}
                </div>
            </div>`;
    });
    return html;
}
