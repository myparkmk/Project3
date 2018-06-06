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
    password: 'qktmxj011'
});

router.get('/', function (req, res, next) {
    res.render('ceo_signup');
});

router.post('/', function (req, res, next) {
    var team_id = req.session.user;
    var team_name = req.body.team_name;
    var team_pass = req.body.team_pass;
    var team_genre = req.body.team_genre;
    var team_intro = req.body.team_intro;
    var team_mail = req.body.team_mail;
    var team_phone0 = req.body.team_phone0;
    var team_phone1 = req.body.team_phone1;
    var team_phone2 = req.body.team_phone2;
    var team_phone = team_phone0 + team_phone1 + team_phone2;
    var etc = req.body.etc;

    var datas = [team_id, team_name, team_pass,  team_genre, team_intro, team_mail, team_phone, etc];

    console.log('datas : ' + datas);
    pool.getConnection(function (err, connection) {
        var sqlForInsertMember = "insert into team(team_id, team_name, team_pass, team_genre, team_intro, team_mail,team_phone, etc) values(?,?,?,?,?,?,?,?)";
        connection.query(sqlForInsertMember, datas, function (err, rows) {
            if (err){
                console.error("err : " + err);
                res.send("<script>alert('이미 관리하는 공연팀이 존재합니다.');history.back();</script>")
            }else{
                console.log("rows: " + JSON.stringify(rows));

                res.redirect('/ceo')
                connection.release();
            }
        });
    });
});

module.exports = router;
