const express = require('express');
const router = express.Router();
const managermodel=require("../models/manager");
const recuritermodel=require('../models/recuriters');
const jobmodel=require("../models/jobs");
const assign_jobsmodel=require("../models/assigned_jobs");
const candidatemodel=require("../models/candidates");

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
    });     
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
      assign_jobsmodel.find({recruiter_id:data._id},function(err,valrecruiter){
        var arr=[]
        for(var i=0;i<valrecruiter.length;i++){
            arr.push(valrecruiter[i].job_id);
        }
        jobmodel.find({_id:{$in:arr}},function(err,jobs){
          candidatemodel.find({},function(err,candidate){
          res.render('index',{
            name:data.name,
            job:jobs,
            recruter:candidate,
          });
        });
        })
      })
    }
  });
  });
router.get('/assign/:job_id/:recruiter_id',function(req,res,next){
    const job=req.params.job_id;
    const recruiter=req.params.recruiter_id;
    const assignjob=new assign_jobsmodel({
      account_manager:req.session.user._id,
      recruiter_id:recruiter,
      job_id:job,
      assigned_date:new Date(),
      status:"Unoccupied",
    });
    assignjob.save(function(err,succ){
      if(succ){
        managermodel.findOneAndUpdate({_id:req.session.user._id},{
          $push:{
          active_jobs:{
              job_id: job,
              assigned_recruiters: [recruiter],
          }}
        },function(err,succ){
          if(err){
            res.render("error",{
              errMsg:"try to insert duplicate value",
            })
          }
          if(succ){
            res.send("successfully added.....");
          }
        }); 
      }   
    });
  });
  router.get('/candidate/:job_id/:candidate_id',function(req,res,next){
    const candidate=req.params.candidate_id;
    assign_jobsmodel.find({},function(err,data){
      if(data){
        if(candidate.includes(data.candidate_id)){
          candidatemodel.updateOne({_id:candidate},{
            $set:{status:"Rejected"},
          },function(err,succ){
            res.send("Application Rejected as  some One else submited the same candidate");
          })
        }
        else{
          candidatemodel.updateOne({_id:candidate},{
            status:"Accepted",
          },function(err,succ){
            res.send("Application Accepted");
          })
        }
      }
    })

  })
module.exports = router;
