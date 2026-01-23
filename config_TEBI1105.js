// ============================================
// CONFIGURACIÓN - TEBI 1105
// ============================================

const CONFIG = {
    GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxSq1tlrVof4FuvoljwF-brc8Bm2H-2VElhee5j5bl0A_LXjSG47af3STpIp3Nn_Xtb6g/exec',

    MODULES: {
        'TEBI1105_M1A': {
            name: 'El Técnico Biomédico',
            totalSteps: 12
        },
        'TEBI1105_M1B': {
            name: 'Equipos Médicos',
            totalSteps: 11
        }
    }
};

const APP_STATE = {
    currentStudent: null,
    isOnlineMode: true,
    currentStep: 1,
    stepTimerCompleted: {},
    quizAlreadyTaken: false
};
