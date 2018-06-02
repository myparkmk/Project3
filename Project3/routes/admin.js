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
        var sql = "select * from user";

   connection.query(sql, function(err, rows)
      {
        if(err) console.err(' err', err);
        
        res.render('admin',{title:"",rows:rows});
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

      if(person_info == "name"){
      	var sql = "select * from user where user_name=?";
        console.log(person_info);
      }
      else if(person_info == "id"){
      	var sql = "select * from user where user_id=?";
      }
      else if(person_info == "phone"){
      	var sql = "select * from user where user_tel=?";
      }
      else if(person_info == "gender"){
      	var sql = "select * from user where user_point=?";
      }
      else if(person_info == "mail"){
        var sql = "select * from user where user_mail=?";
      }
       else if(person_info == "nick"){
        var sql = "select * from user where user_nick=?";
      }
            else
        console.error("해당하는 판매자가 존재하지 않습니다.");
      connection.query(sql, person_info2, function(err, rows)
      {
        if(err) console.err('	err', err);
        console.log('rows:', rows);
  	  
  	   res.render('admin',{title:"hi",rows:rows});

  	  //row = mytable.insertRow(mytable.rows.length);
  	  //cell1 = row.insertCell(0);
  	  //cell2 = row.insertCell(1);
    	  //cell1.innerHTML = '항목';
    	  //cell2.innerHTML = '<input type="text" name="strs[]"/>';    

       // console.log(rows.cnt);
        

        connection.release();
     
    });
  });
});

module.exports = router;