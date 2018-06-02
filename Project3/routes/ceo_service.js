var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
  res.render('ceo_service', {session:req.session});
});

module.exports = router;
