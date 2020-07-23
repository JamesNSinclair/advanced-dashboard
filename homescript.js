const log = document.getElementById('login')
const reg = document.getElementById('register')
const btn = document.getElementById('homebtn')
const submit = document.getElementById('enterlogin')
const register = document.getElementById('enterRegister')

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
