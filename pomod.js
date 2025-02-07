const WORK_TIME = 25 * 60;
const SHORT_BREAK = 5 * 60;
const LONG_BREAK = 10 * 60;
const FULL_DASH_ARRAY = 565.48;

let timeLeft = WORK_TIME;
let timerId = null;
let currentMode = 'work';
let workSessionsCompleted = 0;

function startTimer() {
    if (timerId === null) {
        timerId = setInterval(() => {
            timeLeft--;
            updateTimer();
            
            if (timeLeft === 0) {
                clearInterval(timerId);
                timerId = null;
                playSound();
                switchMode();
            }
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    currentMode = 'work';
    workSessionsCompleted = 0;
    timeLeft = WORK_TIME;
    updateTimer();
    updateLabel('FOCUS');
}

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.querySelector('.timer-text').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const totalTime = getCurrentModeTime();
    const progress = timeLeft / totalTime;
    const offset = FULL_DASH_ARRAY * (1 - progress);
    document.querySelector('.timer-progress').style.strokeDashoffset = offset;
}

function switchMode() {
    if (currentMode === 'work') {
        workSessionsCompleted++;
        if (workSessionsCompleted % 2 === 0) {
            // Después de cada 2 sesiones de trabajo, descanso largo
            currentMode = 'longBreak';
            timeLeft = LONG_BREAK;
            updateLabel('LONG BREAK');
        } else {
            currentMode = 'shortBreak';
            timeLeft = SHORT_BREAK;
            updateLabel('BREAK');
        }
    } else {
        currentMode = 'work';
        timeLeft = WORK_TIME;
        updateLabel('FOCUS');
    }
    updateTimer();
}

function getCurrentModeTime() {
    switch(currentMode) {
        case 'work': return WORK_TIME;
        case 'shortBreak': return SHORT_BREAK;
        case 'longBreak': return LONG_BREAK;
        default: return WORK_TIME;
    }
}

function updateLabel(text) {
    document.querySelector('.timer-label').textContent = text;
}

function playSound() {
    const audio = document.getElementById('timerComplete');
    audio.play().catch(e => console.log('Error playing sound:', e));
}
