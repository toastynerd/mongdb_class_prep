'use strict';

var MongoClient = require('mongodb').MongoClient;
var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;

var Model = function() {
  this.using = 0;
};

inherits(Model, EventEmitter);

Model.prototype.connect = function(connString) {
  this.connString = connString;
};

Model.prototype.save = function(collectionName, modelData, callback) {
  var data = {
    collection: collectionName,
    modelData: modelData,
    callback: callback
  };

  this.emit('connect', 'save', data);
};

var model = new Model();

model.on('connect', function(action, data) {
  this.using++;
  if (this.conn) 
    return this.emit(action, data);

  MongoClient.connect(this.connString, function(err, db) {
    if (err)
      return data.callback(err);

    this.conn = db;
    this.emit(action, data);
  }.bind(this));
});

model.on('closeConnection', function() {
  if (this.using !== 0)
    return;

  this.conn.close();
});

model.on('save', function(data) {
  var collection = this.conn.collection(data.collection);

  collection.insert(data.modelData, function(err, res) {
    this.using--;
    if (err)
      return data.callback(err);

    data.callback(null, res);
    this.emit('closeConnection');
  }.bind(this));
});

module.exports = exports = model;
