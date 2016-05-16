'use strict';
const electron = require('electron');
const fs = require('fs');
const path = require('path');
const SQL = require('sql.js');

const app = electron.app;
const dbName = 'preflop.sqlite';

// report crashes to the Electron project
const crashReporter = require('electron').crashReporter;
crashReporter.start({
  productName: 'YourName',
  companyName: 'YourCompany',
  submitURL: 'https://your-domain.com/url-to-submit',
  autoSubmit: false
});

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// prevent window being garbage collected
let mainWindow;
let db;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	saveDB(db, dbName);
	mainWindow = null;
	db = null;
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 1200,
		height: 600
	});

	win.loadURL(`file://${__dirname}/../client/index.html`);
	win.on('closed', onClosed);

	return win;
}

function createDB(dbName){
	//var filebuffer = fs.readFileSync(dbName);
	// Load the db
	//var db = new SQL.Database(filebuffer);
	var db = new SQL.Database();
	return db;
}

function saveDB(db, dbName){
	var data = db.export();
	var buffer = new Buffer(data);
	fs.writeFileSync(dbName, buffer);
}

function fileExists(path) {

  try  {
    return fs.statSync(path).isFile();
  }
  catch (e) {

    if (e.code == 'ENOENT') { // no such file or directory. File really does not exist
      console.log("File does not exist.");
      return false;
    }

    console.log("Exception fs.statSync (" + path + "): " + e);
    throw e; // something else went wrong, we don't have rights, ...
  }
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
	if(!db){
		db = createDB(dbName);
	}
});

app.on('ready', () => {
	//registerProtocol(); /////////
	mainWindow = createMainWindow();
	db = createDB(dbName);

    // Open the DevTools.
	mainWindow.webContents.openDevTools();
});


// In main process.
const ipcMain = require('electron').ipcMain;
ipcMain.on('asynchronous-message', function(event, arg) {
  console.log(arg);  // prints "ping"
  event.sender.send('asynchronous-reply', 'pong');
});



function registerProtocol() {
    var protocol = require('protocol');
    protocol.registerProtocol('local', function(request) {
      var url = request.url.substr(7)
      return new protocol.RequestFileJob(path.normalize(__dirname + '/client/app/' + url));
    }, function (error, scheme) {
      if (!error)
        console.log(scheme, ' registered successfully')
    });
};