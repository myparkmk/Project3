var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit: 5,
  host: 'localhost',
  user: 'root',
    database : 'test',
    password : 'dbsrn828'
});

router.get('/:name', function(req, res, next){

  var name = req.params.name; //seller_name
  console.log("name : " + name);

  pool.getConnection(function (err, connection){

    var sqlForSelectList = "select * from menu where seller_name=?";
    connection.query(sqlForSelectList,[name], function (err, rows){
      if(err) console.error("err : "+err);
      console.log("rows : " + JSON.stringify(rows));
      var sql2 = "select * from seller where seller_name=?";
      connection.query(sql2,[name], function (err2, rows2){
        if(err2) console.error("err : "+err2);

        res.render('shop',{rows:rows, rows2:rows2, session:req.session});

      });
      connection.release();
    });
  });
});

module.exports = router;
