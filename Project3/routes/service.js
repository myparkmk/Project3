var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 5,
  host : 'localhost',
  user : 'root',
    database : 'test',
    password : ''
});

router.get('/', function(req, res, next){
  res.render('service',{session:req.session});
});

router.post('/', function(req, res, next){
  var title = req.body.title;
  var type  = req.body.type;
  var contents = req.body.contents;

  var datas = [title, type, contents];

  pool.getConnection(function(err, connection){

  var sqlForInserQnA = "insert into qna(title, type, contents) values(?,?,?)";
  connection.query(sqlForInserQnA, datas, function(err, rows){
    if(err) console.error("err: " + err);
    console.log("rows: " +JSON.stringify(rows));

    res.redirect('/service');
    connection.release();
    });
  });
});

module.exports = router;
