'use strict';
const electron = require('electron');
const path = require('path');
const SQL = require('sql.js');

const app = electron.app;
const dbPath = 'preflop.sqlite';

const ImageFile = require('./util/image-file');
const Guid = require('./util/guid');
const DB = require('./db/db');

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
		width: 1200,
		height: 700
	});

	win.loadURL(`file://${__dirname}/../client/index.html`);
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
	mainWindow.webContents.openDevTools();
});


// In main process.
const ipcMain = require('electron').ipcMain;
ipcMain.on('upload-image-async', function(event, arg) {
	console.log(arg); // prints "ping"

	var msg = JSON.parse(arg);
	var target = path.resolve('uploads/' + Guid.generate() + '.png');

	function cb() {
		event.sender.send('upload-image-async-response', target);
	}
	ImageFile.copyFile(msg.imageSourcePath, target, cb);
	ImageFile.addPath(db, msg.key, target);
});

ipcMain.on('get-image-async', function(event, arg) {
	console.log(arg); // prints "ping"

	function cb(arg) {
		var response = JSON.stringify(arg);
		event.sender.send('get-image-async-response', response);
	}
	ImageFile.getPath(db, arg, cb);
});
