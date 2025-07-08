#!/bin/bash

# Configurar permisos para acceso a audio
if command -v usermod &> /dev/null; then
  current_user=$(logname 2>/dev/null || echo $SUDO_USER)
  if [ ! -z "$current_user" ]; then
    # Agregar usuario al grupo audio para permisos de sonido
    usermod -a -G audio "$current_user" 2>/dev/null || true
    # Agregar usuario al grupo pulse para permisos de PulseAudio
    usermod -a -G pulse-access "$current_user" 2>/dev/null || true
  fi
fi

# Crear directorio para cachés y datos si no existe
mkdir -p /var/cache/openwebui-desktop 2>/dev/null || true
chmod 755 /var/cache/openwebui-desktop 2>/dev/null || true

# Crear el directorio de destino del icono si no existe
mkdir -p /home/jsuarez/Documents/OpenWebUI_App_escritorio/assets 2>/dev/null || true

# Copiar icono desde los recursos de la aplicación instalada a la ubicación especificada
if [ -f "/opt/OpenWeb UI/resources/icon.png" ]; then
  cp "/opt/OpenWeb UI/resources/icon.png" /home/jsuarez/Documents/OpenWebUI_App_escritorio/assets/icon.png 2>/dev/null || true
  # Establecer permisos para que el usuario pueda acceder al icono
  chown jsuarez:jsuarez /home/jsuarez/Documents/OpenWebUI_App_escritorio/assets/icon.png 2>/dev/null || true
  chmod 644 /home/jsuarez/Documents/OpenWebUI_App_escritorio/assets/icon.png 2>/dev/null || true
fi

# También copiar a ubicaciones estándar del sistema como respaldo
if [ -f "/opt/OpenWeb UI/resources/icon.png" ]; then
  # Copiar a iconos de aplicaciones del sistema
  mkdir -p /usr/share/pixmaps 2>/dev/null || true
  cp "/opt/OpenWeb UI/resources/icon.png" /usr/share/pixmaps/openwebui-desktop.png 2>/dev/null || true
  
  # Copiar a directorio de iconos hicolor
  mkdir -p /usr/share/icons/hicolor/256x256/apps 2>/dev/null || true
  cp "/opt/OpenWeb UI/resources/icon.png" /usr/share/icons/hicolor/256x256/apps/openwebui-desktop.png 2>/dev/null || true
fi

# Actualizar caché de iconos
if command -v gtk-update-icon-cache &> /dev/null; then
  gtk-update-icon-cache -f -t /usr/share/icons/hicolor 2>/dev/null || true
fi

# Actualizar base de datos de aplicaciones
if command -v update-desktop-database &> /dev/null; then
  update-desktop-database -q
fi

# Establecer como aplicación predeterminada para protocolo openwebui://
if command -v xdg-mime &> /dev/null; then
  xdg-mime default openwebui-desktop.desktop x-scheme-handler/openwebui
fi

echo "OpenWeb UI Desktop instalado correctamente con icono en la ruta especificada"
exit 0
