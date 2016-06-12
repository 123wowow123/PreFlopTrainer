'use strict';
const electron = require('electron');
const path = require('path');

const app = electron.app;

const ImageFile = require('./util/image-file');
const Guid = require('./util/guid');
const DB = require('./db/db');

const dirPath = `${__dirname}`;
console.log('dirPath',dirPath);
const dbPath = path.join(
	dirPath, '..', 'uploads/preflop.sqlite'
);
console.log('dbPath',dbPath);

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

//debugger;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	DB.save(db, dbPath);
	mainWindow = null;
	db = null;
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 1225,
		height: 850,
		maxWidth: 1225,
		minWidth: 480
	});

	win.loadURL(path.join(
		'file://', dirPath, '..', '/client/index.html'
	));
	win.on('closed', onClosed);

	return win;
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
	if (!db) {
		db = DB.create(dbPath);
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();
	db = DB.create(dbPath);

	// Open the DevTools.
	//mainWindow.webContents.openDevTools();
});


// In main process.
const ipcMain = require('electron').ipcMain;
ipcMain.on('upload-image-async', function(event, arg) {
	console.log(arg); // prints "{"raiseSize":2,"RFI":"Hero","heroPosition":"UTG"}"

	var msg = JSON.parse(arg);
	var key = JSON.stringify(msg.key);
	var relPath = path.format({
		dir: 'uploads/',
		name: Guid.generate(),
		ext: '.png'
	});
	var imagePath = path.resolve(relPath);

	ImageFile.copyFile(msg.imageSourcePath, imagePath, cb);

	function cb() {
		ImageFile.upsertPath(db, key, relPath); //////////
		var response = ImageFile.getPath(db, key);
		var json = JSON.stringify(response);
		event.sender.send('upload-image-async-response', json);
	}
});

ipcMain.on('get-image-async', function(event, arg) {
	console.log(arg); // prints "ping"
	var response = ImageFile.getPath(db, arg);
	var json = JSON.stringify(response);
	event.sender.send('get-image-async-response', json);
});
