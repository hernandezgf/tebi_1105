# CONTEXTO DEL PROYECTO - TEBI 1105

## Información General
- **Curso:** TEBI 1105 - Introducción a la Tecnología Biomédica
- **Institución:** Instituto Tecnológico de Puerto Rico
- **Profesor:** Felipe Hernández Gerena
- **Audiencia:** BMET's (Biomedical Equipment Technicians) / Medical Equipment Repair
- **Repositorio:** https://github.com/hernandezgf/tebi_1105
- **GitHub Pages:** https://hernandezgf.github.io/tebi_1105/

## URLs Importantes
- **Módulo 1A:** https://hernandezgf.github.io/tebi_1105/Modulo1A_Tecnico_Biomedico_TEBI1105.html
- **Módulo 1B:** https://hernandezgf.github.io/tebi_1105/Modulo1B_Equipos_Medicos_TEBI1105.html
- **Google Apps Script:** https://script.google.com/macros/s/AKfycbxH8dRWkxuHBkyZJXAU7fd-Wh9NgRTXceZYpJl083lbdPNWlZ6HzsfNTfavm0HRYbVwjw/exec

## Estructura de Archivos
```
tebi_1105/
├── Modulo1A_Tecnico_Biomedico_TEBI1105.html
├── Modulo1B_Equipos_Medicos_TEBI1105.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── AppScript_TEBI1105.gs
├── config_TEBI1105.js
├── CONFIGURACION_GOOGLE_SHEETS_TEBI1105.txt
├── CONTEXTO_PROYECTO.md
└── .gitignore
```

## Configuración del Módulo 1A

### Tiempos por Paso (Total: 48 minutos)
| Paso | Tema | Tiempo |
|------|------|--------|
| 1 | Introducción | 3 min |
| 2 | DOT vs O*NET | 5 min |
| 3 | Categorías BMET | 3 min |
| 4 | Video BMET | 7 min |
| 5 | Características | 1 min |
| 6 | Ing. Biomédica vs Clínica | 1 min |
| 7 | Video Carrera | 5 min |
| 8 | Presentación | 10 min |
| 9 | Conceptos | 2 min |
| 10 | Equipos | 2 min |
| 11 | Inspección | 2 min |
| 12 | Autoevaluación | 10 min |

### Funcionalidades Implementadas
1. **Temporizador obligatorio:** No puede avanzar hasta completar el tiempo
2. **Persistencia de tiempos:** Guarda en localStorage y Google Sheets
3. **Modo estudio:** Si ya completó el tiempo, puede navegar libremente
4. **Comparativa DOT vs O*NET:** Incluye datos salariales de EE.UU. y Puerto Rico
5. **Imágenes reales:** Equipos de prueba con fotos de Wikimedia
6. **Ejemplos de manuales:** Philips, GE, Medtronic, B. Braun

### Datos Salariales O*NET (49-9062.00)
**Estados Unidos (2024):**
- Mediana: $62,630/año ($30.11/hr)
- Empleados: 68,000
- Crecimiento: 7%+

**Puerto Rico (2024):**
- Mediana: $31,130/año ($14.96/hr)
- Área San Juan: $31,590/año
- Rango: $20,610 - $50,180

## Configuración Google Sheets

### Pestaña "Estudiantes"
| ID | Nombre | Email |
|----|--------|-------|

### Pestaña "Progreso"
| studentId | moduleId | currentStep | completedSteps | completedTimes | timestamp |
|-----------|----------|-------------|----------------|----------------|-----------|

### Pestaña "Respuestas"
| studentId | moduleId | questionNum | answer | isCorrect | timestamp |
|-----------|----------|-------------|--------|-----------|-----------|

### Pestaña "Tareas" (se crea automáticamente)
| studentId | moduleId | taskId | response | charCount | timedOut | timestamp |
|-----------|----------|--------|----------|-----------|----------|-----------|

## Características del Apps Script

### Evita Duplicados
- **saveProgress:** Actualiza registro existente (1 fila por estudiante/módulo)
- **saveQuizAnswer:** No guarda si ya existe respuesta
- **saveTaskResponse:** Actualiza respuesta existente

### Endpoints
- `GET ?action=verify&studentId=X` - Verificar estudiante
- `GET ?action=getProgress&studentId=X&moduleId=Y` - Obtener progreso
- `GET ?action=getTask&studentId=X&moduleId=Y&taskId=Z` - Obtener tarea
- `POST saveProgress` - Guardar progreso
- `POST saveQuizAnswer` - Guardar respuesta quiz
- `POST saveTaskResponse` - Guardar tarea escrita

## Cambios Realizados (23 enero 2026)

### Sesión 1
- Creación del repositorio en cuenta `hernandezgf`
- Corrección del HTML (script tag faltante)
- Modal de login activo
- Apps Script adaptado de TEBI 2035

### Sesión 2
- Separación de código en archivos (css/styles.css, js/app.js)
- Comparativa DOT 019.261-010 vs O*NET 49-9062.00
- Datos salariales de Puerto Rico
- Tiempo del paso 2 aumentado a 5 minutos
- Imágenes reales de equipos de prueba (Fluke, Tektronix, etc.)
- Ejemplos de manuales de fabricantes
- Bloqueo de navegación hasta completar tiempo
- Persistencia de `completedTimes` en localStorage y Google Sheets
- Lógica anti-duplicados en Apps Script
- URL de Apps Script actualizada
- Agregado .gitignore (excluye .claude/)

## Notas Técnicas

### Variables en js/app.js
```javascript
const CONFIG = {
    GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxH8d.../exec',
    MODULE_ID: 'TEBI1105_M1A',
    TOTAL_STEPS: 12,
    STEP_TIMES: { 1: 180, 2: 300, ... }
};
```

### Estado de la Aplicación
```javascript
let state = {
    currentStep: 1,
    completedSteps: new Set(),    // Pasos visitados
    completedTimes: new Set(),    // Pasos con tiempo completado
    quizAnswers: {},
    isOnlineMode: false,
    timerCompleted: false
};
```

### Cuentas de GitHub
- **hernandezgf** - Cuenta del proyecto (hernandezgf@itec.pr)
- **felipillo55** - No usar para este proyecto

## Pendiente

### Módulo 1B
- Aplicar misma estructura que Módulo 1A
- Actualizar URL del Apps Script
- Configurar tiempos por paso

### Mejoras Futuras
- Dashboard para profesor (ver progreso de todos los estudiantes)
- Exportar datos a Excel
- Certificado de completación
