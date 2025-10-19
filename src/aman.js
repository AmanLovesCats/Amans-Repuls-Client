const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const shortcut = require('electron-localshortcut');
const RPC = require('discord-rpc');

let win;

app.commandLine.appendSwitch('disable-frame-rate-limit')
app.commandLine.appendSwitch('disable-gpu-vsync')
app.commandLine.appendSwitch('ignore-gpu-blacklist');
app.commandLine.appendSwitch('disable-breakpad');
app.commandLine.appendSwitch('disable-component-update');
app.commandLine.appendSwitch('disable-print-preview');
app.commandLine.appendSwitch('disable-metrics');
app.commandLine.appendSwitch('disable-metrics-repo');
app.commandLine.appendSwitch('smooth-scrolling');
app.commandLine.appendSwitch('enable-javascript-harmony');
app.commandLine.appendSwitch('enable-future-v8-vm-features');
app.commandLine.appendSwitch('disable-hang-monitor');
app.commandLine.appendSwitch('no-referrers');
app.commandLine.appendSwitch('disable-2d-canvas-clip-aa');
app.commandLine.appendSwitch('disable-bundled-ppapi-flash');
app.commandLine.appendSwitch('disable-logging');
app.commandLine.appendSwitch('disable-web-security');
app.commandLine.appendSwitch('webrtc-max-cpu-consumption-percentage=100');
app.commandLine.appendSwitch('enable-pointer-lock-options');
app.commandLine.appendSwitch('disable-accelerated-video-decode', false);
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required')
app.commandLine.appendSwitch('enable-quic');
app.commandLine.appendSwitch('high-dpi-support','1');
app.commandLine.appendSwitch('enable-features', 'VaapiVideoDecoder,CanvasOopRasterization,AcceleratedVideoDecode,UseSkiaRenderer');
app.commandLine.appendSwitch('force_high_performance_gpu');
app.commandLine.appendSwitch('js-flags', '--expose-gc');


function init() {
  DiscordRPC();
  createWindow();
  shortCuts();
}

function DiscordRPC() {
  const rpc = new RPC.Client({ transport: 'ipc' });

  rpc.on('ready', () => {
    rpc.setActivity({
      state: 'A Docski Game',
      details: 'Playing Repuls.io',
      startTimestamp: Date.now(),
      largeImageKey: '9692540870cd252f04a36a357d77b4da',
      largeImageText: 'Repuls.io',
      buttons: [
        { label: 'Play REPULS.IO', url: 'https://repuls.io' },
        { label: 'View Client', url: 'https://github.com/AmanLovesCats/Amans-Repuls-Client' }
  ],

      largeImageKey: '9692540870cd252f04a36a357d77b4da',
      largeImageText: 'Repuls.io'
    });
    console.log('Rich presence is now active');
  });

  rpc.login({ clientId: '1429162289206001677' }).catch(console.error);
}


function createWindow() {
  win = new BrowserWindow({
    width: 1920,
    height: 1080,
    icon: path.resolve(__dirname, 'assets', 'icons', 'faviconV2'),
    show: false,
  });

  win.loadURL('https://repuls.io');

 
  win.once('ready-to-show', () => {
    win.show();
  });

  
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  const allowedHost = new URL('https://repuls.io').host;
  win.webContents.on('will-navigate', (event, url) => {
    if (new URL(url).host !== allowedHost) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });


  win.removeMenu(true);
  win.setFullScreen(true);
  win.setTitle('Repuls-Client');
  win.on('page-title-updated', e => e.preventDefault());

  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load URL:', errorDescription);
  });
}

function shortCuts() {
  shortcut.register(win, 'F1', () => {
    win.loadURL('https://repuls.io');
    console.log('Loading assets');
  });
  shortcut.register(win, 'Alt+F4', () => {
    app.exit(0);
  });
  shortcut.register(win, 'Ctrl+F5', () => {
    win.webContents.session.clearStorageData();
    app.relaunch();
    app.exit();
  });
  shortcut.register(win, 'F9', () => {
    win.webContents.openDevTools();
    console.log('DevTools opened');
  });
  shortcut.register(win, 'F11', () => {
    win.setSimpleFullScreen(!win.isSimpleFullScreen());
  });
  console.log('Shortcuts have been registered');
}

app.on('ready', init);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
