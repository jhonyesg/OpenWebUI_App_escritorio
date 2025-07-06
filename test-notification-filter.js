#!/usr/bin/env node

// Script para probar el sistema de filtrado de notificaciones

const fs = require('fs');
const path = require('path');

// Cargar configuración
const configPath = path.join(__dirname, 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

console.log('=== TEST DE FILTRADO DE NOTIFICACIONES ===\n');

// Función de filtrado (copiada de main.js)
function shouldNotify(message, patterns) {
  if (!message || typeof message !== 'string') {
    console.log('❌ Mensaje inválido:', message);
    return false;
  }
  
  const trimmedMessage = message.trim();
  console.log(`🔍 Verificando mensaje: "${trimmedMessage}"`);
  
  for (const pattern of patterns) {
    if (!pattern.enabled) {
      console.log(`⚠️  Patrón deshabilitado: "${pattern.pattern}"`);
      continue;
    }
    
    let matches = false;
    
    if (pattern.type === 'exact') {
      matches = trimmedMessage === pattern.pattern;
    } else if (pattern.type === 'contains') {
      matches = trimmedMessage.includes(pattern.pattern);
    } else if (pattern.type === 'regex') {
      try {
        const regex = new RegExp(pattern.pattern, 'i');
        matches = regex.test(trimmedMessage);
      } catch (e) {
        console.log(`❌ Error en regex: "${pattern.pattern}"`, e.message);
        continue;
      }
    }
    
    if (matches) {
      console.log(`✅ Mensaje coincide con patrón: "${pattern.pattern}" (tipo: ${pattern.type})`);
      return true;
    } else {
      console.log(`❌ No coincide con patrón: "${pattern.pattern}" (tipo: ${pattern.type})`);
    }
  }
  
  console.log('❌ Mensaje no coincide con ningún patrón habilitado');
  return false;
}

// Mensajes de prueba
const testMessages = [
  '¡Ajustes guardados correctamente!',
  'Ajustes de API OpenAI actualizados',
  'Conexión al servidor verificada',
  'Configuration saved successfully',
  'Settings updated',
  'Mensaje aleatorio que no debería sonar',
  'Error al guardar configuración',
  'Guardado exitoso',
  'Los ajustes se han guardado correctamente'
];

console.log('Patrones configurados:');
config.notification_patterns.forEach((pattern, index) => {
  const status = pattern.enabled ? '✅' : '❌';
  console.log(`${index + 1}. ${status} "${pattern.pattern}" (${pattern.type})`);
});

console.log('\n=== RESULTADOS DE PRUEBA ===\n');

testMessages.forEach((message, index) => {
  console.log(`--- Prueba ${index + 1} ---`);
  const result = shouldNotify(message, config.notification_patterns);
  console.log(`Resultado: ${result ? '🔊 SONARÁ' : '🔇 NO SONARÁ'}\n`);
});

console.log('=== FIN DEL TEST ===');
