// Preload script para mejorar la seguridad
const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

console.log('[PoeDesktop] Preload script iniciado');
console.log('[PoeDesktop] ipcRenderer disponible:', typeof ipcRenderer);

// Función para cargar configuración desde config.json
function loadConfig() {
  try {
    return JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
  } catch (e) {
    console.error('[PoeDesktop] Error al cargar config.json:', e);
    return {};
  }
}

// Configuración inicial
let config = loadConfig();
let NOTIFY_SOUND = path.join(__dirname, 'assets', 'notify.wav');
if (config.notification_sound) {
  NOTIFY_SOUND = path.join(__dirname, config.notification_sound);
}

// Exponer APIs directamente al window (sin contextBridge para compatibilidad)
window.electronAPI = {
  platform: process.platform,
  version: process.versions.electron,
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  openConfigEditor: () => ipcRenderer.send('open-config-editor'),
  getConfig: async () => {
    try {
      return JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
    } catch (e) {
      console.error('[PoeDesktop] Error al leer config:', e);
      return {};
    }
  },
  notifySound: (msg) => {
    try {
      const message = msg || 'test';
      console.log('[PoeDesktop] Enviando notification-sound:', message);
      ipcRenderer.send('notification-sound', message);
    } catch (e) {
      console.error('[PoeDesktop] Error en notifySound:', e);
    }
  },
  send: (channel, data) => {
    try {
      const validChannels = ['notification-sound', 'window-minimize', 'window-maximize', 'window-close', 'open-config-editor'];
      if (!validChannels.includes(channel)) {
        console.warn('[PoeDesktop] Canal IPC no válido:', channel);
        return;
      }
      const payload = data !== undefined ? data : '';
      console.log('[PoeDesktop] electronAPI.send:', channel, payload);
      ipcRenderer.send(channel, payload);
    } catch (e) {
      console.error('[PoeDesktop] Error en electronAPI.send:', e, 'Channel:', channel, 'Data:', data);
    }
  }
};

// También exponer ipcRenderer para debugging
window.ipcRenderer = {
  send: (channel, data) => {
    const validChannels = ['notification-sound', 'window-minimize', 'window-maximize', 'window-close', 'open-config-editor'];
    if (validChannels.includes(channel)) {
      console.log('[PoeDesktop] window.ipcRenderer.send llamado:', channel, data);
      ipcRenderer.send(channel, data);
    } else {
      console.warn('[PoeDesktop] Canal IPC no válido en window.ipcRenderer:', channel);
    }
  }
};

console.log('[PoeDesktop] APIs expuestas directamente en window');
console.log('[PoeDesktop] window.electronAPI:', window.electronAPI);
console.log('[PoeDesktop] window.electronAPI.notifySound:', typeof window.electronAPI.notifySound);

// Función global para reproducir el sonido personalizado
window.playCustomNotificationSound = function(message) {
  const msg = message || 'auto';
  console.log('[PoeDesktop] playCustomNotificationSound llamada con:', msg);
  
  try {
    // Verificar múltiples formas de acceder al electronAPI
    if (window.electronAPI && window.electronAPI.notifySound) {
      console.log('[PoeDesktop] Usando window.electronAPI.notifySound');
      window.electronAPI.notifySound(msg);
    } else if (typeof electronAPI !== 'undefined' && electronAPI.notifySound) {
      console.log('[PoeDesktop] Usando electronAPI directo');
      electronAPI.notifySound(msg);
    } else {
      console.error('[PoeDesktop] electronAPI.notifySound no disponible');
      console.log('[PoeDesktop] window.electronAPI:', window.electronAPI);
      console.log('[PoeDesktop] electronAPI:', typeof electronAPI !== 'undefined' ? electronAPI : 'undefined');
      
      // Fallback directo usando ipcRenderer si está disponible
      if (typeof ipcRenderer !== 'undefined') {
        console.log('[PoeDesktop] Usando fallback ipcRenderer directo');
        ipcRenderer.send('notification-sound', msg);
      } else if (window.ipcRenderer && window.ipcRenderer.send) {
        console.log('[PoeDesktop] Usando window.ipcRenderer fallback');
        window.ipcRenderer.send('notification-sound', msg);
      } else {
        console.error('[PoeDesktop] No hay forma de enviar IPC');
      }
    }
  } catch (e) {
    console.error('[PoeDesktop] Error en playCustomNotificationSound:', e);
  }
};

// Interceptar notificaciones y reproducir sonido personalizado
window.Notification = class extends Notification {
  constructor(title, options) {
    super(title, options);
    window.playCustomNotificationSound();
  }
};

window.addEventListener('message', (event) => {
  if (event && event.data && event.data.type === 'custom-notification-sound') {
    console.log('[PoeDesktop] Mensaje personalizado recibido:', event.data);
    window.playCustomNotificationSound(event.data.debug || 'custom-message');
  }
});

// Detectar alertas flotantes directamente desde el preload
window.addEventListener('DOMContentLoaded', () => {
  // Test de electronAPI después de que el DOM esté cargado
  setTimeout(() => {
    console.log('[PoeDesktop] Test post-DOM load:');
    console.log('[PoeDesktop] window.electronAPI:', window.electronAPI);
    console.log('[PoeDesktop] window.electronAPI.notifySound:', window.electronAPI ? window.electronAPI.notifySound : 'N/A');
    console.log('[PoeDesktop] window.ipcRenderer:', window.ipcRenderer);
  }, 1000);
  
  // Botón de prueba de sonido (solo para depuración)
  setTimeout(() => {
    if (!document.getElementById('testNotifySoundBtn')) {
      const btn = document.createElement('button');
      btn.id = 'testNotifySoundBtn';
      btn.textContent = '🔊';
      btn.style.position = 'fixed';
      btn.style.bottom = '120px'; // Subir el botón aún más arriba
      btn.style.left = '';
      btn.style.right = '20px';
      btn.style.zIndex = '99999';
      btn.style.padding = '10px 15px';
      btn.style.backgroundColor = '#007bff';
      btn.style.color = 'white';
      btn.style.border = 'none';
      btn.style.borderRadius = '5px';
      btn.style.cursor = 'pointer';
      btn.style.fontSize = '14px';
      btn.style.fontWeight = 'bold';
      btn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
      
      btn.onclick = () => {
        console.log('[PoeDesktop] Botón de prueba clickeado');
        try {
          // Probar con un mensaje que sabemos que debe sonar
          const testMessage = '¡Ajustes guardados correctamente!';
          if (window.electronAPI && window.electronAPI.notifySound) {
            console.log('[PoeDesktop] Usando window.electronAPI.notifySound');
            window.electronAPI.notifySound(testMessage);
          } else if (window.ipcRenderer && window.ipcRenderer.send) {
            console.log('[PoeDesktop] Usando window.ipcRenderer.send');
            window.ipcRenderer.send('notification-sound', testMessage);
          } else {
            console.error('[PoeDesktop] Ni electronAPI ni ipcRenderer disponibles');
            console.log('[PoeDesktop] window.electronAPI:', window.electronAPI);
            console.log('[PoeDesktop] window.ipcRenderer:', window.ipcRenderer);
          }
        } catch (e) {
          console.error('[PoeDesktop] Error en botón de prueba:', e);
        }
      };
      
      document.body.appendChild(btn);
      console.log('[PoeDesktop] Botón de prueba de sonido agregado');
    }
  }, 2000); // Esperar 2 segundos para asegurar que el DOM esté listo

  // Observer mejorado para detectar mensajes específicos
  const observer = new MutationObserver(() => {
    // Buscar notificaciones tipo sonner-toast (más específico)
    const sonnerToasts = Array.from(document.querySelectorAll('[data-sonner-toast] [data-content], [data-sonner-toast] [data-title], [data-sonner-toast]'));
    sonnerToasts.forEach(el => {
      if (el.innerText && !el.dataset.notifSounded) {
        el.dataset.notifSounded = '1';
        const message = el.innerText.trim();
        console.log('[PoeDesktop] Mensaje sonner-toast detectado:', JSON.stringify(message));
        
        // Enviar al proceso principal para filtrado
        if (window.electronAPI && window.electronAPI.notifySound) {
          window.electronAPI.notifySound(message);
        } else if (window.ipcRenderer) {
          window.ipcRenderer.send('notification-sound', message);
        }
      }
    });
    
    // Buscar notificaciones tipo alert/toast genéricas
    const toasts = Array.from(document.querySelectorAll('[role="alert"], .toast, .alert, .notification, .snackbar'));
    toasts.forEach(el => {
      if (el.innerText && !el.dataset.notifSounded) {
        el.dataset.notifSounded = '1';
        const message = el.innerText.trim();
        console.log('[PoeDesktop] Mensaje toast genérico detectado:', JSON.stringify(message));
        
        // Enviar al proceso principal para filtrado
        if (window.electronAPI && window.electronAPI.notifySound) {
          window.electronAPI.notifySound(message);
        } else if (window.ipcRenderer) {
          window.ipcRenderer.send('notification-sound', message);
        }
      }
    });
    
    // Fallback: buscar en elementos con texto que contengan palabras clave
    const keywords = /ajustes|guardados|correctamente|configuración|saved|updated|success|API|OpenAI|servidor|verificada|conexión/i;
    const elements = Array.from(document.querySelectorAll('div, span, p'));
    elements.forEach(el => {
      if (el.innerText && keywords.test(el.innerText) && !el.dataset.notifSounded) {
        // Verificar que el elemento sea visible y no esté oculto
        const rect = el.getBoundingClientRect();
        const isVisible = rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).display !== 'none';
        
        if (isVisible) {
          el.dataset.notifSounded = '1';
          const message = el.innerText.trim();
          console.log('[PoeDesktop] Mensaje fallback detectado:', JSON.stringify(message));
          
          // Enviar al proceso principal para filtrado
          if (window.electronAPI && window.electronAPI.notifySound) {
            window.electronAPI.notifySound(message);
          } else if (window.ipcRenderer) {
            window.ipcRenderer.send('notification-sound', message);
          }
        }
      }
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
  console.log('[PoeDesktop] Observer de notificaciones iniciado');
});
