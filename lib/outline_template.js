module.exports = {
    HTML:function(title, list, author, date, body, form, control){
      return `
      <!doctype html>
      <html lang="ko">
      <head>
        <title>동성인친목회 - ${title}</title>
        <link rel="stylesheet" href="/main.css" />  
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta charset="utf-8">
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
                  <p id="posts_info">작성자 | ${author}   게시일 | ${date}</p>
                  <p>${body}</p>
                  <div">${list}</div>
                </div>
                <div class="forms">${form}</div>
            </div>            
            ${control}
        </article>
        </section>
        <script src="/script.js"></script>
      </body>
      </html>
      `;
    } , memberLists:function loadData (result) {
          
          var data = ` `
          var i = 1;
          while (i < result.length) {
            data = data + `<p>${result[i].name}</p>`
            i = i + 1;
          }
          return data;
    }
}