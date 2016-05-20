const fs = require('fs');

module.exports = (function(){
  var self = {};

  self.getPath = function(db, key, cb) {
  	var stmt = db.prepare("SELECT * FROM PreFlopImage WHERE id=:key");
  	var result = stmt.getAsObject({
  		':key': key
  	});
  	console.log(result); // Will print {a:1, b:'world'}
  	stmt.free();
  	if (cb) {
  		cb(result)
  	}
  }

  self.addPath = function(db, key, imagePath) {
  	var stmt = db.prepare("INSERT INTO PreFlopImage VALUES (:key, :imagePath)"); //////insert or update
  	stmt.bind({
  		':key': key,
  		':imagePath': imagePath
  	});
  	var result = stmt.step();
  	stmt.free();
  	console.log(key, imagePath);
  	self.getPath(key); ///
  }

  self.copyFile = function(source, target, cb) {
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

  return self;
})();
