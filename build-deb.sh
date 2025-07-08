#!/bin/bash

# Script para construir el paquete .deb de OpenWeb UI Desktop
echo "🔨 Construyendo paquete .deb para OpenWeb UI Desktop..."

# Asegurar que tenemos las dependencias necesarias
npm install

# Limpiar directorios previos
rm -rf dist

# Construir el paquete .deb
npm run build-deb

echo "✅ Paquete .deb construido con éxito."
echo "El archivo .deb se encuentra en la carpeta 'dist'."
echo "Para instalar: sudo dpkg -i dist/openwebui-desktop_*.deb"
echo "              sudo apt-get install -f"  # Resuelve dependencias faltantes

exit 0
