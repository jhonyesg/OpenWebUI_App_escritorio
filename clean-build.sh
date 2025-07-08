#!/bin/bash

# Script para limpiar archivos de construcción y preparar para git

echo "🧹 Limpiando archivos de construcción..."

# Eliminar carpeta de distribución
if [ -d "dist" ]; then
    echo "📁 Eliminando carpeta dist/ ($(du -sh dist/ 2>/dev/null | cut -f1))"
    rm -rf dist/
fi

# Eliminar archivos de paquetes en el directorio raíz
echo "🗑️ Eliminando archivos de paquetes..."
rm -f *.deb *.rpm *.snap *.appimage *.dmg *.pkg *.msi *.exe *.zip *.tar.gz

# Limpiar node_modules si es muy grande
if [ -d "node_modules" ]; then
    size=$(du -sh node_modules/ 2>/dev/null | cut -f1)
    echo "📦 node_modules/ actual: $size"
    echo "   (Se reinstalará con 'npm install')"
fi

# Limpiar cachés
rm -rf .cache/ .electron/ .nyc_output/

# Mostrar estado de git
echo ""
echo "📊 Estado actual para git:"
echo "   Archivos modificados: $(git status --porcelain | wc -l)"
echo "   Tamaño total del proyecto (sin dist/): $(du -sh --exclude=dist --exclude=node_modules . | cut -f1)"

echo ""
echo "✅ Limpieza completada. El proyecto está listo para git."
echo ""
echo "📝 Para reconstruir:"
echo "   npm install"
echo "   ./build-deb.sh"
