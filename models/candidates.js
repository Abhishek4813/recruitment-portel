'use strict';
const mongoose=require('mongoose');
const candidateschema=new mongoose.Schema({
    assigned_job_id:String,
    submit_date:Date,
    status:String,
    experience:Number,
    qualification:String,
    skills:[{type:String}],
    additional_skills:[{type:String}]
});
const candidatemodel=mongoose.model('candidate',candidateschema);
module.exports=candidatemodel;