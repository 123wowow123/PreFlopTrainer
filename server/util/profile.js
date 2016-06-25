module.exports = (function(){
  var self = {};

  self.getProfile = function(db, key) {
    var stmt = db.prepare("SELECT * FROM Profile WHERE id=:key");
    var result = stmt.getAsObject({
      ':key': key
    });
    console.log('getProfile', result); // Will print {a:1, b:'world'}
    stmt.free();
    return result;
  }

  self.updateProfile = function(db, key, profileString){
    var stmt = db.prepare("UPDATE Profile SET profileString = :profileString WHERE id = :key");
    stmt.bind({
      ':key': key,
      ':profileString': profileString
    });
    stmt.step();
    var result = stmt.getAsObject();
    console.log('saveProfile', result);
    stmt.free();
  }

  self.addProfile = function(db, key, profileString){
    var stmt = db.prepare("INSERT INTO Profile VALUES (:key, :profileString)");
    stmt.bind({
      ':key': key,
      ':profileString': profileString
    });
    stmt.step();
    var result = stmt.getAsObject();
    console.log('addProfile', result);
    stmt.free();
  }

  self.upsertProfile = function(db, key, profileString){
    var readResult = self.getProfile(db, key);
    if (Object.keys(readResult).length === 0 && readResult.constructor === Object) {
      self.addProfile(db, key, profileString);
    }
    else {
      self.updateProfile(db, key, profileString);
    }
  }

  return self;
})();
