const log = document.getElementById('login')
const reg = document.getElementById('register')
const btn = document.getElementById('homebtn')



function register() {
  log.style.left="-400px";
    reg.style.left="50px";
    btn.style.left = "110px";
}

function login() {
  log.style.left="";
    reg.style.left="";
    btn.style.left = "";
}
