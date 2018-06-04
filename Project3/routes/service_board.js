var express = require('express');
var router = express.Router();
// My sql
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 5,
    host : 'localhost',
    user : 'root',
    database : 'test',
    password : ''
});

/* GET users listing. */

router.get('/', function(req, res, next) {
	console.log('service');
  	res.redirect('/service_board/service_board_list/1');
});


router.get('/service_board_list/:page',function(req,res,next){

	pool.getConnection(function(err,connection){
		var sqlForSelectlist = "SELECT idx, creator_id, title, hit FROM board";
		connection.query(sqlForSelectlist,function(err,rows){
		if(err) console.error("err: " + err);
		console.log("rows : " + JSON.stringify(rows));

		res.render('service_board_list', {title: '게시판 전체 틀 조회',rows: rows});
		connection.release();
	});
});
});

router.get('/service_read/:idx',function(req,res,next)
{
	var idx = req.params.idx;

	pool.getConnection(function(err,connection)
	{
		var sql = "select idx, creator_id, title, content, hit from board where idx=?";
		connection.query(sql,[idx],function(err,row)
		{
			if(err) console.error(err);
			console.log("1개 글 조회 결과 확인 : ",row);
			res.render('service_read',{title:"글 조회",row:row[0]});
			connection.release();
		});
	});
});


module.exports = router;
