const express = require('express');
const router = express.Router();
const managermodel=require("../models/manager");
const recuritermodel=require('../models/recuriters');
const jobmodel=require("../models/jobs");

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
    req.session.user=data.toJSON();
    jobmodel.find({_id:{$in:data.jobs}},function(err,jobs){
      recuritermodel.find({_id:{$in:data.freelance_recuriters}},function(err,recruter){
      res.render('index',{
        name:data.name,
        job:jobs,
        recruter:recruter,
    })     
    });
  })
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
      req.session.user=data.toJSON();
      res.render('index',{
        name:data.name,
      });
    }
  });
  });
router.get('/assign/:job_id/:recruiter_id',function(req,res,next){
    const job=req.params.job_id;
    const recruiter=req.paramas.recruiter_id;
    console.log(req.session.user._id);
    managermodel.init(function(){
      managermodel.updateOne({_id:req.session.user._id},{
      $push:{
      active_jobs:{
          job_id: job,
          $push:{assigned_recruiters: recruiter},
      }}
    },function(err,succ){
      /*if(err.code==11000){
        res.render("error",{
          errMsg:"try to insert duplicate value",
        })
      }*/
      if(succ){
        console.log("Successfully added");
        res.sen("success");
      }
    });  
  })
  });
module.exports = router;
