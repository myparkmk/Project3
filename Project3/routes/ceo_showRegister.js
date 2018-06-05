var express = require('express');
var router = express.Router();
var path = require('path');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var fs = require('fs');

var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    database: 'test',
    password: 'dbsrn828'
});


var multer = require('multer');
//var upload = multer({dest:'uploads'})

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
var upload = multer({storage : storage});


router.get('/', function (req, res, next) {
    res.render('ceo_showRegister');
});

router.post('/',  upload.single('image'),function (req, res, next) {
    var team_id = req.session.user;
    var show_name = req.body.show_name;
    var show_member = req.body.show_member;
    var show_place = req.body.show_place;
    var show_genre = req.body.show_genre;
    var show_start = req.body.show_start;
    var show_end = req.body.show_end;
    var show_cost = req.body.show_cost
    var show_intro = req.body.show_intro;
    var etc = req.body.etc;
    var show_img = "/uploads/"+req.file.filename;
    var datas = [team_id, show_name, show_member,  show_place, show_genre, show_start, show_end,show_cost,show_intro,etc,show_img];

    console.log('datas : ' + datas);
    pool.getConnection(function (err, connection) {
        var sqlForInsertMember = "insert into seller(team_id, show_name, show_member,  show_place, show_genre, show_start, show_end,show_cost,show_intro,etc,show_img) values(?,?,?,?,?,?,?,?,?,?,?)";
        connection.query(sqlForInsertMember, datas, function (err, rows) {
            if (err){
                console.error("err : " + err);
                res.send("<script>alert('공연등록에 실패하였습니다.');history.back();</script>")
            }else{
                console.log("rows: " + JSON.stringify(rows));

                res.redirect('/ceo')
                connection.release();
            }
        });
    });
});

module.exports = router;
