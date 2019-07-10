var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://root:fimongodbwid1!@3.14.130.182:27017/';
var dbName = 'NoteBookLent';

var mongoClient = new Object();

mongoClient.connect = function(callback){
    MongoClient.connect(url,{useNewUrlParser:true}, function(err, client){
        const db = client.db(dbName);
        callback(err,db,client);
    });
}



module.exports = mongoClient;