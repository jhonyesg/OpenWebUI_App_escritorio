# OpenWeb UI Desktop

Una aplicación Electron moderna que proporciona una interfaz de escritorio para OpenWeb UI con sistema de notificaciones inteligente y configuración avanzada.

La contrui especialmente para Linux, pero como usa Electron con Node es Multiplataforma, aun tiene oprotunidades de mejora, como estoy mas en linux hay app en windows que con python y fullstack he estado contruyendo.

![Panel Principal](imagenes_proyecto/Panel%20Principal.png)

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
git clone https://github.com/jhonyesg/OpenWebUI_App_escritorio.git
cd OpenWebUI_App_escritorio
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

![Menu Ajustes](imagenes_proyecto/Menu%20Ajustes.png)

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

### Panel Principal
![Panel Principal](imagenes_proyecto/Panel%20Principal.png)

### Menú de Ajustes
![Menu Ajustes](imagenes_proyecto/Menu%20Ajustes.png)

### Menú de Opciones de la App con Electron
![Menu de Opciones](imagenes_proyecto/Menu%20de%20Opcioens%20de%20la%20app%20con%20electron.png)

### Menú de Desarrollador
![Menu de Desarrollador](imagenes_proyecto/Menu%20de%20Desarrolador%20inpeccion.png)

### Botón de Prueba de Sonido
![Botón de Prueba de Sonido](imagenes_proyecto/Boton%20de%20prueba%20de%20SOnido.png)

## 🛠️ Desarrollo

### Estructura del proyecto
```
OpenWebUI_App_escritorio/
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

- **Panel Principal**: Muestra la interfaz principal de la aplicación. Archivo: `imagenes_proyecto/Panel Principal.png`
- **Menú de Ajustes**: Ilustra las opciones disponibles en el menú de configuración. Archivo: `imagenes_proyecto/Menu Ajustes.png`
- **Menú de Opciones de la App con Electron**: Presenta las opciones principales de la aplicación desarrollada con Electron. Archivo: `imagenes_proyecto/Menu de Opcioens de la app con electron.png`
- **Menú de Desarrollador**: Muestra el menú de inspección para desarrolladores. Archivo: `imagenes_proyecto/Menu de Desarrolador inpeccion.png`
- **Botón de Prueba de Sonido**: Representa el diseño del botón utilizado para probar sonidos en la aplicación. Archivo: `imagenes_proyecto/Boton de prueba de SOnido.png`

## 🙏 Agradecimientos

- [Electron](https://electronjs.org/) - Framework para aplicaciones de escritorio
- [OpenWeb UI](https://github.com/open-webui/open-webui) - La aplicación web base
- [Node.js](https://nodejs.org/) - Runtime de JavaScript

## 📞 Soporte

¿Tienes preguntas o problemas? 

- 🐛 [Reportar un bug](https://github.com/jhonyesg/OpenWebUI_App_escritorio/issues)
- 💡 [Solicitar una característica](https://github.com/jhonyesg/OpenWebUI_App_escritorio/issues)
- 📧 Email: jsuarez@mediaclouding.com

---

<div align="center">
  <b>⭐ Si te gusta este proyecto, no olvides darle una estrella en GitHub ⭐</b>
</div>
