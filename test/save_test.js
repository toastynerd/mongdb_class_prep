'use strict';

var model = require('../lib/model');
var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;

describe('using the model save function', function() {
  before(function() {
    model.connect('mongodb://localhost/test');
  });

  after(function(done) {
    MongoClient.connect('mongodb://localhost/test', function(err, db) {
      db.dropDatabase(function() {
        done();
      });
    });
  });

  it('should be able to save', function(done) {
    expect(model.save).to.be.a('function');
    model.save('tests', {hello: 'world'}, function(err, data) {
      expect(err).to.eql(null);
      expect(data[0].hello).to.eql('world');
      done();
    });
  });
});
