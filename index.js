const electron = require('electron');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({});
    mainWindow.loadFile('main.html');
    mainWindow.on('closed', () => { app.quit(); } ) // fix autoclose app issue

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

ipcMain.on('todo_add', (event, todoValue) => {
    mainWindow.webContents.send('todo_add', todoValue);
    
    addWindow.close();
} )

function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add new todo'
    });
    addWindow.loadFile('add.html');
    addWindow.on('close', () => addWindow = null ) // clean garbage on close
}

const menuTemplate = [ 
    {
        label: 'File', 
        submenu: [
            { 
                label: 'New Todo' ,
                click() { createAddWindow(); }
            },
            { 
                label: 'Clear Todo' ,
                click() { clearTodos(); }
            },
            { 
                label: 'Quit',
                accelerator: 'CmdOrCtrl+Q',
                click() { app.quit(); }
            }
        ]
    }
]

if (process.platform === 'darwin') { 
    menuTemplate.unshift();  // fix Mac issue with first menu label
}

if(process.env.NODE_ENV !== 'production') {
    menuTemplate.push({
        label: 'Developer only',
        submenu: [{
            label: 'Inspect Element',
            accelerator: 'CmdOrCtrl+Shift+I',
            click(item, focusedWindow) {
                focusedWindow.toggleDevTools();
            }
        }, {
            role: 'reload'
        }]
    })
}

function clearTodos() {
    mainWindow.webContents.send('todo_clear');
}
