var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit: 5,
  host: 'localhost',
  user: 'root',
    database : 'test',
    password : ''
});


router.get('/order_list', function(req, res, next){
  var user = req.session.user;
  var code = new Array();
  var quantity = new Array();

  pool.getConnection(function (err, connection){
    var sql = "select * from ord where user_id=?";
    connection.query(sql,[user],function(err,rows){
      if(err) console.error("err : "+err);

      console.log(rows);
      res.render('order_list', {rows:rows, session:req.session})
    });
  });
});

router.get('/order_list/info/:order_num', function(req, res, next){
  var num = req.params.order_num;

  console.log(num);
  pool.getConnection(function (err, connection){

    var sqlForSelectList = "select * from ord where order_num=?";
    connection.query(sqlForSelectList, [num], function (err, row1){
      if(err) console.error("err : "+err);

      //query mysql seller_name
      console.log("row1 : " + JSON.stringify(row1));

      var menu_code = JSON.parse(row1[0].menu_code);
      var quantity = JSON.parse(row1[0].quantity);

      var code="";
      var quant=new Array();
      for(i=0;i<menu_code.code.length;i++)
      {
        code +=menu_code.code[i];
        if(i!==menu_code.code.length-1)
          code +=",";
      }

      var sql2 = "select * from menu where menu_code in("+code+");";
      connection.query(sql2, function(err, row2){
        if(err) console.error("err : "+err);

        console.log(row2);

        for(i=0;i<menu_code.code.length;i++)
        {
          for(j=0;j<row2.length;j++)
          {
            if(row2[i].menu_code==menu_code.code[j])
              quant.push(quantity.quantity[j]);
          }
        }
        console.log(quant);

        res.render('order_info',{row1:row1, row2:row2, quant:quant, session:req.session});
        connection.release();

      });
    });
  });
});

router.get('/myinfo', function(req, res, next){
  var user = req.session.user;

  pool.getConnection(function (err, connection) {
    var sql = "select * from user where user_id = ?";
    connection.query(sql, [user], function(err, row){
        if(err) console.error("err : " + err);
        console.log(row);
        console.log(row[0]);
        res.render('myinfo',{row:row, session:req.session});
        connection.release();
      });
    });
});

router.post('/myinfo', function(req,res,next){
  var id = req.session.user;
  var name = req.body.user_name;
  var pass = req.body.user_pass;
  var addr = req.body.user_addr;
  var tel = req.body.user_tel;
  var mail = req.body.user_mail;

  var data = [name, pass, addr, tel, mail, id];
  console.log(data);

  pool.getConnection(function (err, connection) {
    //var sql = "update user set user_name="+name+", user_pass="+pass+", user_addr="+addr+", user_tel="+tel+", user_mail="+mail+" where user_id in('"+id+"')";
    var sql = "update user set user_name=?, user_pass=?, user_addr=?, user_tel=?, user_mail=? where user_id=?";
    connection.query(sql, data, function(err, result){
        if(err) console.error("err : " + err);
        console.log(result);

        if(result.affectedRows == 0)
        {
          res.send("<script>alert('잘못된 요청으로 인해 값이 변경되지 않았습니다.'); history.back();</script>");
        }else {
          res.send("<script>alert('회원정보가 수정되었습니다.'); location.href='/mypage/myinfo';</script>");
        }
        connection.release();
      });
    });
});

router.get('/point', function(req, res, next){

  res.render('point', {session:req.session});
});

router.get('/myreview', function(req, res, next){

  res.render('myreview', {session:req.session});
});


module.exports = router;
