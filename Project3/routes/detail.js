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

    var show_name;
    var show_code;
    var user_name;
    var user_id;
    var user_tel;
    var user_mail;
    var user_code;
    var name;

router.get('/:name', function(req, res, next){

    name = req.params.name;
    show_name = name;

    console.log("name : " + name);

    var user = req.session.user;
    user_name = user;
    console.log("user : " + user);

    pool.getConnection(function (err, connection){

        var sqlForSelectList = "select team_id,show_name ,show_member, show_place, show_genre,show_start,show_end,show_intro,show_cost,etc,show_img,show_code  from seller where show_name=?";


        connection.query(sqlForSelectList,[name], function (err, rows){
            if(err) console.error("err : "+err);
            console.log("rows : " + JSON.stringify(rows));
            var item = rows[0];
            show_code = item.show_code;

            var sqlForSelectList2 = "select * from user where user_id = ?"
            connection.query(sqlForSelectList2,[user], function (err2, rows2){
                if(err2) console.error("err : "+err2);
                console.log("rows2 : " + JSON.stringify(rows2));

                var item = rows2[0];
                user_id = item.user_id;
                user_tel = item.user_tel;
                user_mail = item.user_mail;
                user_code = item.user_code;
                //console.log("rows2: ", user_id, user_tel, user_mail);
            });
            res.render('detail', {rows: rows, session:req.session});
            connection.release();
        });
    });
});

router.post('/:name', function(req, res, next){

    pool.getConnection(function (err, connection)
    {
        var sqlForInsertReserve = "insert into reserve(show_name,show_code,user_id,user_name,user_tel,user_mail,user_code) values(?,?,?,?,?,?,?)";

        datas=[show_name,show_code,user_id,user_name,user_tel,user_mail,user_code];

        connection.query(sqlForInsertReserve, datas, function(err, rows){
            if(err) console.error("err : " + err);
            console.log("rows: " + JSON.stringify(rows));

            res.send("<script>alert('예약되었습니다.');history.back();</script>")
            //res.redirect('/');

            connection.release();
        });

    });
});
module.exports = router;

router.post('list', function(req, res)
{
    var name = req.params.name;

    var select1 = req.body.select1;
    var select2 = req.body.select2;

    console.log(select1);
    console.log(select2);

    pool.getConnection(function(err, connection)
    {
        if(err) console.error("커넥션 객체 얻어오기 에러: ", err);

        if(select1 == "name"){
            select2 = "%" + select2 + "%"
            var sql = "select * from seller where show_name LIKE ?";
            console.log(select2);
        }
        else if(select1 == "place"){
            select2 = "%" + select2 + "%"
            var sql = "select * from seller where show_place LIKE ?";
        }
        else
            console.error("해당하는 공연이 존재하지 않습니다.");

        connection.query(sql, select2, function(err, rows)
        {
            if(err) console.log('	err', err);
            console.log('rows:', rows);

            res.render('list', {rows: rows, session:req.session});

            connection.release();

        });
    });
});