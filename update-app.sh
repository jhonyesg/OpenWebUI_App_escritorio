#!/bin/bash

# Script para actualizar la aplicación instalada con el icono correcto

echo "🔄 Actualizando OpenWeb UI Desktop con icono corregido..."

# Verificar si el archivo .deb existe
DEB_FILE="dist/poe-desktop-app_1.0.0_amd64.deb"

if [ ! -f "$DEB_FILE" ]; then
    echo "❌ Error: No se encontró el archivo $DEB_FILE"
    echo "Por favor, ejecuta primero: ./build-deb.sh"
    exit 1
fi

# Desinstalar la versión anterior
echo "🗑️ Removiendo versión anterior..."
sudo apt-get remove poe-desktop-app -y 2>/dev/null || true

# Instalar la nueva versión
echo "📦 Instalando nueva versión..."
sudo dpkg -i "$DEB_FILE"

# Resolver dependencias si es necesario
echo "🔗 Resolviendo dependencias..."
sudo apt-get install -f -y

# Copiar manualmente el icono a la ubicación específica si no existe
if [ ! -f "/home/jsuarez/Documents/OpenWebUI_App_escritorio/assets/icon.png" ]; then
    echo "📂 Creando directorio de assets..."
    mkdir -p /home/jsuarez/Documents/OpenWebUI_App_escritorio/assets
    
    if [ -f "/opt/OpenWeb UI/resources/icon.png" ]; then
        echo "🎨 Copiando icono a la ubicación especificada..."
        sudo cp "/opt/OpenWeb UI/resources/icon.png" /home/jsuarez/Documents/OpenWebUI_App_escritorio/assets/icon.png
        sudo chown jsuarez:jsuarez /home/jsuarez/Documents/OpenWebUI_App_escritorio/assets/icon.png
        sudo chmod 644 /home/jsuarez/Documents/OpenWebUI_App_escritorio/assets/icon.png
    fi
fi

# Verificar la instalación
if command -v openwebui-desktop &> /dev/null; then
    echo "✅ OpenWeb UI Desktop actualizado correctamente!"
    echo ""
    echo "🎨 Icono configurado en:"
    echo "   /home/jsuarez/Documents/OpenWebUI_App_escritorio/assets/icon.png"
    echo ""
    echo "🔄 Para que el icono aparezca correctamente, reinicia el explorador de archivos o cierra sesión y vuelve a iniciar."
    echo ""
    echo "🎯 Para ejecutar:"
    echo "   • Busca 'OpenWeb UI' en el menú de aplicaciones"
    echo "   • O ejecuta desde terminal: openwebui-desktop"
else
    echo "❌ Error durante la actualización"
    exit 1
fi
