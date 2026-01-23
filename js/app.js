// TEBI 1105 - Módulo 1A JavaScript

// ==========================================
// CONFIGURACIÓN
// ==========================================
const CONFIG = {
    GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxH8dRWkxuHBkyZJXAU7fd-Wh9NgRTXceZYpJl083lbdPNWlZ6HzsfNTfavm0HRYbVwjw/exec',
    MODULE_ID: 'TEBI1105_M1A',
    TOTAL_STEPS: 12,
    STEP_NAMES: [
        'Introducción',
        'DOT vs O*NET',
        'Categorías BMET',
        'Video BMET',
        'Características',
        'Ing. Biomédica vs Clínica',
        'Video Carrera',
        'Presentación',
        'Conceptos',
        'Equipos',
        'Inspección',
        'Autoevaluación'
    ],
    // Tiempos por paso en segundos
    STEP_TIMES: {
        1: 180,   // 3 min
        2: 300,   // 5 min (DOT vs O*NET)
        3: 180,   // 3 min
        4: 420,   // 7 min
        5: 60,    // 1 min
        6: 60,    // 1 min
        7: 300,   // 5 min
        8: 600,   // 10 min
        9: 120,   // 2 min
        10: 120,  // 2 min
        11: 120,  // 2 min
        12: 600   // 10 min
    }
};

// ==========================================
// ESTADO DE LA APLICACIÓN
// ==========================================
let state = {
    currentStep: 1,
    completedSteps: new Set(),
    completedTimes: new Set(),  // Pasos donde ya se completó el tiempo
    quizAnswers: {},
    isOnlineMode: false,
    currentStudentName: '',
    timerInterval: null,
    remainingTime: 0,
    timerCompleted: false  // Si el timer del paso actual ya terminó
};

// ==========================================
// FUNCIONES DEL TEMPORIZADOR
// ==========================================
function startTimer(step) {
    clearInterval(state.timerInterval);

    // Si ya completó el tiempo de este paso, no iniciar timer
    if (state.completedTimes.has(step)) {
        state.timerCompleted = true;
        state.remainingTime = 0;
        updateTimerDisplay();
        updateNavigationButtons();
        showTimerCompleteMessage();
        return;
    }

    state.timerCompleted = false;
    state.remainingTime = CONFIG.STEP_TIMES[step];
    updateTimerDisplay();
    updateNavigationButtons();

    state.timerInterval = setInterval(function() {
        state.remainingTime--;
        updateTimerDisplay();

        if (state.remainingTime <= 0) {
            clearInterval(state.timerInterval);
            onTimerComplete();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(state.remainingTime / 60);
    const seconds = state.remainingTime % 60;
    const display = document.getElementById('timer-display');

    if (state.timerCompleted || state.completedTimes.has(state.currentStep)) {
        display.textContent = '✓ Completado';
        display.classList.remove('timer-warning', 'timer-danger');
        display.classList.add('timer-complete');
    } else {
        display.textContent = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');

        // Cambiar color según tiempo restante
        display.classList.remove('timer-warning', 'timer-danger', 'timer-complete');
        if (state.remainingTime <= 30) {
            display.classList.add('timer-danger');
        } else if (state.remainingTime <= 60) {
            display.classList.add('timer-warning');
        }
    }
}

function showTimerCompleteMessage() {
    const container = document.getElementById('timer-container');
    container.classList.add('timer-done');
}

function hideTimerCompleteMessage() {
    const container = document.getElementById('timer-container');
    container.classList.remove('timer-done');
}

function onTimerComplete() {
    state.timerCompleted = true;
    state.completedTimes.add(state.currentStep);
    state.completedSteps.add(state.currentStep);

    updateTimerDisplay();
    updateNavigationButtons();
    updateProgress();
    saveProgress();
    showTimerCompleteMessage();

    // Mostrar notificación
    showNotification('¡Tiempo completado! Puedes continuar al siguiente paso.');
}

function showNotification(message) {
    // Crear notificación temporal
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce';
    notification.innerHTML = '<i class="fas fa-check-circle mr-2"></i>' + message;
    document.body.appendChild(notification);

    setTimeout(function() {
        notification.remove();
    }, 3000);
}

// ==========================================
// FUNCIONES DE AUTENTICACIÓN
// ==========================================
async function verifyStudentOnline(studentId) {
    try {
        const response = await fetch(CONFIG.GOOGLE_SCRIPT_URL + '?action=verify&studentId=' + encodeURIComponent(studentId));
        const result = await response.json();

        if (result.success) {
            state.isOnlineMode = true;
            state.currentStudentName = result.name || studentId;
            localStorage.setItem('tebi1105_studentId', studentId);

            document.getElementById('login-modal').classList.add('modal-hidden');
            document.getElementById('user-info').classList.remove('hidden');
            document.getElementById('user-name').textContent = state.currentStudentName;

            await loadProgressOnline(studentId);
            startTimer(state.currentStep);
        } else {
            alert('Estudiante no encontrado en el sistema. Verifica tu ID.');
            localStorage.removeItem('tebi1105_studentId');
        }
    } catch (error) {
        console.log('Modo offline:', error);
        state.isOnlineMode = false;

        document.getElementById('login-modal').classList.add('modal-hidden');
        document.getElementById('user-info').classList.remove('hidden');
        document.getElementById('user-name').textContent = studentId + ' (offline)';

        loadProgress(studentId);
        startTimer(state.currentStep);
    }
}

// ==========================================
// FUNCIONES DE PROGRESO
// ==========================================
async function loadProgressOnline(studentId) {
    try {
        const response = await fetch(CONFIG.GOOGLE_SCRIPT_URL + '?action=getProgress&studentId=' + encodeURIComponent(studentId) + '&moduleId=' + CONFIG.MODULE_ID);
        const result = await response.json();

        if (result.success && result.progress) {
            state.completedSteps = new Set(result.progress.completedSteps || []);
            state.completedTimes = new Set(result.progress.completedTimes || []);
            state.currentStep = result.progress.currentStep || 1;
        } else {
            loadProgress(studentId);
        }
    } catch (error) {
        loadProgress(studentId);
    }

    goToStep(state.currentStep);
    updateProgress();
}

function loadProgress(studentId) {
    const saved = localStorage.getItem('tebi1105_m1a_' + studentId);

    if (saved) {
        const data = JSON.parse(saved);
        state.completedSteps = new Set(data.completedSteps || []);
        state.completedTimes = new Set(data.completedTimes || []);
        state.currentStep = data.currentStep || 1;
        state.quizAnswers = data.quizAnswers || {};
    }

    goToStep(state.currentStep);
    updateProgress();
}

function saveProgress() {
    const studentId = localStorage.getItem('tebi1105_studentId');

    if (studentId) {
        localStorage.setItem('tebi1105_m1a_' + studentId, JSON.stringify({
            completedSteps: Array.from(state.completedSteps),
            completedTimes: Array.from(state.completedTimes),
            currentStep: state.currentStep,
            quizAnswers: state.quizAnswers
        }));
        saveProgressOnline();
    }
}

async function saveProgressOnline() {
    if (!state.isOnlineMode) return;

    const studentId = localStorage.getItem('tebi1105_studentId');
    if (!studentId) return;

    try {
        await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'saveProgress',
                studentId: studentId,
                moduleId: CONFIG.MODULE_ID,
                currentStep: state.currentStep,
                completedSteps: Array.from(state.completedSteps),
                completedTimes: Array.from(state.completedTimes),
                timestamp: new Date().toISOString()
            })
        });
    } catch (error) {
        console.log('Error guardando online:', error);
    }
}

function updateProgress() {
    const progress = Math.round((state.completedSteps.size / CONFIG.TOTAL_STEPS) * 100);
    document.getElementById('progress-bar').style.width = progress + '%';
    document.getElementById('progress-text').textContent = progress + '%';
}

// ==========================================
// FUNCIONES DE NAVEGACIÓN
// ==========================================
function initStepper() {
    const stepper = document.getElementById('stepper');

    stepper.innerHTML = CONFIG.STEP_NAMES.map((name, i) =>
        '<div class="stepper-item flex items-center ' + (i === 0 ? 'active' : '') + '" data-step="' + (i + 1) + '">' +
        '<div class="stepper-circle w-7 h-7 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-medium text-gray-500 bg-white">' + (i + 1) + '</div>' +
        '<span class="ml-2 text-xs text-gray-600 hidden lg:block">' + name + '</span></div>'
    ).join('');
}

function goToStep(step) {
    if (step < 1 || step > CONFIG.TOTAL_STEPS) return;

    document.querySelectorAll('.step-content').forEach(function(c) {
        c.classList.remove('active');
    });

    const content = document.querySelector('.step-content[data-step="' + step + '"]');
    if (content) content.classList.add('active');

    state.currentStep = step;
    state.timerCompleted = state.completedTimes.has(step);

    updateStepper();
    updateNavigationButtons();
    document.getElementById('step-indicator').textContent = 'Paso ' + step + ' de ' + CONFIG.TOTAL_STEPS;
    saveProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Iniciar temporizador para el nuevo paso
    hideTimerCompleteMessage();
    startTimer(step);
}

function canAdvance() {
    // Puede avanzar si el tiempo del paso actual ya fue completado
    return state.timerCompleted || state.completedTimes.has(state.currentStep);
}

function navigateStep(dir) {
    // Si intenta avanzar pero no puede
    if (dir > 0 && !canAdvance()) {
        showNotification('Debes esperar a que termine el tiempo para continuar.');
        return;
    }

    if (dir > 0) {
        state.completedSteps.add(state.currentStep);
    }
    goToStep(state.currentStep + dir);
    updateProgress();
}

function updateStepper() {
    document.querySelectorAll('.stepper-item').forEach(function(item) {
        const step = parseInt(item.dataset.step);
        item.classList.remove('active', 'completed', 'time-completed');

        if (step === state.currentStep) {
            item.classList.add('active');
        } else if (state.completedSteps.has(step)) {
            item.classList.add('completed');
            item.querySelector('.stepper-circle').innerHTML = '<i class="fas fa-check text-white text-xs"></i>';
        }

        // Marcar si el tiempo fue completado
        if (state.completedTimes.has(step)) {
            item.classList.add('time-completed');
        }
    });
}

function updateNavigationButtons() {
    document.getElementById('prev-btn').disabled = state.currentStep === 1;

    const nextBtn = document.getElementById('next-btn');
    const canProceed = canAdvance();

    // Actualizar estado del botón
    nextBtn.disabled = !canProceed;

    if (state.currentStep === CONFIG.TOTAL_STEPS) {
        nextBtn.innerHTML = canProceed
            ? 'Finalizar <i class="fas fa-flag-checkered ml-2"></i>'
            : '<i class="fas fa-lock mr-2"></i>Finalizar';
    } else {
        nextBtn.innerHTML = canProceed
            ? 'Siguiente <i class="fas fa-arrow-right ml-2"></i>'
            : '<i class="fas fa-clock mr-2"></i>Espera el tiempo';
    }

    // Cambiar estilo visual
    if (canProceed) {
        nextBtn.classList.remove('bg-gray-400', 'cursor-not-allowed');
        nextBtn.classList.add('bg-emerald-600', 'hover:bg-emerald-700');
    } else {
        nextBtn.classList.remove('bg-emerald-600', 'hover:bg-emerald-700');
        nextBtn.classList.add('bg-gray-400', 'cursor-not-allowed');
    }
}

// ==========================================
// FUNCIONES DEL QUIZ
// ==========================================
function handleQuizAnswer(e) {
    const option = e.target;
    if (!option.classList.contains('quiz-option')) return;

    const question = option.closest('.quiz-question');
    const qNum = question.dataset.question;

    if (state.quizAnswers[qNum]) return;

    const isCorrect = option.dataset.correct === 'true';
    option.classList.add(isCorrect ? 'correct' : 'incorrect');

    if (!isCorrect) {
        question.querySelectorAll('.quiz-option').forEach(function(opt) {
            if (opt.dataset.correct === 'true') opt.classList.add('correct');
        });
    }

    const feedback = question.querySelector('.quiz-feedback');
    feedback.classList.remove('hidden');
    feedback.classList.add(isCorrect ? 'bg-green-100' : 'bg-red-100');
    feedback.innerHTML = isCorrect
        ? '<i class="fas fa-check-circle text-green-600 mr-1"></i>¡Correcto!'
        : '<i class="fas fa-times-circle text-red-600 mr-1"></i>Incorrecto';

    state.quizAnswers[qNum] = isCorrect;
    saveQuizAnswerOnline(qNum, option.textContent, isCorrect);
    saveProgress();

    const total = document.querySelectorAll('.quiz-question').length;

    if (Object.keys(state.quizAnswers).length === total) {
        const correct = Object.values(state.quizAnswers).filter(function(v) { return v; }).length;
        document.getElementById('quiz-results').classList.remove('hidden');
        document.getElementById('quiz-score').textContent = 'Obtuviste ' + correct + ' de ' + total + ' (' + Math.round(correct/total*100) + '%)';
        state.completedSteps.add(CONFIG.TOTAL_STEPS);
        updateProgress();
        saveProgress();
    }
}

async function saveQuizAnswerOnline(questionNum, answer, isCorrect) {
    if (!state.isOnlineMode) return;

    const studentId = localStorage.getItem('tebi1105_studentId');
    if (!studentId) return;

    try {
        await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'saveQuizAnswer',
                studentId: studentId,
                moduleId: CONFIG.MODULE_ID,
                questionNum: questionNum,
                answer: answer,
                isCorrect: isCorrect,
                timestamp: new Date().toISOString()
            })
        });
    } catch (error) {
        console.log('Error guardando respuesta:', error);
    }
}

// ==========================================
// EVENT LISTENERS
// ==========================================
function setupEventListeners() {
    // Login form
    document.getElementById('login-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const studentId = document.getElementById('student-id').value.trim().toUpperCase();

        if (studentId) {
            const btn = e.target.querySelector('button');
            btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Verificando...';
            btn.disabled = true;

            await verifyStudentOnline(studentId);

            btn.innerHTML = '<span>Ingresar</span> <i class="fas fa-arrow-right ml-2"></i>';
            btn.disabled = false;
        }
    });

    // Navigation buttons
    document.getElementById('prev-btn').addEventListener('click', function() {
        navigateStep(-1);
    });

    document.getElementById('next-btn').addEventListener('click', function() {
        navigateStep(1);
    });

    // Quiz options
    document.querySelectorAll('.quiz-option').forEach(function(option) {
        option.addEventListener('click', handleQuizAnswer);
    });

    // Stepper clicks - solo permite navegar a pasos con tiempo completado
    document.getElementById('stepper').addEventListener('click', function(e) {
        const item = e.target.closest('.stepper-item');

        if (item) {
            const step = parseInt(item.dataset.step);

            // Solo puede ir a pasos anteriores o pasos donde ya completó el tiempo
            if (step < state.currentStep || state.completedTimes.has(step)) {
                goToStep(step);
            } else if (step === state.currentStep) {
                // Ya está en este paso
            } else {
                showNotification('Debes completar el tiempo de los pasos anteriores primero.');
            }
        }
    });
}

// ==========================================
// INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    initStepper();
    setupEventListeners();

    const savedId = localStorage.getItem('tebi1105_studentId');
    if (savedId) {
        verifyStudentOnline(savedId);
    }
});
