// Generated by ReScript, PLEASE EDIT WITH CARE
'use strict';

var MongoDb = require("../app/MongoDb");

var Collection = {};

function get(prim) {
  return MongoDb.getDb();
}

var Db = {
  get: get
};

function getCollection(prim) {
  return MongoDb.getCollection(prim);
}

exports.Collection = Collection;
exports.Db = Db;
exports.getCollection = getCollection;
/* ../app/MongoDb Not a pure module */
