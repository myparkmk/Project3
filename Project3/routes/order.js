var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit: 5,
  host: 'localhost',
  user: 'root',
  database: 'seproject',
  password: '1234'
});

function leadingZeros(n, digits) {
  var zero="";
  n = n.toString();

  if(n.length<digits){
    for(i=0;i<digits - n.length;i++)
      zero += '0';
  }
  return zero + n;
}

router.get('/:name', function(req, res, next){

  var name = req.params.name; //seller_name
  var code = "(";
  var m_quant = new Array();

  var id="('"+req.session.user+"')";
  console.log(req.query);
  console.log(req.query.menu);
  console.log(req.session.user_id);
  var x = JSON.stringify(req.query);
  console.log(x);
  console.log(JSON.parse(x));

  for(i=0;i<req.query.numofmenu;i++)
  {
    code += req.query.code[i];
    if(i!=req.query.numofmenu-1)
      code += ",";

    m_quant.push(req.query.menu[i]);
    m_quant.push(req.query.quant[i]);
  }
  code +=")";
  console.log("code : " + code);

  console.log("name : " + name);

  pool.getConnection(function (err, connection){

    var sqlList = "select * from menu where menu_code in"+code+";";
    console.log(sqlList);

    connection.query(sqlList, function(err,row1){
      if(err) console.error("err : " + err);

      console.log("menu : " + row1);
      var sql2 = "select * from user where user_id in"+id+";";
      connection.query(sql2, function(err2,row2){
        if(err2) console.error("err :" + err2);

        //var uid = row2[0].user_id;
        console.log(row2);
        if(row2 == ""){
          console.log('failed');
          res.redirect('back');
        }else {
            console.log(row2[0].user_id);
            console.log("user : " + row2);
            res.render('order',{seller_name:name, row1:row1, m_quant:m_quant, row2:row2, session:req.session});
        }
        connection.release();
      });
    });
  });
});


router.post('/', function(req, res, next){
  var selname = req.body.selname;
  var user_id = req.session.user;
  var tel = req.body.tel;
  var addr = req.body.addr;
  var etc = req.body.etc;
  var m_length = req.body.m_length;
  var ord_sum = req.body.ord_sum;
  var final_sum = req.body.final_sum;
  var m_code;
  var quantity;
  var data;

  console.log(req.body.m_code);

  //m_code & quantity value would be stored in JSON.stringify type
  //so this would be changed by JSON.parse(m_code) into JSON object type
  m_code = '{"code":[';
  quantity = '{"quantity":[';

  for(i=0;i<m_length;i++)
  {
    m_code+='"'+req.body.m_code[i]+'"';
    quantity+='"'+req.body.quantity[i]+'"';
    if(i!==m_length-1)
    {
      m_code+=",";
      quantity+=",";
    }
  }
  m_code+="]}";
  quantity+="]}";
  console.log(m_code);
  console.log(quantity);

  var date = new Date();
  var year = leadingZeros(date.getFullYear(), 4);
  var month = leadingZeros(date.getMonth()+1, 2);
  var day = leadingZeros(date.getDate(), 2);
  var cur_date =
    year+"-"+
    month+"-"+
    day+" "+
    leadingZeros(date.getHours(),2)+":"+
    leadingZeros(date.getMinutes(),2)+":"+
    leadingZeros(date.getSeconds(),2);

  console.log(cur_date);

  data = [user_id, m_code, cur_date, addr, tel, quantity, etc, year, month, day, ord_sum, 0, final_sum, selname];
  console.log(data);
  pool.getConnection(function(err,connection){
      var sql = "insert into ord(user_id, menu_code, order_date, order_addr, client_tel, quantity, etc, order_year, order_month, order_day, order_sum, discount, final_sum, seller_name) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
      connection.query(sql, data, function(err,row){
        if(err) console.error("err : " + err);

        connection.query("select LAST_INSERT_ID() from ord", function(err2,row2){
          if(err2) console.error("err2 : "+err2);

          var x = row2[0]['LAST_INSERT_ID()'];
          console.log(row2[0]['LAST_INSERT_ID()']);
          res.redirect('/order/aft_order/'+x);
          connection.release();
        })

        /*var sql2 = "select * from ord where order_date in('"+cur_date+"');"
        connection.query(sql, cur_date, function(err2,row2){
          if(err2) console.error("err2 : " + err2);
          console.log(row2);

          res.redirect('order_list/:'+row2[0].order_num);
        });*/

    });
  });
});

router.get('/aft_order/:num', function(req, res, next){
  var num = req.params.num;
  
  res.render('aft_order',{order_num:num,session:req.session});
});

module.exports = router;
