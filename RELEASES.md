# Releases de OpenWeb UI Desktop

Este archivo documenta las versiones y cambios de la aplicación.

## 📋 ¿Cómo obtener una release?

Debido al tamaño de los archivos .deb (>70MB), no se incluyen en el repositorio. Para obtener una versión:

### Método 1: Construir desde código fuente
```bash
git clone [tu-repositorio]
cd OpenWebUI_App_escritorio
npm install
./build-deb.sh
./install-deb.sh
```

### Método 2: Descargar desde GitHub Releases
Las releases están disponibles en: [GitHub Releases](../../releases)

---

## 📝 Historial de Versiones

### v1.0.0 (2025-07-08)
**Primera versión estable**

#### ✨ Características principales:
- 🖥️ Aplicación Electron para OpenWeb UI
- 🔔 Sistema de notificaciones configurables
- 🎵 Notificaciones sonoras personalizables
- 📁 Descargas automáticas a carpeta Descargas
- 🍪 Limpieza de cookies desde menú
- ⚙️ Editor de configuración visual
- 🎨 Icono personalizado integrado
- 📦 Paquete .deb para Ubuntu/Debian

#### 🔧 Características técnicas:
- Construcción automatizada con electron-builder
- Scripts de instalación incluidos
- Permisos de audio configurados automáticamente
- Integración completa con el sistema Linux
- Soporte para múltiples métodos de reproducción de audio

#### 📋 Archivos incluidos:
- `poe-desktop-app_1.0.0_amd64.deb` (~72MB)
- Scripts de construcción e instalación
- Configuración completa del proyecto

#### 🎯 Instalación:
```bash
sudo dpkg -i poe-desktop-app_1.0.0_amd64.deb
sudo apt-get install -f
```

---

## 🚀 Próximas versiones

### v1.1.0 (Planificado)
- Soporte mejorado para Windows
- Actualizaciones automáticas
- Temas personalizables
- Más opciones de notificación

---

## 📞 Soporte

Si tienes problemas:
1. Revisa la documentación en el README.md
2. Construye desde código fuente
3. Reporta issues en GitHub
