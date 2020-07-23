const log = document.getElementById('login')
const reg = document.getElementById('register')
const btn = document.getElementById('homebtn')
const logbtn = document.getElementById('log')
const regbtn = document.getElementById('reg')



function register() {
  log.style.left="-400px";
    reg.style.left="50px";
    btn.style.left = "110px";
    regbtn.style.color = 'white';
      logbtn.style.color = 'black';
}

function login() {
  log.style.left="";
    reg.style.left="";
    btn.style.left = "";
    regbtn.style.color = 'black';
    logbtn.style.color = 'white';
}
