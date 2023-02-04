var fs = require('fs');
var qs = require('querystring');
var express = require('express');
var app = express();
var template = require('./lib/template.js');
var posts_template = require('./lib/posts_template.js');
var postsRouter = require('./routes/posts');
var outlineRouter = require('./routes/outline');
var mysql = require('mysql');
var requestIp = require('request-ip');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var ejs = require('ejs');

/*
var client = mysql.createConnection({
  user: 'username',
  password: 'password',
  multipleStatements: true
});
client.query('USE dongsung');
client.query('select * from users', function(err, result, fields) {
  if (err) {
    console.log('error detected.');
  } else {
    console.log(result);
  }
});
*/
function setTime () {
  var time = new Date();
  var year = time.getFullYear();
  var month = time.getMonth() + 1;
  var date = time.getDate();
  var hour = time.getHours();
  var minute = time.getMinutes();
  var second = time.getSeconds();
  var time2 = `${year}-${month}-${date} ${hour}:${minute}:${second}`;
  return time2;
}
function getTime (time) {
  var year = time.getFullYear() - 2000;
  var month = time.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }
  var date = time.getDate();
  if (date < 10) {
    date = '0' + date;
  }
  var hour = time.getHours();
  if (hour < 10) {
    hour = '0' + hour;
  }
  var minute = time.getMinutes();
  if (minute < 10) {
    minute = '0' + minute;
  }
  /*var second = time.getSeconds();
  if (second < 10) {
    second = '0' + second;
  }*/
  var time2 = `${year}년${month}월${date}일 ${hour}:${minute}`;
  return time2;
}
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

app.get('/', function(req, res) {
    fs.readFile('page.html', 'utf-8', function(err, data) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
          console.log(req.cookies.loginId);
          console.log(setTime());
          console.log("client IP: " +requestIp.getClientIp(req));
          res.send(`${data}`);
        } 
    });
});
app.use('/outline', outlineRouter);

app.get('/his', function(req, res) {
    var title = '연혁';
    var description = `
    <p>2022.02.08 210키친마이야르방문준비위원회 창설</p>
    <p>2022.02.10 마이야르 회동</p>
    <p>2022.02.12 동성인친목회창립준비위원회</p>
    <p>2022.02.12 동성인친목회 디스코드 서버 개설</p>
    `;
    var html = template.HTML(title, '',
      `${description}`, '', ''
    ); 
    res.send(html);
});
app.use('/posts', postsRouter);

app.get('/login', function(req, res, next) {
  if (req.cookies.loginId!==undefined) {
    res.render('logout.ejs');
  } else {
    res.render('login.ejs');
  }
});

app.post('/loginAf', function (req, res, next) {
    var id = req.body.id;
    var pwd = req.body.pwd;
    var sql = 'select password from users where name=?'
    client.query(sql, id, function(err, result, fields) {
      if (err) {
        console.log('error detected.');
      } /* else {
        console.log(result);
        console.log(result[0].password);
      } */
      if (pwd == result[0].password) {
        res.cookie('loginId', req.body.id, {path:'/'});
        console.log('logined.');
        //console.log(req.cookies);
        res.redirect('/logined');
      } else {
        console.log('로그인 실패');
        res.redirect('/login');
      }
      //res.redirect('/logined');
    });
});
app.get('/logined', function(req, res) {
  var name = req.cookies.loginId;
  console.log(name);
  var html = `  
    <link rel="stylesheet" type="text/css" href="/main.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <header id = "main_header"><hr id = "header_hr"><h1><a href="/">동성인친목회 비공식 홈페이지</a></h1></header>
    <h1>${name}님, 반갑습니다!</h1><p><a href="/">home</a></p>`
  res.send(html);
})
app.post('/logout', function (req, res, next) {
  res.clearCookie('loginId').redirect('/');
});
app.get('/egg', function (req, res) {
  fs.readFile('easteregg.html', 'utf8', function (err, data) {
    res.send(data);
  });
});
app.get('/test', function(req, res) {
  fs.readFile('no.html', 'utf8', function (err, data) {
      res.send(html);
      //res.redirect('/')
    //res.send(data);
  });
});
app.listen(3000, function() {
    console.log("server running");
});
//진재현: 218.232.178.166 233.38.18.219