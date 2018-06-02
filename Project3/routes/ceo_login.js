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
  res.render('ceo_login');
});

router.post('/', function(req, res)
{
  var id = req.body.id;
  var passwd = req.body.passwd;
  var datas = [id, passwd];

  pool.getConnection(function(err, connection)
  {
    if(err) console.error("커넥션 객체 얻어오기 에러: ", err);

    var sql = "select count(*) cnt from user where user_id=? and user_pass=?";
    connection.query(sql, datas, function(err, rows)
    {
      if(err) console.err('err', err);
      console.log('rows:', rows);

      var cnt = rows[0].cnt;
      if(cnt == 1){
        req.session.user = id;
        console.log('Login success' + req.sessionID);
        res.redirect('/ceo'); //main page
      }else {
        console.log('failed');
        res.redirect('/ceo_login');
      }
      connection.release();
    });
  });
});

module.exports = router;
