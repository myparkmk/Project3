var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit : 5,
    host : 'localhost',
    user : 'root',
    database : 'test',
    password : ''
});
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    team_id = req.session.user;

    console.log("team_id :", team_id);

    pool.getConnection(function(err, con){
        if(err) console.error("커넥션 객체 얻어오기 에러 : ", err);

        var sql = "select team_name, team_pass, team_genre, team_intro, team_mail, team_phone,etc from team where team_id=?";
        con.query(sql, [team_id], function(err, rows){
            if(err) console.error(err);
            console.log("ceo_teammanage 에서 1개 글 조회 결과 확인 : ", rows);
            res.render('ceo_teammanage', {title:"team management", row:rows[0]});
            con.release();
        });
    });
});
module.exports = router;
