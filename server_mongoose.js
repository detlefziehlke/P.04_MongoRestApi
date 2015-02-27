"use strict";

var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    logger = require('morgan');

require('./models/test');
require('./models/tasks');
require('./models/projects');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(logger('dev'));

mongoose.connect('mongodb://localhost:27017/test');

app.param('collectionName', function (req, res, next, collectionName) {
  req.collection = collectionName;
  return next();
});

app.get('/', function (req, res, next) {
  res.send('please select a collection, e.g., /collections/messages');
});

app.get('/collections2/:collectionName', function (req, res, next) {
  mongoose.model(req.collection).find(function (err, results) {
    if (err) return next(err);
    else {
      console.log(results);
      res.send(results);
    }
  });
});

app.get('/collections/:collectionName', function (req, res, next) {
  console.log('***** get ohne id');

  mongoose.model(req.collection)
      .find()
      .sort('_id')
      .limit(3)
      .exec(function (err, results) {
        if (err) return next(err);
        else {
          console.log(results);
          res.send(results);
        }
      });
});


app.post('/collections2/:collectionName', function (req, res, next) {
  var Collection = mongoose.model(req.collection);
  var collection = new Collection(req.body);
  collection.save(function (err, results) {
    if (err) return next(err);
    else {
      delete results._doc.__v;
      res.send(results);
    }
  });
});

app.post('/collections/:collectionName', function (req, res, next) {
  mongoose.model(req.collection).collection.insert(req.body, function (err, results) {
    if (err) return next(err);
    else {
      res.send(results);
    }
  });
});

app.get('/collections/:collectionName/:id', function (req, res, next) {
  mongoose.model(req.collection).findById(req.params.id, function (e, result) {
    if (e) next(e);
    else res.send(result);
  });
});


app.use(function (err, req, res, next) {
  res.send(err);
})

app.listen(3000, function () {
  console.log('Express server listening on port 3000')
});





