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
    res.render('login',{
      errMsg:"Try login with abhishekkumar0539@gmail.com without any password"
})
  }
  else{
    req.session.user=data.toJSON();
    jobmodel.find({_id:{$in:data.jobs},status:"Active"},function(err,jobs){
      recuritermodel.find({_id:{$in:data.freelance_recuriters}},function(err,recruter){
      res.render('index',{
        name:data.name,
        job:jobs,
        recruter:recruter,
        status:"Accepted",
        use:"manager",
    });     
    });
  })
}
});
});

router.post('/recuriters/dashboard',function(req,res,next){
  recuritermodel.findOne({email:req.body.email},function(err,data){
    if(data===null){
      res.render('login',{
        errMsg:"Check Readme for Dummy Users"
  })
    }
    else{  
      req.session.user=data.toJSON();
      assign_jobsmodel.find({_id:{$in:data.assigned_jobs},status:"Unoccupied"},function(err,valrecruiter){
        var arr=[]
        for(var i=0;i<valrecruiter.length;i++){
            arr.push(valrecruiter[i].job_id);
        }
        jobmodel.find({_id:{$in:arr}},function(err,jobs){
          res.render('index',{
            name:data.name,
            job:jobs,
            status:"Unoccupied",
            use:"recruiter",
          });
        });
      });
    }
  });
  });
router.post('/assign/job',function(req,res,next){
    const job=req.body.job_id;
    const recruiter=req.body.person_id;
    assign_jobsmodel.findOne({job_id:job,recruiter_id:recruiter},function(err,status){
      if(status!=null){
        res.send("This job has been already assigend to this person...");
        return;
      }
      else{
    const assignjob=new assign_jobsmodel({
      account_manager:req.session.user._id,
      recruiter_id:recruiter,
      job_id:job,
      assigned_date:new Date(),
      status:"Unoccupied",
    });
    assignjob.save(function(err,succ){
      if(succ){
        assign_jobsmodel.findOne({job_id:job,recruiter_id:recruiter},function(err,assinjob){
          recuritermodel.updateOne({_id:recruiter},{
            $push:{assigned_jobs:assinjob._id}
          },function(err,succ){
            managermodel.init(function(){
              managermodel.findOneAndUpdate({_id:req.session.user._id,"active_jobs.job_id":job},{
                $push:{"active_jobs.$.assigned_recruiters":recruiter},
              },function(err,succ){
                if(succ===null){
                  managermodel.updateOne({_id:req.session.user._id},{
                    $push:{
                      active_jobs:{
                        job_id:job,
                        assigned_recruiters: [recruiter],
                      }
                    }
                  },function(err,succ){
                    if(succ)
                      res.send("successfully added........");
                  })
                }
                else{
                    res.send("successfully updated...");
                }
              })
            })
          })
        }) 
      }   
    });
  }});
  });
  router.post('/job/action',function(req,res,next){
    const {job_id,status,feedback}=req.body;
    if(status==="Accepted"){
    assign_jobsmodel.findOneAndUpdate({job_id:job_id,recruiter_id:req.session.user._id},{
      $set:{
        start_date:new Date(),
        status:status,
        feedback:feedback,
      }
    },function(err,succ){
      if(succ){
        res.send("The Job Has Been Successfully "+status);
      }
    })}
    else{
      assign_jobsmodel.findOneAndUpdate({job_id:job_id,recruiter_id:req.session.user._id},{
        $set:{
          start_date:new Date(),
          closed_date:new Date(),
          status:status,
          feedback:feedback,
        }
      },function(err,succ){
        if(succ){
          res.send("The Job Has Been Successfully "+status);
        }
      })}
  });
  router.get("/job/accepted",function(req,res,next){
    recuritermodel.findOne({email:req.session.user.email},function(err,data){
    assign_jobsmodel.find({_id:{$in:data.assigned_jobs},status:"Accepted"},function(err,valrecruiter){
      var arr=[]
      for(var i=0;i<valrecruiter.length;i++){
          arr.push(valrecruiter[i].job_id);
      }
      jobmodel.find({_id:{$in:arr}},function(err,jobs){
        candidatemodel.find({status:{$ne:"placed"}},function(err,candidate){
        res.render('index',{
          name:data.name,
          job:jobs,
          recruter:candidate,
          status:"Accepted",
          use:"recruiter",
        });
      });
    });
  });
})});

router.get("/job/rejected",function(req,res,next){
  recuritermodel.findOne({email:req.session.user.email},function(err,data){
  assign_jobsmodel.find({_id:{$in:data.assigned_jobs},status:"Rejected"},function(err,valrecruiter){
    var arr=[]
    for(var i=0;i<valrecruiter.length;i++){
        arr.push(valrecruiter[i].job_id);
    }
    jobmodel.find({_id:{$in:arr}},function(err,jobs){
      res.render('index',{
        name:data.name,
        job:jobs,
        status:"Rejected",
        use:"recruiter",
      });
    });
  });
})});
  router.post('/add/candidate',function(req,res,next){
    const job=req.body.job_id;
    const candidate=req.body.person_id;
    assign_jobsmodel.findOne({job_id:job,recruiter_id:req.session.user._id},function(err,data){
      if((data.candidate_id).includes(candidate)){
          res.send("The candidate is already assigned with this job..");
      }
    else{
    assign_jobsmodel.findOneAndUpdate({job_id:job,recruiter_id:req.session.user._id},{
      $push:{candidate_id:candidate}
    },function(err,succ){
      if(succ){
          res.send("successfully assigned the job to candidate....");
          }
        })
      }
    });});
router.get("/accept/candidate",function(req,res,next){
  var candidate=[];
  assign_jobsmodel.find({account_manager:req.session.user._id},function(err,data){
    for(var i=0;i<data.length;i++){  
    candidate=candidate.concat(data[i].candidate_id);
    }
    candidatemodel.find({_id:{$in:candidate},status:"vacant"},function(err,values){
      if(values){
        res.render("candidate",{
          name:req.session.user.name,
          candidate:values,
        })
      }
    })
  })
});
router.post("/offer/job",function(req,res,next){
  const {status,id}=req.body;
  if(status==="Accept"){
  candidatemodel.findOneAndUpdate({_id:id},{
    $set:{status:"placed"}
  },function(err,succ){
    if(succ)
      res.send("Successfully Accepted the Application..")
  })
}
else{
  candidatemodel.findOneAndUpdate({_id:id},{
    $set:{status:"Rejected"}
  },function(err,succ){
    if(succ)
      res.send("Successfully Rejected the Application..")
  })
}
})
module.exports = router;
