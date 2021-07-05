#! /usr/bin/env node

//console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);

if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

var async = require('async');
var Train = require("./models/trains");
const { DateTime } = require("luxon");

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var trains = [];

function trainCreate(no, to, from, dep, arr, cb) {
  console.log(arr);
  console.log(dep);
  var train = new Train({number:no, to:to, from:from, arr_time:arr, dep_time:dep});
       
  train.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Train: ' + train);
    trains.push(train);
    cb(null, train);
  });
}

function createTrains(cb) {
    async.series([
      function(callback) {
        trainCreate('1234', 'Kolkata', 'Delhi', {weekday: 3, hour: 19, minute: 0}, {weekday: 4, hour: 10, minute: 30}, callback);
		},
		function(callback) {
			trainCreate('4321', 'Delhi', 'Kolkata', {weekday: 1, hour: 18, minute: 0}, {weekday: 2, hour: 11, minute: 15}, callback);
		},        
		function(callback) {
			trainCreate('5678', 'Kolkata', 'Digha', {weekday: 5, hour: 6, minute: 30}, {weekday: 5, hour: 11, minute: 0},callback);
		},        
        ],
        // optional callback
        cb);
}

//async.series([
    createTrains(function(err, results) {
      if (err) {
          console.log('FINAL ERR: '+err);
      }
      else {
          console.log('Trains: '+ trains);
          //console.log('Messages: '+ messages);
      }
      // All done, disconnect from database
      mongoose.connection.close();
  });
//],
// Optional callback





