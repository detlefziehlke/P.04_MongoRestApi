"use strict";

var mongoose = require('mongoose');
var fs = require('fs');
var conn = 0;

mongoose.connect('mongodb://localhost:27017/test');

fs.readdirSync(__dirname + '/models').forEach(function (filename) {
  if (~filename.indexOf('.js'))
    require(__dirname + '/models/' + filename);
});

//find_simple();
//find_test_komplex();
//find_test_komplex2();

find_test_komplex2_promise().then(function (data) {
  for (var i = 0; i < data.length; i++) {
    delete data[i]._id; // doesn't work !!!!
    console.log(data[i]);
  }
  //console.log('result from #find_test_komplex2: \n' + JSON.stringify(data));
  conn--;
  conCanClose();
}, function (err) {
  console.log(err);
  conn--;
  conCanClose();
});


//insert_simple({name: 'julia the hacker', email: 'julia@y.de'});
//insert_multiple();
//update_simple();
//bulk_update();

function insert_simple(obj) {
  conn++;
  var Test = mongoose.model('tests');
  var test = new Test(obj);
  test.save(function (err, results) {
    console.log('Results for test from save:');
    if (err)
      console.log('error occured: ' + err);
    else
      console.log(results);
    conn--;
    conCanClose();
  });
}

function find_simple() {
  conn++;
  mongoose.model('tests').find(function (err, results) {
    console.log('Results for tests:');
    if (err)
      console.log('error occured: ' + err);
    else
      console.log(results);
    conn--;
    conCanClose();
  });
}

function find_test_komplex() {
  conn++;
  mongoose.model('tests').find({}, 'name email', {skip: 0, limit: 33, sort: 'name'}, function (err, results) {
    console.log('Results for tests:');
    if (err)
      console.log('error occured: ' + err);
    else
      console.log(results);
    conn--;
    conCanClose();
  });
}

function find_test_komplex2() {
  conn++;
  mongoose.model('tests')
      .$where('this.email.length < 15')
      .where({email: {'$ne': 'harry'}})
      .sort('name -email')// alternative: .sort({name: 'desc', email:-1})
      .limit(3)
      .exec(function (err, results) {
        console.log('Results for tests:');
        if (err)
          console.log('error occured: ' + err);
        else
          console.log(results);
        conn--;
        conCanClose();
      });
}

function find_test_komplex2_promise() {
  conn++;
  var query = mongoose.model('projects')
      .$where('this.name.length < 15')
      .where({area: {'$ne': 'harry'}})
      .sort('name -area')// alternative: .sort({name: 'desc', email:-1})
      .limit(20);
  return query.exec();
}

function insert_multiple() {
  // this is not a real bulk insert, but for small size array it is o.k.
  var tests = [
    {name: 'Jutta', email: 'Trecki@a.de'},
    {name: 'Judith Hempel', email: 'JHempel@a.de'},
    {name: 'Natalia', email: 'DieSchoene@a.de'}
  ];

  conn++;
  mongoose.model('tests').collection.insert(tests, function (err, results) {
    console.log('Results from insert:');
    if (err)
      console.log('error occured: ' + err);
    else
      console.log(results);
    conn--;
    conCanClose();
  });
}

function update_simple() {
  conn++;
  mongoose.model('tests').update({_id: "54eb3c3e3487a84217781e43"}, {email: 'lovely@home.de'},
      function (err, results) {
        console.log('Results from update:');
        if (err)
          console.log('error occured: ' + err);
        else
          console.log(results);
        conn--;
        conCanClose();
      })
}

function bulk_update() {
  // nur nach erfolger connection siehe node_mongoose2.js
}

function array_update(test_objects) {
// here we to solve the problem of parallel or serialized processing of multiple db operations
  conn++;
  //.update
  //.update
  //.update
  //.excec(function(err, results){...})
  conn--;
  conCanClose();
}

function find_populate() {
  conn++;
  mongoose.model('tasks').find({_id: '54e6f4657ff168b76c0301eb'}, function (err, tasks) {
    console.log('Results for spec. task:');
    if (err)
      console.log('error occured: ' + err);
    else {
      conn++;
      var res;
      mongoose.model('tasks').populate(tasks, {path: 'project'}, function (err, results) {
        res = results.map(function (item) {
          return 'Task subject: ' + item.subject + ' / project: ' + item.project.name;
        })
        console.log('populate ' + res);
        conCanClose();
      });
    }
    conn--;
    conCanClose();
  });
}

function conCanClose() {
  //console.log('open request = ' + conn);

  if (!conn)
    mongoose.connection.close();
}


