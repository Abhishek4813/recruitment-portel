'use strict';
const mongoose=require("mongoose");
const managerschema=new mongoose.Schema({
    employ_id:{
      type:String,
      unique:true,
      index:true,
    },
    register_date:Date,
    name:String,
    email:String,
    location:String,
    jobs:[{type:String}],
    freelance_recuriters:[{type:String}],
    active_jobs:[{type:String}],
});
const managermodel=mongoose.model('managers',managerschema);
module.exports=managermodel;