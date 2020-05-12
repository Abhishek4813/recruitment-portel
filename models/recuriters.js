'use strict';
const mongoose=require('mongoose');
const recruiterschema=new mongoose.Schema({
    register_date: Date,
    name:String,
    email:String,
    email:String,
    profile_type:String,
    experience_level:String,
    hours:Number,
    locations:[{type:String}],
    assigned_jobs: [{type:String}],
});
const recruitermodel=mongoose.model('recruiters',recruiterschema);
module.exports=recruitermodel;