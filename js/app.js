// TEBI 1105 - Módulo 1A JavaScript

// ==========================================
// CONFIGURACIÓN
// ==========================================
const CONFIG = {
    GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxSq1tlrVof4FuvoljwF-brc8Bm2H-2VElhee5j5bl0A_LXjSG47af3STpIp3Nn_Xtb6g/exec',
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
    quizAnswers: {},
    isOnlineMode: false,
    currentStudentName: '',
    timerInterval: null,
    remainingTime: 0
};

// ==========================================
// FUNCIONES DEL TEMPORIZADOR
// ==========================================
function startTimer(seconds) {
    clearInterval(state.timerInterval);
    state.remainingTime = seconds;
    updateTimerDisplay();

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

    display.textContent = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');

    // Cambiar color según tiempo restante
    display.classList.remove('timer-warning', 'timer-danger');
    if (state.remainingTime <= 30) {
        display.classList.add('timer-danger');
    } else if (state.remainingTime <= 60) {
        display.classList.add('timer-warning');
    }
}

function onTimerComplete() {
    // Auto avanzar al siguiente paso
    if (state.currentStep < CONFIG.TOTAL_STEPS) {
        state.completedSteps.add(state.currentStep);
        goToStep(state.currentStep + 1);
        updateProgress();
    }
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
            startTimer(CONFIG.STEP_TIMES[state.currentStep]);
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
        startTimer(CONFIG.STEP_TIMES[state.currentStep]);
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
    updateStepper();
    updateNavigationButtons();
    document.getElementById('step-indicator').textContent = 'Paso ' + step + ' de ' + CONFIG.TOTAL_STEPS;
    saveProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Iniciar temporizador para el nuevo paso
    startTimer(CONFIG.STEP_TIMES[step]);
}

function navigateStep(dir) {
    if (dir > 0) state.completedSteps.add(state.currentStep);
    goToStep(state.currentStep + dir);
    updateProgress();
}

function updateStepper() {
    document.querySelectorAll('.stepper-item').forEach(function(item) {
        const step = parseInt(item.dataset.step);
        item.classList.remove('active', 'completed');

        if (step === state.currentStep) {
            item.classList.add('active');
        } else if (state.completedSteps.has(step)) {
            item.classList.add('completed');
            item.querySelector('.stepper-circle').innerHTML = '<i class="fas fa-check text-white text-xs"></i>';
        }
    });
}

function updateNavigationButtons() {
    document.getElementById('prev-btn').disabled = state.currentStep === 1;

    const nextBtn = document.getElementById('next-btn');
    nextBtn.innerHTML = state.currentStep === CONFIG.TOTAL_STEPS
        ? 'Finalizar <i class="fas fa-flag-checkered ml-2"></i>'
        : 'Siguiente <i class="fas fa-arrow-right ml-2"></i>';
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

    // Stepper clicks
    document.getElementById('stepper').addEventListener('click', function(e) {
        const item = e.target.closest('.stepper-item');

        if (item) {
            const step = parseInt(item.dataset.step);
            const maxAccessibleStep = Math.max.apply(null, Array.from(state.completedSteps).concat([state.currentStep]));

            if (step <= maxAccessibleStep) {
                goToStep(step);
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
