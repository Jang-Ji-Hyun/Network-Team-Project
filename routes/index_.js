var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017';
var dbName = 'NoteBookLent';
var status_check=0;
var _status_ = [6];
var _name =[6];
var _class=[6];
var _grade=[6];
var _num = [6];
var myid = 'GSM';
var mygrade = 2 
var myclass = 3
var mynumber = 11
var cancel = 'NULL';

var obj={_name:_name,_grade:_grade,_class:_class,_num:_num};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index_', null);
});

// MongoClient.connect(url,{useNewUrlParser:true}, function(err, client){
//   const db = client.db(dbName);

//   var seatObject = {}
//   db.collection('seatNumber').insertOne();
  
// });

router.get('/notebookCheck',(req,res,next)=>{
  MongoClient.connect(url,{useNewUrlParser:true}, function(err, client){
    const db = client.db(dbName);

    db.collection('User').find({}).toArray(function(err,result){
      if(err) console.log(err);
      else console.log(result.length);
      for(var i=0;i<result.length; i++){
        _name[i]=result[i].UserName;
        _grade[i]=result[i].Grade;
        _class[i]=result[i].Class;
        _num[i]=result[i].Number;
      }
      obj={resultCnt : result.length, _name:_name,_grade:_grade,_class:_class,_num:_num}
      res.render('notebookCheck.ejs',obj);
      client.close();
    });
    
  });
});

router.get('/notebookLent', (req, res, next)=>{
  MongoClient.connect(url,{useNewUrlParser:true}, function(err, client) {
    const db = client.db(dbName);
    db.collection('seatNumber').find({}).toArray(function(err,result){
      for(var i=0;i<result.length;i++){
        _status_[i]=parseInt(result[i].status);
        console.log(`${i+1}_status : `+_status_[i]);
      }
      status_check=0;
      obj = {_status_:_status_,status_check:status_check}
      res.render('notebookLent.ejs',obj);
      client.close();
    });
    
  });
});


router.get('/notebookCancel', (req, res, next)=>{
  MongoClient.connect(url,{useNewUrlParser:true}, function(err, client) {
    const db = client.db(dbName);
    db.collection('seatNumber').find({}).toArray(function(err,result){
      for(var i=0;i<6;i++){
        _status_[i]=parseInt(result[i].status);
        console.log(`${i+1}_status : `+_status_[i]);
      }
      status_check=0;
      obj = {_status_:_status_,status_check:status_check}
      res.render('notebookCancel.ejs',obj);
    });
    client.close();
  });
});


router.post('/notebookLent_process',function(req,res){
  MongoClient.connect(url,{useNewUrlParser:true}, function(err, client) {
    const db = client.db(dbName);
    const snum = parseInt(req.body.seat);
    db.collection('seatNumber').find({}).toArray(function(err,result){
      for(var i=0;i<6;i++){
        if(result[i].id==myid){
          status_check=5;
          //console.log(`${i+1} status_check => 5`);
          //console.log(`${i+1} status_check_`+ status_check);
          obj = {_status_:_status_,status_check:status_check,num:snum}
          //res.render('notebookLent.ejs',obj);
          break;
        }
      }
      //res.render('notebookLent.ejs',obj);
    });
    console.log('status_check : '+status_check);

    db.collection('seatNumber').find({}).toArray(function(err,result){
      if(result[snum-1].status==1) {
        status_check=3;
        obj = {_status_:_status_,status_check:status_check,num:snum}
        //res.render('notebookLent.ejs',obj);
      }
    });
    console.log('status_check : '+status_check);
    
    if(status_check==3 || status_check==5) res.render('notebookLent.ejs',obj);

    db.collection('seatNumber').updateMany({ number:snum  }, 
      { $set: { status: 1 ,id: myid,grade:mygrade,class:myclass,num:mynumber} },function(err,result){
      if(err)console.log(err.message);
    });
    db.collection('seatNumber').find({}).toArray(function(err,result){
      for(var i=0;i<6;i++){
        _status_[i]=parseInt(result[i].status);
      }
      status_check=1;
      obj = {_status_:_status_,status_check:status_check,num:snum}
      res.render('notebookLent.ejs',obj);
    });
    client.close();
  });
});


router.post('/notebookLent_Cancel',function(req,res){
  MongoClient.connect(url,{useNewUrlParser:true}, function(err, client) {
    const db = client.db(dbName);
    const snum = parseInt(req.body.seat);
    db.collection('seatNumber').find({}).toArray(function(err,result){
        if(result[snum-1].status==0) {
        status_check=4;
        obj = {_status_:_status_,status_check:status_check,num:snum}
        res.render('notebookCancel.ejs',obj);
      }
    });
    db.collection('seatNumber').updateMany({ number:snum  }, 
      { $set: { status: 0 ,id: cancel,grade:0,class:0,num:0} },function(err,result){
      if(err)console.log(err.message);
    });
    db.collection('seatNumber').find({}).toArray(function(err,result){
      for(var i=0;i<6;i++){
        _status_[i]=parseInt(result[i].status);
      }
      status_check=2;
      obj = {_status_:_status_,status_check:status_check,num:snum}
      res.render('notebookCancel.ejs',obj);
    });
    client.close();
  });
});


module.exports = router;
