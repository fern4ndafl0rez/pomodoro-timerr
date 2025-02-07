let timeLeft = 25 * 60;
let timerId = null;
const FULL_DASH_ARRAY = 565.48;

function startTimer() {
    if (timerId === null) {
        timerId = setInterval(() => {
            timeLeft--;
            updateTimer();
            if (timeLeft === 0) {
                clearInterval(timerId);
                timerId = null;
                alert('¡Tiempo completado!');
            }
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    timeLeft = 25 * 60;
    updateTimer();
}

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.querySelector('.timer-text').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const progress = timeLeft / (25 * 60);
    const offset = FULL_DASH_ARRAY * (1 - progress);
    document.querySelector('.timer-progress').style.strokeDashoffset = offset;
}