module.exports = {
    HTML:function(title, list, author, date, body, form, control){

      return `
      <!doctype html>
      <html lang="ko">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0 maximum-scale=1, minimum-scale=1">
        <link rel="stylesheet" href="/main.css" /> 
        <title>동성인친목회 - ${title}</title>
      </head>
      <body>
        <header id = "main_header">
            <hr id = "header_hr">
            <h1><a href="/">동성인친목회 비공식 홈페이지</a></h1>
        </header>
        <nav id = "gblnav">
            <hr id="nav_hr">
            <ul>
                <li><a href="/outline">개요</a></li>
                <li><a href="/his">연혁</a></li>
                <li><a href="/posts">게시판</a></li>
            </ul>
            <div id="login"><div id="login_name">익명 님, <a href="/login">login/out</a></div></div>
        </nav>
        <section id="mainpage">
        <article class="mainpage">
            <h2>${title}</h2>
            <hr id = in_article_hr>
            <div class="article_body">
                <div id="texts">
                  <p id="posts_info">작성자 | ${author}         게시일 | ${date}</p>
                  <p>${body}</p>
                </div>
                <div class="forms">${form}</div>
            </div>            
            ${control}
        </article>
        <hr id = after_article_hr>
        <div id = "lists">
            <h3><a href="/posts">목록</a></h3>
            <div>${list}</div>
        </div>
        </section>
        <script src="/script.js"></script>
      </body>
      </html>
      `;
    } , list:function loadData (result) {
          
          var data1 = `<div id="post_list"><div id="list_header">
          <div class="list_header">번호</div> 
          <div class="list_header">제목</div> 
          <div class="list_header">작성자</div> 
          <div class="list_header">최초작성일</div>
          </div><hr id="list_hr">
          <div id="list_line">
          `
          var data2 = `<table id="post_table">
          <tr id="table_head">
          <th id="post_number">번호</th> 
          <th id="post_title">제목</th> 
          <th id="post_author">작성자</th> 
          <th id="post_date">최초작성일</th>
          `
          
          var i = result.length - 1;
          while (i > -1) {
            function getTime () {
              var time = result[i].time;
              var year = time.getFullYear() - 2000;
              var month = time.getMonth() + 1;
              if (month < 10) {
                month = '0' + month;
              }
              var date = time.getDate();
              if (date < 10) {
                date = '0' + date;
              }
              var time2 = `${year}.${month}.${date}`;
              return time2;
            }
            var times = getTime();
            data1 = data1 + `<div class="list_line"><div class="posts_list list_number"> ${result[i].id}</div>  
            <div class="list_after_id"><div class="posts_list list_title"><a href="/posts/${result[i].id}">${result[i].title}</a></div>  
            <div class="posts_list list_author">${result[i].name}</div> <div class="list_middle"> | </div> 
            <div class="posts_list list_time">${times}</div></div>
            <hr>
            </div>`
            data2 = data2 + `<tr><td> ${result[i].id}</td>  
            <td><a href="/posts/${result[i].id}">${result[i].title}</a></td>  
            <td>${result[i].name}</td>  
            <td>${times}</td>
            </tr>`
            i = i - 1;
          }
          return data1 + `</div></div>` + data2 + `</table>`;
    }, idCheck: function idChecking (result) {
        var i = 0;
        while (i < result.length) {
          console.log(result);
        }
    }
}