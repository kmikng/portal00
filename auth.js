function login() {
  localStorage.setItem("authenticated", "true");
  render();
}

function render() {
  const isAuth = localStorage.getItem("authenticated") === "true";
  document.getElementById("login").style.display = isAuth ? "none" : "block";
  document.getElementById("content").style.display = isAuth ? "block" : "none";
}

document.addEventListener("DOMContentLoaded", render);
