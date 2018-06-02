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

router.get('/', function(req, res, next){
  var seller_id = req.session.user;

  pool.getConnection(function(err, connection){
    var sql = "select seller_num, seller_name from seller where seller_id=?";
    connection.query(sql, [seller_id], function(err, row1){
      if(err) console.error("err : "+err);

      if(row1==""){
        res.send("<script>alert('예기치 않은 오류 발생 이전페이지로 돌아갑니다.'); history.back();</script>");
      }else{
        var sql2 = "select * from review where seller_num=?";
        connection.query(sql2, [row1[0].seller_num], function(err, rows){
          if(err) console.error("err :" + err);
          console.log(rows);

          if(rows==""){
            res.send("<script>alert('예기치 않은 오류 발생 이전페이지로 돌아갑니다.'); history.back();</script>");
          }
          else{
            res.render('ceo_review', {session:req.session, rows:rows, seller_name:row1[0].seller_name});
          }
        });
      }
    });
    connection.release();
  });
});

router.post('/', function(req,res,next){
  console.log("ceo_review post");
  res.redirect('/ceo_review');
});

module.exports = router;
