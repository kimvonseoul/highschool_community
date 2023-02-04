module.exports = {
    HTML:function(title, list, body, form, control){
      return `
      <!doctype html>
      <html lang="ko">
      <head>
        <title>동성인친목회 - ${title}</title>
        <link rel="stylesheet" href="/main.css" />  
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
                <div id="texts">${body}</div>
                <div class="forms">${form}</div>
            </div>            
            ${control}
        </article>
        <hr id = after_article_hr>
        <div id = "lists">
            <h3><a href="/posts">목록</a></h3>
            ${list}
        </div>
        </section>
        <script src="/script.js"></script>
      </body>
      </html>
      `;
    } , list:function(filelist){
        var list = '<ul>';
        var i = 0;
        while(i < filelist.length){
          list = list + `<li><a href="/posts/${filelist[i]}">${filelist[i]}</a></li><hr>`;
          i = i + 1;
        }
        list = list+'</ul>';
        return list;
    }
}