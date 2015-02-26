"use strict";

// following: http://mongodb.github.io/node-mongodb-native/api-articles/nodekoarticle1.html

var conn = 0;
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/exampleDb", function (err, db) {
  if (err) {
    return console.dir(err);
  }

  var collection = db.collection('tests');
  var tests = [
    {name: 'Jutta', email: 'Trecki@a.de'},
    {name: 'Judith Hempel', email: 'JHempel@a.de'},
    {name: 'Natalia', email: 'DieSchoene@ziehlke.de'}
  ];
  conn++;
  collection.insert(tests, {w: 1}, function (err, result) {
    if (err) console.log(err);
    else if (result) console.log(result);
    else console.log('no response');
    conn--;
    conCanClose();
  });

  conn++;
  collection.find().toArray(function (err, items) {
    console.log('---------------------- find ----------------------------------');

    if (err) console.log(err);
    else if (items) console.log(items);
    else console.log('no response');
    conn--;
    conCanClose();
  });

  function conCanClose() {
    if (!conn)
      db.close();
  }
});
