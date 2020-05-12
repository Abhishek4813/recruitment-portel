'use strict';
const mongoose=require('mongoose');
const assigned_jobschema=new mongoose.Schema({
    account_manager:String,
    recruiter_id:String,
    job_id:String,
    assigned_date:Date,
    start_date:Date,
    closed_date:Date,
    status:String,
    candidate_id:[{type:String}],
    feedback:String,
});
const assigned_jobmodel=mongoose.model('assigned_jobs',assigned_jobschema);
module.exports=assigned_jobmodel;