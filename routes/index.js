var express = require('express');
var router = express.Router();
var mongoClient = require('../models/mongoClient');

mongoClient.connect((err,db,client)=>{
  client.close();
})

router.get('/', (req, res, next)=>{
  res.render("index");
});

router.get('/login', (req, res, next)=>{
  var Id = req.query.UserId;
  var Password = req.query.UserPassword;
  
  mongoClient.connect((err,db,client)=>{
    db.collection('User').find({UserId : Id, UserPassword : Password}).toArray((err, result)=>{
      if(result.length != 1){
        res.render("login",{pass : true});
      }else{
        res.render("index");
      }
      client.close();
    });
  });
});

router.get('/create', function(req, res, next) {
  
  mongoClient.connect(function(err,db,client){
    const query = req.query;

    var userObject = {UserId : query.UserId, UserPassword : query.UserPassword, UserName : query.UserName,
       Grade : query.Grade, Class : query.Class, Number : query.Number, UserType : query.UserType};
    db.collection('User').insertOne(userObject, (err,recode)=>{
      if(err){
        res.send("값을 입력하는데 실패했습니다. : " + err);
      }
      res.send("값을 성공적으로 입력했습니다.");
      client.close();
    });
  });
});



module.exports = router;
