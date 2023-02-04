'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var fs = require('fs');
var qs = require('querystring');
var posts_template = require('../lib/posts_template.js');

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
  var time2 = `${year}년 ${month}월 ${date}일 ${hour}:${minute}`;
  return time2;
}
var client = mysql.createConnection({
  user: 'root',
  password: 'kjh3221@',
  multipleStatements: true
});
client.query('USE dongsung');

router.get('/', function(req, res) {
  var sql = `select * from posts`;
  client.query(sql, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      var title = '게시판';
      var list = posts_template.list(result);
      var html = posts_template.HTML(title, list, '관리자', '2022.03.01', '글을 작성해주세요.', '', `
      <div id="write_button" class="button_form"><a href="/posts/create" class="btn_a">글쓰기</a></div>
      `);
      //console.log(result.length);
      res.send(html);
    }
  });
});

router.get(`/create`, function(req, res) {
  var sql = `select * from posts; `;
  client.query(sql, function(err, result) {
    var title = '게시판-글작성';
    var name = req.cookies.loginId;
    if (name == undefined) {
      name = '익명';
    }
    var list = posts_template.list(result);
    var html = posts_template.HTML(title, list, name, '', '', `
      <form action="/posts/create_process" method="post">
        <p><input type="text" name="title" placeholder="제목" class="input_title"></p>
        <p>
          <textarea name="description" placeholder="이곳에 글을 작성해주세요." class="input_text"></textarea>
        </p>
        <div>
          <input type="submit" id="submit_button">
        </div>
      </form>
    `, '');
    res.send(html);
  });
});

router.post(`/create_process`, function(req, res){
  var body = req.body;
  var name = req.cookies.loginId;
  if (name == undefined) {
    name = '익명';
  }
  var title = body.title;
  if(title == '') {
    title = 'untitle';
  }
  var description = body.description;
  if (description == '') {
    description = '.';
  }
  client.query('insert into posts (name, title, text, time) values (?, ?, ?, ?); SET @count=0; UPDATE posts SET id=@count:=@count+1;', [
    name, title, description, setTime()
  ], function() {
    res.redirect('/posts');
  });
});
router.get('/update/:id', function(req, res){
  var postId = req.params.id;
  var checkIsNan = isNaN(postId);
  var sql = `select * from posts;`;
  client.query(sql, function(err, result) {
    if (postId > result.length || postId < 1 || checkIsNan == true) {
      res.redirect('/posts'); 
    } else {
      var title = result[postId -1].title;
      var text = result[postId - 1].text;
      var name = result[postId - 1].name;
      var time = getTime(result[postId - 1].time);
      var list = posts_template.list(result);
      var html = posts_template.HTML(title, list, name, time, '', `
        <form method="post">
          <p><input type="text" name="title" placeholder="${title}" class="input_title" value="${title}"></p>
          <p>
            <textarea name="description" placeholder="${text}" class="input_text">${text}</textarea>
          </p>
          <div>
            <input type="submit" id="submit_button">
          </div>
        </form>
      `, '');
  
      if (req.cookies.loginId == result[postId - 1].name) {
        res.send(html);
      } else {
        //res.write("<script>alert('본인 글만 수정할 수 있습니다.')</script>");
        res.send("<script>alert('본인 글만 수정할 수 있습니다.'); window.location.href = '/posts'; </script>");
      }
    }
  });

});
//SET @count=0; UPDATE posts SET id=@count:=@count+1;
router.post('/update/:id', function(req, res){
  var body = req.body;
  var postId = req.params.id;
  var title = body.title + '(수정됨)';
  var text = body.description;
  if (text = '') {
    text = '.';
  }
  //var postId = body.id;
  var sql = `update posts set title=?, text=? where id=?`;
  client.query(sql, [title, text, postId], function(err, result) {
    if (err) {
      console.log(err);
    } else {
      res.redirect(`/posts/${postId}`);
    }
    
  });
});
router.get('/delete_process/:id', function(req, res) {
  var postId = req.params.id
  var sql = `select * from posts where id=?`;
  client.query(sql, [postId], function(err, result) {
    if (err) {
      console.log(err);
      res.redirect('/');
    } else {
      if ( req.cookies.loginId == result[0].name || req.cookies.loginId == 'admin' ) {
        res.send(`<script>if(!confirm("정말 삭제하시겠습니까?")){window.location.href = '/posts'} else {window.location.href = '/posts/delete/${postId}'}</script>`);
      } else {
        res.send("<script>alert('본인 글만 삭제할 수 있습니다.'); window.location.href = '/posts';</script>")
      }
    }
  });
  
});
router.get('/delete/:id', function(req, res) {
  //console.log(result.id);
  var postId = req.params.id;
  client.query('delete from posts where id=?; SET @count=0; UPDATE posts SET id=@count:=@count+1;', [postId], function() {
    res.redirect('/posts');
  });
});
router.get('/:id', function(req, res) {
  var postId = req.params.id;
  var checkIsNan = isNaN(postId);
  var sql = `select * from posts`;
  client.query(sql, function(err, result) {
    if (err) {
      console.log(err);
    } 
    if (postId > result.length || postId < 1 || checkIsNan == true) {
      res.redirect('/posts');
    } else {
      var title = result[postId - 1].title;
      var author = result[postId - 1].name;
      var date = result[postId - 1].time;
      var dateTime = getTime(date);
      var description = result[postId - 1].text;
      var list = posts_template.list(result);
      var html = posts_template.HTML(title, list, author, dateTime, description, '', `
      <div id="write_button" class="button_form"><a href="/posts/create" class="btn_a">글쓰기</a></div>
      <div id="del_button" class="button_form"><a href="/posts/delete_process/${postId}" class="btn_a">글삭제</a></div>
      <div id="rewrite_button" class="button_form"><a href="/posts/update/${postId}" class="btn_a">글수정</a></div>
      `);
      res.send(html);
    }
  });
});

module.exports = router;