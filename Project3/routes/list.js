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

  var name = req.params.name;
  console.log("name : " + name);
  pool.getConnection(function (err, connection){

    var sqlForSelectList = "select team_id,show_name ,show_member, show_place, show_genre,show_start,show_end,show_intro,show_cost,etc,show_img  from seller where show_genre=?";
    connection.query(sqlForSelectList,[name], function (err, rows){
      if(err) console.error("err : "+err);
      console.log("rows : " + JSON.stringify(rows));

      res.render('list', {rows: rows, session:req.session});
      connection.release();
    });
  });
});


router.post('/:name', function(req, res)
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




module.exports = router;
