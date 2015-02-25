"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var testSchema = new Schema({
  name: String,
  email: String
});

mongoose.model('tests', testSchema);

