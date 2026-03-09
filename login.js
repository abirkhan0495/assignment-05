const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const errorText = document.getElementById("error");

loginBtn.addEventListener("click", function () {
 
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  
  if (username === "admin" && password === "admin123") {
    
    errorText.classList.add("hidden");
    window.location.href = "main.html";
  } else {
   
    errorText.classList.remove("hidden");
  }
});

passwordInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    loginBtn.click();
  }
});