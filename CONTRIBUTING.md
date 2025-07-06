# Contribuyendo a OpenWeb UI Desktop

¡Gracias por tu interés en contribuir! Este documento proporciona pautas y información sobre cómo contribuir al proyecto.

## 🚀 Primeros pasos

### Configuración del entorno de desarrollo

1. **Fork** el repositorio en GitHub
2. **Clona** tu fork localmente:
   ```bash
   git clone https://github.com/tu-usuario/openwebui-desktop.git
   cd openwebui-desktop
   ```
3. **Instala** las dependencias:
   ```bash
   npm install
   ```
4. **Ejecuta** en modo desarrollo:
   ```bash
   npm run dev
   ```

### Configuración para desarrollo

Para desarrollar con DevTools abierto automáticamente:
```bash
npm run dev -- --dev
```

## 📋 Tipos de contribuciones

Aceptamos varios tipos de contribuciones:

### 🐛 Reportes de bugs
- Usa las [plantillas de issues](https://github.com/tu-usuario/openwebui-desktop/issues/new/choose)
- Incluye información del sistema operativo
- Proporciona pasos para reproducir el problema
- Adjunta logs relevantes

### 💡 Solicitudes de características
- Describe claramente la funcionalidad deseada
- Explica el caso de uso
- Considera la compatibilidad con múltiples plataformas

### 🔧 Mejoras de código
- Optimizaciones de rendimiento
- Refactorización
- Mejoras de seguridad
- Actualización de dependencias

### 📚 Documentación
- Mejoras al README
- Documentación de API
- Tutoriales y guías
- Correcciones de typos

## 🛠️ Proceso de desarrollo

### 1. Crear una rama
```bash
git checkout -b feature/nombre-de-la-caracteristica
# o
git checkout -b fix/descripcion-del-bug
```

### 2. Realizar cambios
- Sigue las [convenciones de código](#convenciones-de-código)
- Escribe tests cuando sea apropiado
- Actualiza la documentación si es necesario

### 3. Testear
```bash
# Ejecutar en modo desarrollo
npm run dev

# Verificar que la aplicación funciona correctamente
# Probar en diferentes sistemas operativos si es posible
```

### 4. Commit
Usa [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: agregar soporte para patrones regex avanzados"
git commit -m "fix: corregir problema de memoria en deduplicación"
git commit -m "docs: actualizar instrucciones de instalación"
```

Tipos de commit:
- `feat`: Nueva característica
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (no afectan funcionalidad)
- `refactor`: Refactorización de código
- `test`: Agregar o modificar tests
- `chore`: Tareas de mantenimiento

### 5. Push y Pull Request
```bash
git push origin feature/nombre-de-la-caracteristica
```

Crea un Pull Request con:
- Título descriptivo
- Descripción detallada de los cambios
- Referencias a issues relacionados
- Screenshots si hay cambios visuales

## 🎯 Convenciones de código

### JavaScript/Node.js
- Usa `const` y `let` en lugar de `var`
- Prefiere arrow functions cuando sea apropiado
- Usa template literals para strings complejos
- Mantén funciones pequeñas y enfocadas
- Comenta código complejo

### Electron específico
- Separa lógica del proceso principal y renderer
- Usa IPC para comunicación entre procesos
- Implementa manejo de errores robusto
- Considera la seguridad en todas las configuraciones

### Estilo de código
- Indentación: 2 espacios
- Punto y coma: Sí
- Comillas: Simples para strings, dobles para JSON
- Longitud de línea: máximo 100 caracteres

Ejemplo:
```javascript
// ✅ Bueno
const createMessageHash = (message) => {
  const normalized = message.trim().toLowerCase().replace(/\s+/g, ' ');
  let hash = 0;
  
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return hash.toString(36);
};

// ❌ Malo
function createMessageHash(message){
var normalized=message.trim().toLowerCase().replace(/\s+/g, ' ')
var hash=0
for(var i=0;i<normalized.length;i++){
var char=normalized.charCodeAt(i)
hash=((hash<<5)-hash)+char
hash=hash&hash}
return hash.toString(36)}
```

## 🧪 Testing

### Tipos de tests
1. **Tests funcionales**: Verifica que las características funcionen
2. **Tests de integración**: Verifica que los componentes trabajen juntos
3. **Tests de regresión**: Verifica que los bugs no reaparezcan

### Ejecutar tests
```bash
npm test
```

### Escribir tests
- Usa nombres descriptivos
- Testa casos edge
- Incluye tests para nuevas características
- Mantén tests simples y enfocados

## 📱 Soporte multiplataforma

### Consideraciones por plataforma

#### Linux
- Prioriza PulseAudio (paplay) para sonido
- Fallback a ALSA (aplay)
- Testa en distribuciones populares (Ubuntu, Fedora, Arch)

#### Windows
- Usa APIs nativas cuando sea posible
- Considera diferentes versiones (10, 11)
- Testa paths con espacios y caracteres especiales

#### macOS
- Respeta convenciones de UI de macOS
- Testa en versiones recientes
- Considera permisos de seguridad

## 🔍 Review process

### Antes de crear PR
- [ ] El código sigue las convenciones establecidas
- [ ] Tests pasan exitosamente
- [ ] Documentación actualizada
- [ ] No hay warnings o errores de linting
- [ ] Funciona en al menos una plataforma

### Proceso de review
1. **Revisión automática**: CI/CD ejecuta tests
2. **Revisión de código**: Mantenedores revisan cambios
3. **Feedback**: Se proporciona feedback constructivo
4. **Iteración**: Se realizan cambios basados en feedback
5. **Aprobación**: PR es aprobado y merged

## 🏷️ Release process

### Versionado
Seguimos [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0): Cambios incompatibles
- **MINOR** (0.1.0): Nueva funcionalidad compatible
- **PATCH** (0.0.1): Correcciones de bugs

### Proceso de release
1. Actualizar CHANGELOG.md
2. Actualizar version en package.json
3. Crear tag de git
4. Generar release notes
5. Publicar binarios

## 💬 Comunicación

### Canales
- **GitHub Issues**: Bugs, features, discusiones técnicas
- **GitHub Discussions**: Preguntas generales, ideas
- **Pull Requests**: Review de código

### Código de conducta
- Sé respetuoso y constructivo
- Enfócate en el código, no en la persona
- Acepta feedback de manera positiva
- Ayuda a otros desarrolladores
- Mantén las discusiones técnicas y relevantes

## 🎉 Reconocimiento

Todos los contribuidores serán:
- Listados en el README
- Mencionados en release notes
- Invitados como colaboradores (contribuciones significativas)

## 📞 ¿Necesitas ayuda?

- 📖 Lee la [documentación](README.md)
- 🐛 Revisa [issues existentes](https://github.com/tu-usuario/openwebui-desktop/issues)
- 💬 Crea una [discusión](https://github.com/tu-usuario/openwebui-desktop/discussions)
- 📧 Contacta mantenedores

¡Gracias por contribuir! 🚀
