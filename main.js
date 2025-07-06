const { app, BrowserWindow, Menu, shell, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const fse = require('fs');

// Leer configuración desde config.json
let WEBAPP_URL = 'https://poe.mediaserver.com.co';
let ICON_PATH = path.join(__dirname, 'assets', 'icon.png');
let NOTIFY_SOUND = path.join(__dirname, 'assets', 'notify.wav');
let APP_TITLE = 'OpenWeb UI';
let WINDOW_SIZE = '1200x800';
let NOTIFICATION_PATTERNS = [
  { pattern: '¡Ajustes guardados correctamente!', enabled: true, type: 'exact' },
  { pattern: 'Ajustes de API OpenAI actualizados', enabled: true, type: 'exact' },
  { pattern: 'Conexión al servidor verificada', enabled: true, type: 'exact' }
];
let NOTIFICATION_COOLDOWN = 3000; // 3 segundos de cooldown por defecto

function loadConfig() {
  try {
    const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
    if (config.webapp_url) WEBAPP_URL = config.webapp_url;
    if (config.icon) ICON_PATH = path.join(__dirname, config.icon);
    if (config.notification_sound) NOTIFY_SOUND = path.join(__dirname, config.notification_sound);
    if (config.app_title) APP_TITLE = config.app_title;
    if (config.window_size) WINDOW_SIZE = config.window_size;
    if (config.notification_patterns) NOTIFICATION_PATTERNS = config.notification_patterns;
    if (config.notification_cooldown) NOTIFICATION_COOLDOWN = config.notification_cooldown;
    console.log('[PoeDesktop] Configuración cargada:', { WEBAPP_URL, ICON_PATH, NOTIFY_SOUND, APP_TITLE, WINDOW_SIZE, patterns: NOTIFICATION_PATTERNS.length, cooldown: NOTIFICATION_COOLDOWN });
  } catch (e) {
    console.warn('[PoeDesktop] No se pudo leer config.json, usando valores por defecto');
  }
}

loadConfig();

console.log('[PoeDesktop] main.js iniciado');

// Función para crear un hash simple del mensaje
function createMessageHash(message) {
  // Normalizar el mensaje: trim, minúsculas, remover espacios extra
  const normalized = message.trim().toLowerCase().replace(/\s+/g, ' ');
  
  // Crear un hash simple basado en el contenido
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convertir a 32bit
  }
  
  return hash.toString(36); // Convertir a base36 para string más corto
}

// Sistema de deduplicación para evitar múltiples sonidos del mismo evento
const recentNotifications = new Map();

// Limpiar notificaciones antiguas automáticamente cada minuto
setInterval(() => {
  cleanupOldNotifications();
}, 60000);

function cleanupOldNotifications() {
  const now = Date.now();
  const keysToDelete = [];
  
  for (const [key, timestamp] of recentNotifications.entries()) {
    if (now - timestamp > NOTIFICATION_COOLDOWN) {
      keysToDelete.push(key);
    }
  }
  
  keysToDelete.forEach(key => {
    recentNotifications.delete(key);
  });
  
  if (keysToDelete.length > 0) {
    console.log(`[PoeDesktop] Limpiadas ${keysToDelete.length} notificaciones antiguas`);
  }
}

// Función para verificar si un mensaje debe disparar notificación
function shouldNotify(message) {
  if (!message || typeof message !== 'string') {
    console.log('[PoeDesktop] Mensaje inválido para verificar notificación:', message);
    return false;
  }
  
  const trimmedMessage = message.trim();
  console.log('[PoeDesktop] Verificando mensaje para notificación:', JSON.stringify(trimmedMessage));
  
  for (const pattern of NOTIFICATION_PATTERNS) {
    if (!pattern.enabled) {
      console.log('[PoeDesktop] Patrón deshabilitado:', pattern.pattern);
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
        console.warn('[PoeDesktop] Error en regex:', pattern.pattern, e);
        continue;
      }
    }
    
    if (matches) {
      console.log('[PoeDesktop] ✓ Mensaje coincide con patrón:', pattern.pattern, '(tipo:', pattern.type + ')');
      return true;
    }
  }
  
  console.log('[PoeDesktop] ✗ Mensaje no coincide con ningún patrón habilitado');
  return false;
}

// Función para reproducir sonido con múltiples métodos
function playNotificationSound(soundFile, callback) {
  console.log('[PoeDesktop] Intentando reproducir sonido:', soundFile);
  
  // Método 1: Usar paplay (PulseAudio)
  const tryPaplay = () => {
    console.log('[PoeDesktop] Intentando con paplay...');
    const { spawn } = require('child_process');
    const paplay = spawn('paplay', [soundFile]);
    
    paplay.on('close', (code) => {
      if (code === 0) {
        console.log('[PoeDesktop] Sonido reproducido exitosamente con paplay');
        callback(null);
      } else {
        console.log('[PoeDesktop] paplay falló, intentando con aplay...');
        tryAplay();
      }
    });
    
    paplay.on('error', (err) => {
      console.log('[PoeDesktop] Error con paplay:', err.message);
      tryAplay();
    });
  };
  
  // Método 2: Usar aplay (ALSA)
  const tryAplay = () => {
    console.log('[PoeDesktop] Intentando con aplay...');
    const { spawn } = require('child_process');
    const aplay = spawn('aplay', [soundFile]);
    
    aplay.on('close', (code) => {
      if (code === 0) {
        console.log('[PoeDesktop] Sonido reproducido exitosamente con aplay');
        callback(null);
      } else {
        console.log('[PoeDesktop] aplay falló, intentando con ffplay...');
        tryFfplay();
      }
    });
    
    aplay.on('error', (err) => {
      console.log('[PoeDesktop] Error con aplay:', err.message);
      tryFfplay();
    });
  };
  
  // Método 3: Usar ffplay
  const tryFfplay = () => {
    console.log('[PoeDesktop] Intentando con ffplay...');
    const { spawn } = require('child_process');
    const ffplay = spawn('ffplay', ['-nodisp', '-autoexit', '-volume', '80', soundFile]);
    
    ffplay.on('close', (code) => {
      if (code === 0) {
        console.log('[PoeDesktop] Sonido reproducido exitosamente con ffplay');
        callback(null);
      } else {
        console.log('[PoeDesktop] ffplay falló, usando fallback HTML...');
        callback(new Error('All sound players failed'));
      }
    });
    
    ffplay.on('error', (err) => {
      console.log('[PoeDesktop] Error con ffplay:', err.message);
      callback(new Error('All sound players failed'));
    });
  };
  
  // Comenzar con paplay
  tryPaplay();
}

// Reproducir sonido personalizado desde el proceso principal
const play = (() => {
  try {
    const p = require('play-sound')({ 
      player: '/usr/bin/paplay', // Usar paplay como predeterminado
      // Opciones adicionales para Linux
      env: {
        DISPLAY: process.env.DISPLAY,
        XAUTHORITY: process.env.XAUTHORITY,
        PULSE_SERVER: process.env.PULSE_SERVER || 'unix:/run/user/1000/pulse/native'
      },
      timeout: 3000
    });
    console.log('[PoeDesktop] play-sound configurado con paplay');
    return p;
  } catch (e) {
    console.error('[PoeDesktop] Error inicializando play-sound:', e);
    return null;
  }
})();

ipcMain.on('notification-sound', (event, message) => {
  console.log('[PoeDesktop] Evento IPC notification-sound recibido con mensaje:', message);
  
  // Verificar si el mensaje debe disparar la notificación
  if (!shouldNotify(message)) {
    console.log('[PoeDesktop] Mensaje filtrado, no se reproducirá sonido');
    return;
  }
  
  // Crear clave única para el mensaje usando hash
  const messageKey = createMessageHash(message);
  const now = Date.now();
  
  console.log(`[PoeDesktop] Hash del mensaje: ${messageKey}`);
  
  // Limpiar notificaciones antiguas
  cleanupOldNotifications();
  
  // Verificar si ya se reprodujo esta notificación recientemente
  if (recentNotifications.has(messageKey)) {
    const lastNotification = recentNotifications.get(messageKey);
    const timeSinceLastNotification = now - lastNotification;
    
    if (timeSinceLastNotification < NOTIFICATION_COOLDOWN) {
      console.log(`[PoeDesktop] ⏰ Notificación duplicada ignorada (hash: ${messageKey}, ${timeSinceLastNotification}ms desde la última)`);
      return;
    }
  }
  
  // Registrar esta notificación
  recentNotifications.set(messageKey, now);
  
  console.log(`[PoeDesktop] ✓ Mensaje aprobado para notificación (hash: ${messageKey}), reproduciendo sonido:`, NOTIFY_SOUND);
  
  // Verificar que el archivo de sonido existe
  if (!fs.existsSync(NOTIFY_SOUND)) {
    console.error('[PoeDesktop] Archivo de sonido no encontrado:', NOTIFY_SOUND);
    return;
  }
  
  // Usar la función personalizada de reproducción
  playNotificationSound(NOTIFY_SOUND, (err) => {
    if (err) {
      console.log('[PoeDesktop] Todos los reproductores fallaron, usando fallback HTML...');
      fallbackSound();
    }
  });
  
  function fallbackSound() {
    console.log('[PoeDesktop] Usando fallback para sonido');
    // Fallback: ventana oculta
    const soundWin = new BrowserWindow({ 
      show: false, 
      webPreferences: { 
        offscreen: true,
        webSecurity: false, // Necesario para cargar archivos locales
        nodeIntegration: false
      }
    });
    
    const soundPath = `file://${NOTIFY_SOUND.replace(/\\/g, '/')}`;
    const htmlContent = `
      <html>
        <head>
          <title>Sound Player</title>
        </head>
        <body>
          <audio id="notifyAudio" preload="auto" autoplay>
            <source src="${soundPath}" type="audio/wav">
            <source src="${soundPath}" type="audio/mpeg">
            Your browser does not support the audio element.
          </audio>
          <script>
            const audio = document.getElementById('notifyAudio');
            audio.volume = 0.8;
            audio.addEventListener('canplaythrough', () => {
              audio.play().then(() => {
                console.log('Audio reproducido con éxito');
                setTimeout(() => {
                  if (window.close) window.close();
                }, 1500);
              }).catch(e => {
                console.error('Error reproduciendo audio:', e);
                setTimeout(() => {
                  if (window.close) window.close();
                }, 500);
              });
            });
            audio.addEventListener('error', (e) => {
              console.error('Error cargando audio:', e);
              setTimeout(() => {
                if (window.close) window.close();
              }, 500);
            });
          </script>
        </body>
      </html>
    `;
    
    soundWin.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);
    soundWin.on('closed', () => {
      console.log('[PoeDesktop] Ventana de sonido cerrada');
    });
    
    // Cerrar la ventana automáticamente después de 3 segundos
    setTimeout(() => {
      if (soundWin && !soundWin.isDestroyed()) {
        soundWin.close();
      }
    }, 3000);
  }
});

let mainWindow;
let configEditorWindow = null;

function createWindow() {
  // Crear la ventana principal
  const [winW, winH] = WINDOW_SIZE.split('x').map(Number);
  mainWindow = new BrowserWindow({
    width: winW || 1200,
    height: winH || 800,
    minWidth: 800,
    minHeight: 600,
    icon: ICON_PATH,
    frame: true,
    titleBarStyle: 'default',
    title: APP_TITLE,
    webPreferences: {
      nodeIntegration: false, // Keep disabled for security
      contextIsolation: false, // Disable for compatibility with remote content
      enableRemoteModule: false,
      webSecurity: false, // Disable for remote content compatibility
      allowRunningInsecureContent: false,
      preload: path.join(__dirname, 'preload.js'),
      partition: 'persist:poe',
      sandbox: false
    },
    show: false
  });
  mainWindow.loadURL(WEBAPP_URL, {
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
  // Asegurar que el menú principal esté visible
  mainWindow.setMenuBarVisibility(true);
  mainWindow.setAutoHideMenuBar(false);

  // Manejar enlaces externos
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Manejar navegación a dominios externos
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    const currentUrl = new URL(WEBAPP_URL);
    
    if (parsedUrl.origin !== currentUrl.origin) {
      event.preventDefault();
      shell.openExternal(navigationUrl);
    }
  });

  // Manejar errores de carga
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    if (errorCode === -106) { // Internet disconnected
      mainWindow.loadFile('offline.html');
    }
  });

  // DevTools en modo desarrollo
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }

  // Limpiar referencia cuando se cierre la ventana
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Función para abrir el editor de configuración
function openConfigEditor() {
  if (configEditorWindow) {
    configEditorWindow.focus();
    return;
  }
  configEditorWindow = new BrowserWindow({
    width: 600,
    height: 600,
    resizable: false,
    minimizable: false,
    maximizable: false,
    parent: mainWindow,
    modal: true,
    backgroundColor: '#fff',
    icon: ICON_PATH,
    frame: true, // Barra nativa de ventana
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    autoHideMenuBar: true
  });
  // Crear menú solo para ajustes
  const ajustesMenu = Menu.buildFromTemplate([
    {
      label: 'Archivo',
      submenu: [
        { label: 'Cerrar', click: () => configEditorWindow.close() }
      ]
    },
    {
      label: 'Herramientas',
      submenu: [
        { label: 'Inspeccionar (DevTools)', accelerator: 'F12', click: () => configEditorWindow.webContents.openDevTools({ mode: 'detach' }) }
      ]
    }
  ]);
  configEditorWindow.setMenu(ajustesMenu);
  configEditorWindow.loadFile('config-editor.html');
  configEditorWindow.on('closed', () => { configEditorWindow = null; });
  // Habilitar DevTools con F12
  configEditorWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12' && input.type === 'keyDown') {
      configEditorWindow.webContents.openDevTools({ mode: 'detach' });
    }
  });
}

// IPC handlers para el editor visual
ipcMain.handle('get-config', async () => {
  return fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8');
});
ipcMain.handle('save-config', async (event, newConfig) => {
  try {
    fs.writeFileSync(path.join(__dirname, 'config.json'), newConfig, 'utf8');
    // Recargar configuración después de guardar
    loadConfig();
    return true;
  } catch (e) {
    console.error('[PoeDesktop] Error al guardar configuración:', e);
    return false;
  }
});
ipcMain.handle('reload-config', async () => {
  try {
    loadConfig();
    return true;
  } catch (e) {
    console.error('[PoeDesktop] Error al recargar configuración:', e);
    return false;
  }
});
ipcMain.handle('reload-app', () => {
  app.relaunch();
  app.exit();
});
ipcMain.handle('copy-asset', async (event, sourcePath, type) => {
  try {
    const ext = sourcePath.split('.').pop();
    const destName = type === 'icon' ? `icon.${ext}` : `notify.${ext}`;
    const destPath = path.join(__dirname, 'assets', destName);
    fse.copyFileSync(sourcePath, destPath);
    return `assets/${destName}`;
  } catch (e) {
    return '';
  }
});

// Configurar el menú de la aplicación
function createMenu() {
  const template = [
    {
      label: 'Archivo',
      submenu: [
        {
          label: 'Recargar',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            if (mainWindow) {
              mainWindow.reload();
            }
          }
        },
        {
          label: 'Forzar Recarga',
          accelerator: 'CmdOrCtrl+Shift+R',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.reloadIgnoringCache();
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Salir',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Ver',
      submenu: [
        {
          label: 'Pantalla Completa',
          accelerator: 'F11',
          click: () => {
            if (mainWindow) {
              mainWindow.setFullScreen(!mainWindow.isFullScreen());
            }
          }
        },
        {
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+Plus',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.setZoomLevel(mainWindow.webContents.getZoomLevel() + 0.5);
            }
          }
        },
        {
          label: 'Zoom Out',
          accelerator: 'CmdOrCtrl+-',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.setZoomLevel(mainWindow.webContents.getZoomLevel() - 0.5);
            }
          }
        },
        {
          label: 'Zoom Reset',
          accelerator: 'CmdOrCtrl+0',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.setZoomLevel(0);
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Modo desarrollador (DevTools)',
          accelerator: 'CmdOrCtrl+Shift+I',
          click: () => {
            if (mainWindow) mainWindow.webContents.openDevTools({ mode: 'detach' });
          }
        }
      ]
    },
    {
      label: 'Ajustes',
      submenu: [
        {
          label: 'Abrir ajustes',
          accelerator: 'CmdOrCtrl+E',
          click: () => {
            openConfigEditor();
          }
        }
      ]
    }
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Evento cuando la aplicación está lista
app.whenReady().then(() => {
  createWindow();
  createMenu();

  // Cargar barra personalizada sobre la webapp
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.executeJavaScript(`
      fetch('titlebar.html').then(r => r.text()).then(html => {
        const div = document.createElement('div');
        div.innerHTML = html;
        document.body.prepend(div.firstChild);
      });
      // Inyectar script para detectar mensajes flotantes genéricos y lanzar notificación
      (function() {
        const keywords = /ajustes|update|success|actualizad[oa]|guardad[oa]|configuraci[óo]n|saved|updated|exitos[ao]|completad[oa]/i;
        const observer = new MutationObserver(() => {
          const alerts = Array.from(document.querySelectorAll('div,span'));
          alerts.forEach(el => {
            if (el.innerText && keywords.test(el.innerText) && !el.dataset.notifSent) {
              el.dataset.notifSent = '1';
              // Enviar mensaje al preload para reproducir sonido personalizado
              window.postMessage({ type: 'custom-notification-sound', debug: el.innerText }, '*');
              // Para depuración
              console.log('[PoeDesktop] Mensaje flotante detectado y postMessage enviado:', el.innerText);
            }
          });
        });
        observer.observe(document.body, { childList: true, subtree: true });
      })();
    `);
  });

  // En macOS, recrear la ventana cuando se hace clic en el dock
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// IPC para controles de ventana y abrir editor de config
ipcMain.on('window-minimize', () => { if (mainWindow) mainWindow.minimize(); });
ipcMain.on('window-maximize', () => { if (mainWindow) mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize(); });
ipcMain.on('window-close', () => { if (mainWindow) mainWindow.close(); });
ipcMain.on('open-config-editor', () => { openConfigEditor(); });
ipcMain.on('window-minimize-ajustes', () => {
  if (configEditorWindow) configEditorWindow.minimize();
});
ipcMain.on('window-maximize-ajustes', () => {
  if (configEditorWindow) {
    if (configEditorWindow.isMaximized()) configEditorWindow.unmaximize();
    else configEditorWindow.maximize();
  }
});
ipcMain.on('window-close-ajustes', () => {
  if (configEditorWindow) configEditorWindow.close();
});

// Salir cuando todas las ventanas estén cerradas
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Prevenir navegación insegura
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});

app.on('browser-window-created', (_, win) => {
  win.hookWindowMessage && win.hookWindowMessage(278, () => { win.setEnabled(false); });
  win.setMenuBarVisibility(false);
  win.setAutoHideMenuBar(true);
});
