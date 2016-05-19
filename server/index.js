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

//debugger;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	//saveDB(db, dbName);
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

function createDB(dbName){
	//var filebuffer = fs.readFileSync(dbName);
	// Load the db
	//var db = new SQL.Database(filebuffer);
	var db = new SQL.Database();

	// Execute some sql
	var sqlstr = "CREATE TABLE PreFlopImage (id nvarchar, imagePath nvarchar);";
	db.run(sqlstr); // Run the query without returning anything

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

function getImagePath(key, cb){
	var stmt = db.prepare("SELECT * FROM PreFlopImage WHERE id=:key");
	var result = stmt.getAsObject({':key' : key});
	console.log(result); // Will print {a:1, b:'world'}
	stmt.free();
	if(cb){
		cb(result)
	}
}

function addImagePath(key, imagePath){
	var stmt = db.prepare("INSERT INTO PreFlopImage VALUES (:key, :imagePath)"); //////insert or update
	stmt.bind({':key' : key, ':imagePath': imagePath});
	var result = stmt.step();
	stmt.free();
	console.log(key, imagePath);
	getImagePath(key); ///
}

function copyFile(source, target, cb) {
  var cbCalled = false;

  var rd = fs.createReadStream(source);
  rd.on("error", done);

  var wr = fs.createWriteStream(target);
  wr.on("error", done);
  wr.on("close", function(ex) {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
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
ipcMain.on('upload-image-async', function(event, arg) {
  console.log(arg);  // prints "ping"

  var msg = JSON.parse(arg);
  var target = path.resolve('uploads/123.png');
  function cb(){
  	event.sender.send('upload-image-async-response', target);
  }
  copyFile(msg.imageSourcePath, target, cb);
  addImagePath(msg.key, target);
});

ipcMain.on('get-image-async', function(event, arg) {
  console.log(arg);  // prints "ping"

  function cb(arg){
  	var response = JSON.stringify(arg);
  	event.sender.send('get-image-async-response', response);
  }
  getImagePath(arg, cb);
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