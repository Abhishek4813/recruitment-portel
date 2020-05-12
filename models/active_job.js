'use strict';
const mongoose=require("mongoose");
const job_activeschema=new mongoose.Schema({
    job_id: String,
   assigned_recruiters:[{type:String}],
});
const job_activemodel=mongoose.model('job_active',job_activeschema);
module.exports=job_activemodel;