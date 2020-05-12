'use strict';
const mongoose=require('mongoose');
const jobschema=new mongoose.Schema({
    jobtitle:String,
    company:String,
    department:String,
    location:String,
    contact:String,
    experience:String,
    job_type:String,
    vacancies:String,
    package:String,
    status:String,

});
const jobmodel=mongoose.model('jobs',jobschema);
module.exports=jobmodel;