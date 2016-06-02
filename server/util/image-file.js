const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

module.exports = (function(){
  var self = {};

  self.getPath = function(db, key) {
    var stmt = db.prepare("SELECT * FROM PreFlopImage WHERE id=:key");
    var result = stmt.getAsObject({
      ':key': key
    });
    console.log('getPath', result); // Will print {a:1, b:'world'}
    stmt.free();
    return result;
  }

  self.addPath = function(db, key, imagePath) {
    var stmt = db.prepare("INSERT INTO PreFlopImage VALUES (:key, :imagePath)");
    stmt.bind({
      ':key': key,
      ':imagePath': imagePath
    });
    stmt.step();
    var result = stmt.getAsObject();
    console.log('addPath', result);
    stmt.free();
  }

  self.updatePath = function(db, key, imagePath){
    var stmt = db.prepare("UPDATE PreFlopImage SET imagePath = :imagePath WHERE id = :key");
    stmt.bind({
      ':key': key,
      ':imagePath': imagePath
    });
    stmt.step();
    var result = stmt.getAsObject();
    console.log('updatePath', result);
    stmt.free();
  }

  self.upsertPath = function(db, key, imagePath){
    var readResult = self.getPath(db, key);
    if (Object.keys(readResult).length === 0 && readResult.constructor === Object) {
      self.addPath(db, key, imagePath);
    }
    else {
      //delete original image
      self.removeFile(readResult.imagePath)
      self.updatePath(db, key, imagePath);
    }
  }

  self.copyFile = function(source, target, cb) {
    var cbCalled = false;
    var dirName = path.dirname(target);
    self.createDir(dirName);

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

  self.removeFile = function(source) {
    fs.exists(source, function(exists) {
      if(exists) {
        //Show in green
        console.log('File exists. Deleting now:', source );
        fs.unlink(source);
      } else {
        //Show in red
        console.log('File not found, so not deleting.');
      }
    });
  }

  self.createDir = function(dirName) {
    mkdirp(dirName, function(err) {
      if (err) console.error(err)
      else console.log('Directory created:', dirName)
    });
  }

  return self;
})();
