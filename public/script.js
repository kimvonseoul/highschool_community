
var id = document.cookie;
var replaced = id.replace('loginId=', '');

if (document.cookie == '') {
    document.getElementById('login_name').innerHTML = `익명님, <a href='/login'>login</a>`
} else {
    //let name = document.cookie.replace('loginId=', '') + `님, <a href='/login'>login</a>`
    document.getElementById('login_name').innerHTML = replaced + `님, <a href='/login'>logout</a>`
}
