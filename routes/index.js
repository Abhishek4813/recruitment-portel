const express = require('express');
const router = express.Router();
const managermodel=require("../models/manager");
const recuritermodel=require('../models/recuriters');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', {});
});
router.post('/manager/dashboard',function(req,res,next){
managermodel.findOne({email:req.body.email},function(err,data){
  if(data===null){
    res.render('error',{
      errMsg:"No User Available with this email. the olny user at db \n Email : abhishekkumar0539@gmail.com \n without any password"
})
  }
  else{
    res.render('index',{
      name:data.name,
    });
  }
});
});

router.post('/recuriters/dashboard',function(req,res,next){
  recuritermodel.findOne({email:req.body.email},function(err,data){
    if(data===null){
      res.render('error',{
        errMsg:"No User Available with this email. the olny user at db \n Email : abhishekkumar0539@gmail.com \n without any password"
  })
    }
    else{
      res.render('index',{
        name:data.name,
      });
    }
  });
  });

module.exports = router;
