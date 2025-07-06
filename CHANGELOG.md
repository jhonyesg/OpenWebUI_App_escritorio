# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2025-07-06

### Added
- 🎉 Lanzamiento inicial de OpenWeb UI Desktop
- 🔔 Sistema de notificaciones inteligente con patrones configurables
- ⚙️ Editor visual de configuración con interfaz gráfica
- 🎵 Sistema de sonido robusto con múltiples métodos de reproducción (paplay, aplay, ffplay, HTML5)
- 🧠 Sistema de deduplicación inteligente para evitar notificaciones duplicadas
- 🔧 Soporte para múltiples tipos de patrones: exacto, contiene, regex
- 📱 Interfaz responsive que se adapta a diferentes tamaños de ventana
- 🎨 Personalización completa: iconos, sonidos, título, tamaño de ventana
- 🔒 Configuraciones de seguridad optimizadas para contenido remoto
- 💾 Gestión automática de memoria con limpieza periódica
- 📋 Menús contextuales y atajos de teclado
- 🌐 Soporte multi-plataforma (Linux, Windows, macOS)
- 🔄 Recarga automática de configuración al guardar cambios
- 📝 Logs detallados para debugging y troubleshooting

### Security
- Implementadas configuraciones de seguridad robustas para Electron
- Deshabilitada integración de Node.js en renderer por seguridad
- Configurado aislamiento de contexto apropiado para contenido remoto
- Prevención de navegación a dominios no autorizados

### Performance
- Optimizado el sistema de hash para procesamiento rápido de mensajes
- Implementada limpieza automática cada 60 segundos para evitar memory leaks
- Cooldown configurable para reducir carga de procesamiento
- Fallbacks eficientes para reproducción de sonido

[Unreleased]: https://github.com/tu-usuario/openwebui-desktop/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/tu-usuario/openwebui-desktop/releases/tag/v1.0.0
