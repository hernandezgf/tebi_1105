# Módulo 2 — Registro de Cambios y Próximos Pasos

**Archivo:** `Modulo2_Estructuras_Admin_TEBI1105.html`
**Fecha:** 2026-02-13
**Antes:** 1,297 líneas / 12 pasos
**Después:** 1,739 líneas / 16 pasos

---

## Cambios Realizados

### Fase 1: Fundación Estructural ✅
- CONFIG expandido: `TOTAL_STEPS: 16`, `STEP_NAMES` (16 nombres), `STEP_TIMES`, `TASKS` (3 tareas), `OLD_TO_NEW_STEP` (migración), `GLOSSARY` (14 términos), `BADGES` (7 logros).
- Todos los `data-step` renumerados de 12 a 16 pasos.
- CSS nuevo: flashcards (perspective/backface-visibility), drag-drop, tooltips (:hover), accordions, task system, badges, glosario modal, mini-quiz, notas del estudiante.
- State expandido con: `tasks`, `miniQuizAnswers`, `achievements`, `streak`.
- Lógica de migración de progreso viejo (12→16 pasos) al cargar datos guardados.

### Fase 2: Sistema de Tareas ✅
- Funciones JS implementadas: `initTaskSystem()`, `setupTaskTextarea()`, `startTaskTimer()`, `updateTaskTimerDisplay()`, `onTaskTimerComplete()`, `showTaskCompleted()`, `updateTaskCharCount()`, `saveTaskToStorage()`, `loadTaskFromStorage()`, `saveTaskToCloud()`.
- Paste bloqueado en textareas (evento `paste`, `Ctrl+V`, menú contextual).
- Timer de tarea independiente (10 min), inicia al primer keystroke.
- 3 pasos de tarea con HTML completo:
  - **Paso 4** — `M2_reflexion_empleabilidad` (Reflexión sobre empleabilidad del BMET)
  - **Paso 8** — `M2_analisis_organizacional` (Análisis de estructura organizacional)
  - **Paso 14** — `M2_caso_real_agencias` (Caso real con agencias reguladoras)
- Sincronización a Google Sheets via `saveTaskResponse` (AppScript existente).

### Fase 3: Elementos Interactivos ✅
- **Flashcards (Paso 9):** 6 tarjetas flip (JCAHO/OSHA/IEEE/NIST/AAMI/FDA) con CSS 3D transforms + `initFlashcards()`.
- **Drag & Drop (Paso 13):** 6 agencias → 6 zonas de función. HTML5 DnD API + touch events para móvil. Respuestas se aleatorizan con `shuffleChildren()` (Fisher-Yates) cada vez que se carga el paso.
- **Accordions (Pasos 5 y 6):** Secciones expandibles para detalles de organigrama y departamento biomédico.

### Fase 4: Contenido Enriquecido ✅
- **Datos BLS (Paso 2):** Panel de salarios US vs PR, proyecciones de empleo, mini-quiz de verificación.
- **Tooltips (Pasos 10-12):** Términos técnicos (510(k), PMA, CBET, trazabilidad) con CSS `:hover`.
- **Recalls reales FDA (Paso 12):** Philips Respironics 2021, Medtronic 2023, link a base MAUDE.
- **Mini-quizzes:** Checkpoints de 1-2 preguntas con feedback inmediato después de Pasos 2, 6 y 12.
- **Escenarios reales (Pasos 10, 12):** Casos de pérdida de acreditación y recalls con análisis.

### Fase 5: UX y Gamificación ✅
- **Navegación por teclado:** Flechas ←/→ (no captura si focus en textarea/input).
- **Notas del estudiante:** Botón flotante + panel lateral, guarda por paso en localStorage (`tebi1105_m2_note_{studentId}_step{N}`).
- **Glosario modal:** Botón en header, modal con búsqueda en tiempo real, 14 términos.
- **Badges:** 7 logros (primer paso, bloque 1 completo, bloque 2 completo, bloque 3 completo, todas las tareas, quiz perfecto, módulo completo). Guardados en localStorage.
- **Indicador de racha:** Feedback "¡X correctas seguidas!" en mini-quizzes.

### Fase 6: Evaluación Expandida (Paso 16) ✅
- 8 preguntas de selección múltiple (MC) — respuestas balanceadas: a=3, b=2, c=3.
- 2 preguntas Verdadero/Falso (Q9-Q10) con justificación.
- 2 preguntas de llenar blancos (Q11-Q12): CBET, PMA.
- 2 preguntas basadas en escenario (Q13-Q14): inspección JCAHO, calibración NIST.
- Resumen final con score total y áreas a repasar.

### Fase 7: Integración Final ✅
- `DOMContentLoaded` inicializa todos los sistemas (flashcards, accordions, DnD, task system, glosario, notas, badges, mini-quizzes, teclado).
- `goToStep()` actualizado con awareness de pasos de tarea y notas.
- `verifyStudentOnline` inicializa tasks y achievements post-login.
- `saveProgress` / `loadProgress` manejan los 16 pasos.

### Ajustes Post-Implementación ✅
- **Timer deshabilitado:** `canAdvance()` retorna `true` siempre. `startTimer()` marca completado sin esperar.
- **Tiempos por paso asignados:**

| Paso | Nombre | Tiempo |
|------|--------|--------|
| 1 | Introducción | 2 min |
| 2 | Empleabilidad | 3 min |
| 3 | Video Carrera | 3 min |
| 4 | Tarea: Reflexión | 10 min |
| 5 | Organigrama Hospital | 3 min |
| 6 | Depto. Biomédico | 3 min |
| 7 | Video Estructura | 7 min |
| 8 | Tarea: Análisis | 10 min |
| 9 | Agencias Intro | 3 min |
| 10 | JCAHO y OSHA | 3 min |
| 11 | IEEE y NIST | 2 min |
| 12 | AAMI y FDA | 4 min |
| 13 | Pareo Agencias | 2 min |
| 14 | Tarea: Caso Real | 10 min |
| 15 | Resumen | 2 min |
| 16 | Autoevaluación | 10 min |

- **Drag & Drop aleatorizado:** Items y zonas se reordenan al azar con `shuffleChildren()`.
- **Quiz balanceado:** Distribución de respuestas MC: a=3, b=2, c=3. Escenarios: a=1, c=1.

---

## Próximos Pasos (Verificación y QA)

### 1. Prueba en Navegador — Flujo Completo
- [ ] Abrir `Modulo2_Estructuras_Admin_TEBI1105.html` en navegador.
- [ ] Hacer login con un ID de estudiante.
- [ ] Navegar los 16 pasos secuencialmente verificando que cada uno renderiza correctamente.
- [ ] Verificar que la barra de progreso (stepper) refleja los 16 pasos.

### 2. Prueba del Sistema de Tareas (Pasos 4, 8, 14)
- [ ] Verificar que el textarea aparece con el mensaje de espera.
- [ ] Escribir texto y confirmar que el timer de 10 min inicia al primer keystroke.
- [ ] Verificar que paste está bloqueado (Ctrl+V, clic derecho, drag text).
- [ ] Verificar contador de caracteres en tiempo real.
- [ ] Dejar que el timer expire y confirmar que se guarda automáticamente.
- [ ] Recargar la página y verificar que la tarea guardada se muestra en modo solo-lectura.
- [ ] Verificar en la consola de red que `saveTaskResponse` envía datos al AppScript.

### 3. Prueba de Elementos Interactivos
- [ ] **Flashcards (Paso 9):** Clic voltea la tarjeta, muestra reverso con descripción.
- [ ] **Drag & Drop (Paso 13):** Arrastrar agencias a zonas correctas. Verificar feedback visual (verde/rojo). Probar en desktop y touch (móvil).
- [ ] **Accordions (Pasos 5, 6):** Clic abre/cierra secciones. Solo una abierta a la vez (o múltiples según diseño).

### 4. Prueba de Contenido Enriquecido
- [ ] **Tooltips (Pasos 10-12):** Hover sobre términos técnicos muestra definición.
- [ ] **Mini-quizzes (Pasos 2, 6, 12):** Responder y verificar feedback inmediato con colores.
- [ ] **Datos BLS (Paso 2):** Verificar que el panel de salarios muestra correctamente.
- [ ] **Recalls FDA (Paso 12):** Verificar casos reales y link a MAUDE.

### 5. Prueba de UX y Gamificación
- [ ] **Teclado:** Flechas ←/→ navegan entre pasos. No captura cuando focus está en textarea/input.
- [ ] **Notas:** Botón flotante abre panel. Escribir nota, cambiar de paso, regresar — nota persiste.
- [ ] **Glosario:** Botón en header abre modal. Buscar término filtra en tiempo real.
- [ ] **Badges:** Completar primer paso → badge "Primer Paso". Completar todos → badge "Módulo Completo". Verificar que se guardan al recargar.

### 6. Prueba de Evaluación (Paso 16)
- [ ] Responder las 14 preguntas (8 MC + 2 V/F + 2 blancos + 2 escenarios).
- [ ] Verificar que el score se calcula correctamente.
- [ ] Verificar que las respuestas se envían a Google Sheets via `saveQuizAnswer`.
- [ ] Verificar resumen final con áreas a repasar.

### 7. Prueba de Persistencia
- [ ] Avanzar hasta paso 8, cerrar pestaña, reabrir — debe restaurar en paso 8.
- [ ] Verificar migración: si un estudiante tenía progreso viejo (12 pasos), al cargar debe mapear correctamente al nuevo esquema de 16 pasos.
- [ ] Verificar que localStorage keys usan el formato correcto: `tebi1105_m2_{studentId}`.

### 8. Prueba de Google Sheets (Producción)
- [ ] Verificar que `saveProgress` envía el paso actual y completion al AppScript.
- [ ] Verificar que las 3 tareas escritas llegan a la hoja con los IDs correctos (`M2_reflexion_empleabilidad`, `M2_analisis_organizacional`, `M2_caso_real_agencias`).
- [ ] Verificar que las respuestas del quiz llegan correctamente.

### 9. Prueba Responsive (Móvil)
- [ ] Verificar layout en pantallas pequeñas (375px ancho).
- [ ] Verificar que drag & drop funciona con touch events.
- [ ] Verificar que flashcards voltean correctamente en móvil.
- [ ] Verificar que el glosario modal es usable en móvil.

---

## Estructura Técnica de Referencia

```
CONFIG keys:
  GOOGLE_SCRIPT_URL, MODULE_ID ('TEBI1105_M2'), TOTAL_STEPS (16)
  STEP_NAMES[16], STEP_TIMES{1-16}, TASKS{3}, OLD_TO_NEW_STEP{12}
  GLOSSARY[14], BADGES[7]

localStorage keys:
  tebi1105_m2_{studentId}           → progreso general (paso, completion, quizAnswers)
  tebi1105_m2_task_{studentId}_{id} → respuesta de tarea guardada
  tebi1105_m2_note_{studentId}_step{N} → notas del estudiante por paso
  tebi1105_m2_badges_{studentId}    → badges/logros ganados

Task IDs (Google Sheets):
  M2_reflexion_empleabilidad  (Paso 4)
  M2_analisis_organizacional  (Paso 8)
  M2_caso_real_agencias       (Paso 14)

AppScript actions usados:
  verify, getProgress, saveProgress, saveQuizAnswer, saveTaskResponse
```
