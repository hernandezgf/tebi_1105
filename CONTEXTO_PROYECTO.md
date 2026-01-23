# CONTEXTO DEL PROYECTO - TEBI 1105

## Información General
- **Curso:** TEBI 1105 - Introducción a la Tecnología Biomédica
- **Institución:** Instituto Tecnológico de Puerto Rico
- **Profesor:** Felipe Hernández Gerena
- **Repositorio:** https://github.com/hernandezgf/tebi_1105
- **GitHub Pages:** https://hernandezgf.github.io/tebi_1105/

## URLs de los Módulos
- **Módulo 1A:** https://hernandezgf.github.io/tebi_1105/Modulo1A_Tecnico_Biomedico_TEBI1105.html
- **Módulo 1B:** https://hernandezgf.github.io/tebi_1105/Modulo1B_Equipos_Medicos_TEBI1105.html

## Archivos del Proyecto
1. `Modulo1A_Tecnico_Biomedico_TEBI1105.html` - Módulo sobre El Técnico Biomédico (BMET)
2. `Modulo1B_Equipos_Medicos_TEBI1105.html` - Módulo sobre Equipos Médicos
3. `AppScript_TEBI1105.gs` - Código de Google Apps Script para backend
4. `config_TEBI1105.js` - Archivo de configuración
5. `CONFIGURACION_GOOGLE_SHEETS_TEBI1105.txt` - Instrucciones de configuración

## Cambios Realizados (23 enero 2026)

### 1. Creación del Repositorio
- Repositorio creado en cuenta `hernandezgf` (no felipillo55)
- GitHub Pages habilitado y funcionando

### 2. Corrección del HTML (Modulo1A)
- Se arregló error donde el código JavaScript se mostraba visible en la página
- Faltaba la etiqueta `<script>` y las variables iniciales
- Se agregaron los botones de navegación (Anterior/Siguiente) que faltaban

### 3. Modal de Login
- El modal de login está ACTIVO (pide ID de estudiante)
- Para desactivarlo: agregar clase `modal-hidden` al div `id="login-modal"`

### 4. Google Apps Script
- Se creó `AppScript_TEBI1105.gs` adaptado del código funcional de TEBI 2035
- Soporta: verificación de estudiantes, progreso, quiz, y tareas escritas

## PENDIENTE POR HACER

### 1. Configurar Google Sheets
Crear un Google Sheet con estas pestañas:
- **Estudiantes** (columnas: ID, Nombre, Email)
- **Progreso** (columnas: studentId, moduleId, currentStep, completedSteps, timestamp)
- **Respuestas** (columnas: studentId, moduleId, questionNum, answer, isCorrect, timestamp)
- **Tareas** (se crea automáticamente)

### 2. Implementar Apps Script
1. Abrir Google Sheet > Extensiones > Apps Script
2. Pegar contenido de `AppScript_TEBI1105.gs`
3. Implementar > Nueva implementación > Aplicación web
4. Ejecutar como: "Yo" | Acceso: "Cualquier usuario"
5. Copiar la URL generada

### 3. Actualizar URL en HTML
En `Modulo1A_Tecnico_Biomedico_TEBI1105.html`, buscar y reemplazar:
```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx.../exec';
```
Con la nueva URL generada del Apps Script.

### 4. Revisar Módulo 1B
- Verificar que tenga la misma estructura corregida
- Asegurar que el modal de login funcione
- Actualizar la URL del Apps Script si es necesario

## Notas Técnicas

### Estructura del Modal de Login
```html
<div id="login-modal" class="modal-overlay">
    <!-- Para ocultar: agregar clase "modal-hidden" -->
</div>
```

### Variables JavaScript Importantes
```javascript
const GOOGLE_SCRIPT_URL = '...';  // URL del Apps Script
const MODULE_ID = 'TEBI1105_M1A'; // ID del módulo actual
```

### Cuentas de GitHub
- **hernandezgf** - Cuenta del proyecto TEBI 1105 (email: hernandezgf@itec.pr)
- **felipillo55** - Otra cuenta (no usar para este proyecto)

## Comandos Útiles

```bash
# Ver estado del repo
git status

# Subir cambios
git add . && git commit -m "mensaje" && git push

# Cambiar cuenta de GitHub CLI
gh auth login
```
