var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit: 5,
  host: 'localhost',
  user: 'root',
    database : 'test',
    password : 'qktmxj011'
});

router.get('/:name', function(req, res, next){

  var name = req.params.name;
  console.log("name : " + name);
  pool.getConnection(function (err, connection){

    var sqlForSelectList = "select seller_type, seller_name, seller_tell, seller_img from seller where seller_type=?";
    connection.query(sqlForSelectList,[name], function (err, rows){
      if(err) console.error("err : "+err);
      console.log("rows : " + JSON.stringify(rows));

      res.render('list', {rows: rows, session:req.session});
      connection.release();
    });
  });
});


module.exports = router;
