const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const shortcut = require('electron-localshortcut');
const RPC = require('discord-rpc');

let win;
const GAME_URL = 'https://repuls.io';
const RPC_CLIENT_ID = '1429162289206001677';


app.commandLine.appendSwitch('disable-frame-rate-limit');
app.commandLine.appendSwitch('disable-gpu-vsync');
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
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
app.commandLine.appendSwitch('enable-quic');
app.commandLine.appendSwitch('high-dpi-support','1');
app.commandLine.appendSwitch('enable-features', 'VaapiVideoDecoder,CanvasOopRasterization,AcceleratedVideoDecode,UseSkiaRenderer');
app.commandLine.appendSwitch('force_high_performance_gpu');
app.commandLine.appendSwitch('js-flags', '--expose-gc');

function setupDiscordRPC() {
    const rpc = new RPC.Client({ transport: 'ipc' });

    rpc.on('ready', () => {
        rpc.setActivity({
            state: 'Playing Repuls.io',
            details: 'A Docski Game',
            startTimestamp: Date.now(),
            largeImageKey: '9692540870cd252f04a36a357d77b4da',
            largeImageText: 'Repuls.io',
            buttons: [
                { label: 'Play REPULS.IO', url: 'https://repuls.io' },
                { label: 'View Client', url: 'https://github.com/AmanLovesCats/Amans-Repuls-Client' }
            ]
        });
        console.log('[RPC] Rich Presence active');
    });

    rpc.login({ clientId: RPC_CLIENT_ID }).catch(console.error);

    rpc.on('disconnected', () => {
        console.log('[RPC] Disconnected, attempting reconnect...');
        setTimeout(() => rpc.login({ clientId: RPC_CLIENT_ID }).catch(console.error), 10000);
    });
}

function createWindow() {
    win = new BrowserWindow({
        width: 1920,
        height: 1080,
        fullscreen: true,
        title: 'Repuls-Client',
        icon: path.resolve(__dirname, 'assets', 'icons', 'icon.ico'),
        show: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            backgroundThrottling: false,
            spellcheck: false,
            sandbox: true
        }
    });

    win.loadURL(GAME_URL);

    win.once('ready-to-show', () => win.show());

    const allowedHost = new URL(GAME_URL).host;


win.webContents.setWindowOpenHandler(({ url }) => {
    const host = new URL(url).host;
    if (host === allowedHost || host.includes('accounts.google.com')) {
        
        return { action: 'allow' };
    }
    
    shell.openExternal(url);
    return { action: 'deny' };
});


win.webContents.on('will-navigate', (e, url) => {
    const host = new URL(url).host;
    if (host === allowedHost || host.includes('accounts.google.com')) {
       
        return;
    }
    e.preventDefault();
    shell.openExternal(url);
});

    win.removeMenu();

    win.webContents.on('did-fail-load', (event, code, desc) => {
        console.error('[Error] Page failed to load:', desc);
    });

    win.webContents.on('dom-ready', () => {
        console.log('[Renderer] DOM is ready');
    });
}

function registerShortcuts() {
    shortcut.register(win, 'F1', () => win.loadURL(GAME_URL));
    shortcut.register(win, 'Alt+F4', () => app.quit());
    shortcut.register(win, 'Ctrl+F5', async () => {
        await win.webContents.session.clearCache();
        app.relaunch();
        app.quit();
    });
    shortcut.register(win, 'Ctrl+F1', async () => {
        console.log('[Full Refresh] Clearing all data...');
        try {
            const ses = win.webContents.session;
            await ses.clearCache();
            await ses.clearStorageData();
            console.log('[Full Refresh] Data cleared. Relaunching...');
            app.relaunch();
            app.quit();
        } catch (err) {
            console.error('[Full Refresh] Error:', err);
        }
    });
    shortcut.register(win, 'F9', () => win.webContents.openDevTools());
    shortcut.register(win, 'F7', () => win.loadURL(`${GAME_URL}/beta`));
    shortcut.register(win, 'F11', () => win.setSimpleFullScreen(!win.isSimpleFullScreen()));
    console.log('[Shortcuts] Registered successfully');
}

function init() {
    createWindow();
    registerShortcuts();
    setupDiscordRPC();
}

app.on('ready', init);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
