'use strict';
const mongoose=require('mongoose');
const candidateschema=new mongoose.Schema({
    assigned_job_id:String,
    name:String,
    submit_date:Date,
    status:String,
    experience:Number,
    qualification:String,
    skills:[{type:String}],
    additional_skills:[{type:String}]
});
const candidatemodel=mongoose.model('candidates',candidateschema);
module.exports=candidatemodel;