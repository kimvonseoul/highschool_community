var express = require('express');
var router = express.Router();
var path = require('path');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var fs = require('fs');
var qs = require('querystring');
var outline_template = require('../lib/outline_template.js');


var client = mysql.createConnection({
    user: 'root',
    password: ' ', //password
    multipleStatements: true
  });
  client.query('USE dongsung');

router.get('/', function(req, res) {
    var title = '개요';
    var description = `
    <p>동성친인목회입니다.</p>
    <p><a href="/his">연혁</a></p>
    <p><a href="/outline/members">회원</a></p>
    <p><a href="/outline/rules">회칙</a></p>`;
    var html = outline_template.HTML(title, '', '관리자', '2022.03.01', 
      `${description}`, '', ''
    ); 
    res.send(html);
});

router.get('/members', function(req, res) { 
    console.log(req.cookies.loginId);
    client.query(`select name from users`, function(err, result) {
        var title = '회원';
        var description = `회원들입니다.`;
        var memberLists = outline_template.memberLists(result);
        var html = outline_template.HTML(title, memberLists, '관리자', '2022.03.01',
                     `${description}`, '', ''
    );
        if (err) {
            console.log(err);
            res.redirect('/');
        } else {
            res.send(html);
        }
    }); 
});
router.get('/rules', function(req, res) {
    var html = outline_template.HTML(`회칙`,``,`관리자`,`2022.03.01`,`준비중입니다.`,``, ``);
    res.send(html)
})

module.exports = router;