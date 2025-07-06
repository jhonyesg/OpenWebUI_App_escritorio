# OpenWeb UI Desktop

Una aplicación Electron moderna que proporciona una interfaz de escritorio para OpenWeb UI con sistema de notificaciones inteligente y configuración avanzada.

![OpenWeb UI Desktop](imagenes_proyecto/screenshot_principal.png)

## 🚀 Características

### 🔔 Sistema de Notificaciones Inteligente
- **Notificaciones configurables**: Define patrones específicos para recibir notificaciones sonoras
- **Deduplicación automática**: Evita sonidos duplicados para el mismo evento
- **Múltiples tipos de patrón**: Soporta coincidencia exacta, contiene texto y expresiones regulares
- **Sonidos personalizables**: Cambia el archivo de sonido desde la configuración

### ⚙️ Configuración Avanzada
- **Editor visual**: Interfaz gráfica para modificar toda la configuración
- **Configuración en tiempo real**: Los cambios se aplican inmediatamente sin reiniciar
- **Múltiples opciones**: URL de la webapp, título, tamaño de ventana, iconos y más

### 🔧 Características Técnicas
- **Multi-plataforma**: Funciona en Linux, Windows y macOS
- **Seguridad robusta**: Configuraciones de seguridad optimizadas para contenido remoto
- **Sistema de sonido robusto**: Múltiples métodos de reproducción con fallbacks automáticos
- **Gestión de memoria**: Limpieza automática para prevenir memory leaks

## 📦 Instalación

### Prerrequisitos
- Node.js 16+ 
- npm o yarn

### Clonar e instalar
```bash
git clone https://github.com/tu-usuario/openwebui-desktop.git
cd openwebui-desktop
npm install
```

### Ejecutar en modo desarrollo
```bash
npm run dev
```

### Crear ejecutable
```bash
npm run build
```

## 🔧 Configuración

### Archivo de configuración (`config.json`)

```json
{
  "webapp_url": "https://tu-openwebui.com",
  "app_title": "OpenWeb UI",
  "window_size": "1200x800",
  "icon": "assets/icon.png",
  "notification_sound": "assets/notify.wav",
  "notification_cooldown": 3000,
  "notification_patterns": [
    {
      "pattern": "¡Ajustes guardados correctamente!",
      "enabled": true,
      "type": "exact"
    },
    {
      "pattern": "actualizado",
      "enabled": true,
      "type": "contains"
    },
    {
      "pattern": "^Conexión.*verificada$",
      "enabled": true,
      "type": "regex"
    }
  ]
}
```

### Configuración mediante interfaz gráfica

La aplicación incluye un editor visual de configuración accesible desde:
- Menú: `Ajustes > Abrir ajustes`
- Atajo de teclado: `Ctrl+E` (Linux/Windows) o `Cmd+E` (macOS)

![Editor de configuración](imagenes_proyecto/config_editor.png)

## 🔔 Sistema de Notificaciones

### Tipos de patrones soportados

#### 1. **Exacto** (`exact`)
Coincidencia exacta del texto:
```json
{
  "pattern": "¡Ajustes guardados correctamente!",
  "type": "exact"
}
```

#### 2. **Contiene** (`contains`)
El mensaje debe contener el texto especificado:
```json
{
  "pattern": "guardado",
  "type": "contains"
}
```

#### 3. **Expresión Regular** (`regex`)
Patrones avanzados usando regex:
```json
{
  "pattern": "^(Configuración|Ajustes).*(guardad[oa]|actualizada?).*$",
  "type": "regex"
}
```

### Configuración del sistema de sonido

La aplicación utiliza múltiples métodos para reproducir sonidos:

1. **PulseAudio** (`paplay`) - Método preferido en Linux
2. **ALSA** (`aplay`) - Fallback para sistemas Linux
3. **FFmpeg** (`ffplay`) - Fallback universal
4. **HTML5 Audio** - Fallback final usando Electron

### Deduplicación inteligente

El sistema evita notificaciones duplicadas:
- **Hash único**: Cada mensaje genera un hash basado en su contenido normalizado
- **Cooldown configurable**: Tiempo mínimo entre notificaciones del mismo evento
- **Limpieza automática**: Gestión de memoria para prevenir acumulación

## 🎨 Personalización

### Cambiar el icono de la aplicación
1. Coloca tu archivo de imagen en la carpeta `assets/`
2. Actualiza `config.json`:
```json
{
  "icon": "assets/mi_icono.png"
}
```

### Cambiar el sonido de notificación
1. Coloca tu archivo de audio en la carpeta `assets/`
2. Actualiza `config.json`:
```json
{
  "notification_sound": "assets/mi_sonido.wav"
}
```

Formatos soportados: WAV, MP3, OGG, AAC

## 📸 Capturas de pantalla

### Pantalla principal
![Pantalla principal](imagenes_proyecto/pantalla_principal.png)

### Editor de configuración
![Editor de configuración](imagenes_proyecto/editor_configuracion.png)

### Sistema de notificaciones en acción
![Notificaciones](imagenes_proyecto/notificaciones.png)

### Menú de la aplicación
![Menú](imagenes_proyecto/menu_aplicacion.png)

## 🛠️ Desarrollo

### Estructura del proyecto
```
openwebui-desktop/
├── main.js              # Proceso principal de Electron
├── preload.js           # Script de precarga
├── config.json          # Archivo de configuración
├── config-editor.html   # Editor de configuración
├── package.json         # Dependencias y scripts
├── assets/              # Recursos (iconos, sonidos)
├── imagenes_proyecto/   # Capturas de pantalla
└── README.md           # Este archivo
```

### Scripts disponibles

```bash
# Ejecutar en modo desarrollo
npm run dev

# Ejecutar con DevTools abierto
npm run dev -- --dev

# Crear build para distribución
npm run build

# Linting del código
npm run lint

# Ejecutar tests
npm run test
```

### Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crea un Pull Request

## 🐛 Solución de problemas

### El sonido no funciona en Linux
Asegúrate de tener instalado PulseAudio o ALSA:
```bash
# Ubuntu/Debian
sudo apt-get install pulseaudio-utils alsa-utils

# Fedora/CentOS
sudo dnf install pulseaudio-utils alsa-utils
```

### La aplicación no carga la URL
1. Verifica la configuración de `webapp_url` en `config.json`
2. Asegúrate de tener conexión a internet
3. Revisa que la URL sea accesible desde tu navegador

### Las notificaciones no aparecen
1. Verifica que los patrones estén habilitados (`"enabled": true`)
2. Revisa los logs en la consola para debugging
3. Asegúrate de que el archivo de sonido existe

### Problemas de rendimiento
1. Ajusta el `notification_cooldown` a un valor mayor
2. Reduce el número de patrones activos
3. Verifica el uso de memoria en el Administrador de tareas

## 📝 Changelog

### v1.0.0 (2025-07-06)
- ✨ Lanzamiento inicial
- 🔔 Sistema de notificaciones configurable
- ⚙️ Editor visual de configuración
- 🔧 Soporte multi-plataforma
- 🎵 Sistema de sonido robusto con múltiples fallbacks
- 🧠 Deduplicación inteligente de notificaciones

## 📜 Licencia

Este proyecto está licenciado bajo una licencia libre con atribución requerida. Esto significa que puedes usar, modificar y distribuir este software siempre que incluyas una atribución adecuada al autor original. Por favor, incluye un enlace a este repositorio y menciona al autor en cualquier uso público.

## 🖼️ Imágenes del Proyecto

A continuación se documentan las imágenes incluidas en la carpeta `imagenes_proyecto`:

- **Botón de prueba de sonido**: Representa el diseño del botón utilizado para probar sonidos en la aplicación. Archivo: `imagenes_proyecto/Boton de prueba de SOnido.png`
- **Captura de pantalla del área de selección**: Muestra una selección específica dentro de la aplicación. Archivo: `imagenes_proyecto/Captura de pantalla_área-de-selección_20250706094117.png`
- **Menú de ajustes**: Ilustra las opciones disponibles en el menú de configuración. Archivo: `imagenes_proyecto/Menu Ajustes.png`
- **Menú de opciones de la app con Electron**: Presenta las opciones principales de la aplicación desarrollada con Electron. Archivo: `imagenes_proyecto/Menu de Opcioens de la app con electron.png`
- **Panel principal**: Muestra la interfaz principal de la aplicación. Archivo: `imagenes_proyecto/Panel Principal.png`

## 🙏 Agradecimientos

- [Electron](https://electronjs.org/) - Framework para aplicaciones de escritorio
- [OpenWeb UI](https://github.com/open-webui/open-webui) - La aplicación web base
- [Node.js](https://nodejs.org/) - Runtime de JavaScript

## 📞 Soporte

¿Tienes preguntas o problemas? 

- 🐛 [Reportar un bug](https://github.com/tu-usuario/openwebui-desktop/issues)
- 💡 [Solicitar una característica](https://github.com/tu-usuario/openwebui-desktop/issues)
- 📧 Email: tu-email@ejemplo.com

---

<div align="center">
  <b>⭐ Si te gusta este proyecto, no olvides darle una estrella en GitHub ⭐</b>
</div>
