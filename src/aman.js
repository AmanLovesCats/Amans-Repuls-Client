const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const shortcut = require('electron-localshortcut');
const RPC = require('discord-rpc');

let win;

function init() {
  DiscordRPC();
  createWindow();
  shortCuts();
}

function DiscordRPC() {
  const rpc = new RPC.Client({ transport: 'ipc' });

  rpc.on('ready', () => {
    rpc.setActivity({
      state: 'Playing Repuls.io',
      startTimestamp: new Date(),

      
       buttons: [
    { label: 'Play REPULS.IO', url: 'https://repuls.io' },
    { label: 'REPULS.IO Discord', url: 'https://discord.com/invite/2YKgx2HSfR' }
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
    icon: path.resolve(__dirname, 'assets', 'icons', 'faviconV2.png'),
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
