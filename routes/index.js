const express = require('express');
const router = express.Router();
const managerschema=require("../models/manager");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;