#!/bin/bash

# Script para instalar OpenWeb UI Desktop

echo "🚀 Instalando OpenWeb UI Desktop..."

# Verificar si el archivo .deb existe
DEB_FILE="dist/poe-desktop-app_1.0.0_amd64.deb"

if [ ! -f "$DEB_FILE" ]; then
    echo "❌ Error: No se encontró el archivo $DEB_FILE"
    echo "Por favor, ejecuta primero: ./build-deb.sh"
    exit 1
fi

echo "📦 Archivo encontrado: $DEB_FILE"
echo "📊 Tamaño: $(du -h "$DEB_FILE" | cut -f1)"

# Instalar el paquete .deb
echo "🔧 Instalando paquete..."
sudo dpkg -i "$DEB_FILE"

# Resolver dependencias si es necesario
echo "🔗 Resolviendo dependencias..."
sudo apt-get install -f -y

# Verificar la instalación
if command -v openwebui-desktop &> /dev/null; then
    echo "✅ OpenWeb UI Desktop instalado correctamente!"
    echo ""
    echo "📋 Características instaladas:"
    echo "   • Aplicación disponible en el menú de aplicaciones"
    echo "   • Icono configurado correctamente"
    echo "   • Permisos de audio configurados"
    echo "   • Descargas automáticas a la carpeta Descargas"
    echo "   • Notificaciones visuales habilitadas"
    echo ""
    echo "🎯 Para ejecutar:"
    echo "   • Busca 'OpenWeb UI' en el menú de aplicaciones"
    echo "   • O ejecuta desde terminal: openwebui-desktop"
    echo ""
    echo "🗑️ Para desinstalar:"
    echo "   sudo apt-get remove poe-desktop-app"
else
    echo "❌ Error durante la instalación"
    exit 1
fi
