/**
 * Created by detlefziehlke on 26.02.15.
 */

"use strict";

var mongoose = require('mongoose');
var fs = require('fs');
var conn = 0;
var bulk = {};
fs.readdirSync(__dirname + '/models').forEach(function (filename) {
  if (~filename.indexOf('.js'))
    require(__dirname + '/models/' + filename);
});

mongoose.connect('mongodb://localhost:27017/test');
// funktioniert nicht, weil connection wohl noch nicht etabliert und mongoose diese Art von Call nicht verzögert, bis connection da.
//var bulk1 = mongoose.model('tests').collection.initializeOrderedBulkOp();
//console.log(bulk1);

mongoose.connection.on("open", function (err, conn) {
  mongoose.model('tests')
  bulk = mongoose.model('tests').collection.initializeOrderedBulkOp({useLegacyOps: true});
  bulk_insert();
  //console.log(bulk);
  mongoose.connection.close();
})

function bulk_insert() {
  // this will work, but the result coming back is not filled properly
  var tests = [
    {name: 'Jutta', email: 'Trecki@a.de'},
    {name: 'Judith Hempel', email: 'JHempel@a.de'},
    {name: 'Natalia', email: 'DieSchoene@ziehlke.de'}
  ];

  var bulkResults;
  tests.forEach(function (item) {
    bulk.insert(item, {w: 1})
  });

  bulkResults = bulk.execute(function (err, results) {
    if (err) console.log(err);
    else if (results) console.log(results.toJSON());
    else console.log('no response');

    console.log(results.getUpsertedIds());
    mongoose.connection.close();
  });
  console.log(bulkResults);
}

function conCanClose() {
  if (!conn)
    mongoose.connection.close();
}
