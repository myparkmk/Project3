var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit : 5,
    host : 'localhost',
    user : 'root',
    database : 'test',
    password : 'qktmxj011'
});

router.get('/', function(req, res, next) {
   pool.getConnection(function(err, connection)
    {
      if(err) console.error("커넥션 객체 얻어오기 에러: ", err);
      console.log(req.body.class);
        var sql = "select * from team";

   connection.query(sql, function(err, rows)
      {
        if(err) console.err(' err', err);

        res.render('admin_ceo',{title:"",rows:rows});
        connection.release();
      });
   });
});

router.post('/', function(req, res)
{
  var person_info = req.body.person_info;
  var person_info2 = req.body.person_info2;

  pool.getConnection(function(err, connection)
    {
      if(err) console.error("커넥션 객체 얻어오기 에러: ", err);

      if(person_info == "s_num"){
        var sql = "select * from seller where seller_num=?";
      }
      else if(person_info == "s_name"){
        var sql = "select * from seller where seller_name=?";
      }
      else if(person_info == "s_type"){
        var sql = "select * from seller where seller_type=?";
      }
      else if(person_info == "s_tell"){
        var sql = "select * from seller where seller_tell=?";
      }
      else if(person_info == "s_phone"){
        var sql = "select * from seller where seller_phone=?";
      }
      else if(person_info == "s_id"){
        var sql = "select * from seller where seller_id=?";
      }
      else
        console.error("해당하는 판매자가 존재하지 않습니다.");
      connection.query(sql, person_info2, function(err, rows)
      {
        if(err) console.err(' err', err);
        console.log('rows:', rows);

       res.render('admin_ceo',{title:"hi",rows:rows});

        connection.release();

    });
  });
});

module.exports = router;
