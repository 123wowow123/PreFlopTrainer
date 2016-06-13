'use strict';
const electron = require('electron');
const path = require('path');

const app = electron.app;

const ImageFile = require('./util/image-file');
const Guid = require('./util/guid');
const DB = require('./db/db');

const dirPath = `${__dirname}`;
const savePath = path.resolve(app.getPath('documents'),'PreflopTrainer');
const dbPath = path.join(savePath,'preflop.sqlite');
console.log('dbPath', dbPath);

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
	DB.save(db, dbPath);
	mainWindow = null;
	db = null;
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 1225,
		height: 850,
		maxWidth: 1300,
		minWidth: 500
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
	var imageName = path.format({
		name: Guid.generate(),
		ext: '.png'
	});
	var imagePath = path.join(savePath, imageName);

	ImageFile.copyFile(msg.imageSourcePath, imagePath, cb);

	function cb() {
		ImageFile.upsertPath(db, key, imageName); //////////
		var response = ImageFile.getPath(db, key);
		console.log('Pre normalization imagePath:', response.imagePath);
		response.imagePath = getFilePath(response.imagePath);
		console.log('Post imagePath:', response.imagePath);
		var json = JSON.stringify(response);
		event.sender.send('upload-image-async-response', json);
	}
});

ipcMain.on('get-image-async', function(event, arg) {
	console.log(arg); // prints "ping"
	var response = ImageFile.getPath(db, arg);
	console.log('Pre normalization imagePath:', response.imagePath);
	response.imagePath = getFilePath(response.imagePath); // need better check
	console.log('Post imagePath:', response.imagePath);
	var json = JSON.stringify(response);
	event.sender.send('get-image-async-response', json);
});

function getFilePath(pathName){
	if (pathName) {
			return path.join(savePath, pathName);
	}
	return '/'; //force load nothing. need better 'not available message'
}
