const WORK_TIME = 25 * 60;
const SHORT_BREAK = 5 * 60;
const LONG_BREAK = 10 * 60;
const FULL_DASH_ARRAY = 565.48;

let timeLeft;
let timerId = null;
let currentMode;
let workSessionsCompleted;
let startTime;

// Inicializar o restaurar el estado
function initializeTimer() {
    const savedState = JSON.parse(localStorage.getItem('pomodoro-state'));
    
    if (savedState && savedState.isRunning) {
        // Restaurar estado guardado
        currentMode = savedState.currentMode;
        workSessionsCompleted = savedState.workSessionsCompleted;
        startTime = savedState.startTime;
        
        // Calcular tiempo restante
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        timeLeft = savedState.totalTime - elapsedSeconds;
        
        if (timeLeft <= 0) {
            handleTimerComplete();
        } else {
            updateTimer();
            startTimer();
        }
    } else {
        // Iniciar nuevo estado
        resetTimer();
    }
}

function startTimer() {
    if (timerId === null) {
        // Guardar estado inicial
        startTime = Date.now() - ((getCurrentModeTime() - timeLeft) * 1000);
        saveState(true);
        
        timerId = setInterval(() => {
            const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
            timeLeft = getCurrentModeTime() - elapsedSeconds;
            
            if (timeLeft <= 0) {
                handleTimerComplete();
            } else {
                updateTimer();
            }
        }, 1000);
    }
}

function handleTimerComplete() {
    clearInterval(timerId);
    timerId = null;
    playSound();
    switchMode();
    saveState(false);
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    currentMode = 'work';
    workSessionsCompleted = 0;
    timeLeft = WORK_TIME;
    updateTimer();
    updateLabel('FOCUS');
    localStorage.removeItem('pomodoro-state');
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
    startTime = Date.now();
    updateTimer();
    startTimer();
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

function saveState(isRunning) {
    const state = {
        isRunning,
        currentMode,
        workSessionsCompleted,
        startTime,
        totalTime: getCurrentModeTime(),
    };
    localStorage.setItem('pomodoro-state', JSON.stringify(state));
}

// Inicializar cuando se carga la página
window.addEventListener('load', initializeTimer);

// Actualizar cuando la pestaña vuelve a estar activa
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && timerId === null) {
        initializeTimer();
    }
});
