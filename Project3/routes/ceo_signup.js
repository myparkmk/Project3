var express = require('express');
var router = express.Router();
var path = require('path');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var fs = require('fs');

var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 5,
    host : 'localhost',
    user : 'root',
    database : 'seproject',
    password : '1234'
});

router.get('/', function(req, res, next){
  res.render('ceo_signup');
});

router.post('/', multipartMiddleware, function(req, res, next){

  var SELLER_ID = req.body.SELLER_ID;
  var SELLER_PASSWD = req.body.SELLER_PASSWD;
  var SELLER_TYPE = req.body.SELLER_TYPE;
  var SELLER_NAME = req.body.SELLER_NAME;
  var tel1 = req.body.tel1;
  var tel2 = req.body.tel2;
  var tel3 = req.body.tel3;
  var SELLER_TELL = tel1+tel2+tel3;
  var phone1 = req.body.seller_phone1;
  var phone2 = req.body.seller_phone2;
  var phone3 = req.body.seller_phone3;
  var SELLER_PHONE = phone1+phone2+phone3;
  var SELLER_ADDRESS = req.body.SELLER_ADDRESS;
  console.log(req.files);
  var SELLER_IMG = req.files.img.name;

  console.log(req.files.img);
  console.log(req.files.img.name);

  fs.readFile(req.files.img.path, function(err, data){
    var filepath = './public/images/업소 대표사진/'+SELLER_TYPE+'/'+req.files.img.name;
    console.log(filepath);
    fs.writeFile(filepath,data,function(err){
      if(err) console.error("err : " + err);
    });
  });

  var datas = [SELLER_ID, SELLER_PASSWD, SELLER_TYPE, SELLER_NAME, SELLER_TELL, SELLER_PHONE, SELLER_ADDRESS, SELLER_IMG];

  pool.getConnection(function (err, connection)
  {
    var sqlForInsertMember = "insert into seller(seller_id, seller_passwd, seller_type, seller_name, seller_tell, seller_phone, seller_addr, seller_img) values(?,?,?,?,?,?,?,?)";
    connection.query(sqlForInsertMember, datas, function(err, rows){
        if(err) console.error("err : " + err);
        console.log("rows: " + JSON.stringify(rows));

        res.redirect('/ceo')
        connection.release();
      });
    });
});

module.exports = router;
