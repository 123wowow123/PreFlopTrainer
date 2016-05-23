const fs = require('fs');
const SQL = require('sql.js');

module.exports = (function() {
	var self = {};
	self.load = function(dbPath) {
		return {

		};
	}

	self.create = function(dbPath) {
    //create db file if not exist also check if file has table and create if not exist
    var db;
    if (self.exist(dbPath)) {
      		var filebuffer = fs.readFileSync(dbPath);
          // Load the db
          db = new SQL.Database(filebuffer);
          //var sqlstr = "CREATE TABLE PreFlopImage (id nvarchar, imagePath nvarchar);"; ////////////////
    }
    else {
		    db = new SQL.Database();
        var sqlstr = "CREATE TABLE PreFlopImage (id nvarchar, imagePath nvarchar);";
    }

		db.run(sqlstr); // Run the query without returning anything

		return db;
	}

  self.save = function(db, dbPath) {
  	var data = db.export();
  	var buffer = new Buffer(data);
  	fs.writeFileSync(dbPath, buffer);
  }

  self.exist = function(path) {

  	try {
  		return fs.statSync(path).isFile();
  	} catch (e) {

  		if (e.code == 'ENOENT') { // no such file or directory. File really does not exist
  			console.log("File does not exist.");
  			return false;
  		}

  		console.log("Exception fs.statSync (" + path + "): " + e);
  		throw e; // something else went wrong, we don't have rights, ...
  	}
  }

	return self;
})();
