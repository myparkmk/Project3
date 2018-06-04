var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 5,
    host : 'localhost',
    user : 'root',
    database : 'test',
    password : 'dbsrn828'
});

router.get('/', function(req, res, next){
  res.render('signup');
});


router.post('/', function(req, res, next){
  var USER_ID = req.body.user_id;
  var USER_PASS = req.body.passwd;
  var USER_NAME = req.body.name;
  var USER_MAIL = req.body.email;
  var tel1 = req.body.tel1;
  var tel2 = req.body.tel2;
  var tel3 = req.body.tel3;
  var USER_TEL = tel1 + tel2 + tel3;
  var USER_ADDR = req.body.address;
  var birth = req.body.birth;
  var datas = [USER_ID, USER_NAME, USER_PASS, USER_ADDR, USER_TEL, USER_MAIL];

  pool.getConnection(function (err, connection)
  {
    var sqlForInsertMember = "insert into user(USER_ID, USER_NAME, USER_PASS, USER_ADDR, USER_TEL, USER_MAIL) values(?,?,?,?,?,?)";
    connection.query(sqlForInsertMember, datas, function(err, rows){
        if(err) console.error("err : " + err);
        console.log("rows: " + JSON.stringify(rows));

        res.redirect('/')
        connection.release();
      });
    });
});

module.exports = router;
