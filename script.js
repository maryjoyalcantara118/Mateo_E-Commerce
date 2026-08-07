document.addEventListener("DOMContentLoaded", () => {
  let isSignUpMode = false;

  const authForm = document.getElementById("authForm");
  const formTitle = document.getElementById("formTitle");
  const avatarIcon = document.getElementById("avatarIcon");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const confirmPasswordGroup = document.getElementById("confirmPasswordGroup");
  const loginActions = document.getElementById("loginActions");
  const submitBtn = document.getElementById("submitBtn");
  const switchAuthMode = document.getElementById("switchAuthMode");
  const toggleText = document.getElementById("toggleText");
  const alertBox = document.getElementById("alert");
  const toggleButtons = document.querySelectorAll(".toggle-btn");
  const forgotPasswordLink = document.getElementById("forgotPassword");

  switchAuthMode.addEventListener("click", (e) => {
    e.preventDefault();
    isSignUpMode = !isSignUpMode;
    alertBox.className = "alert hidden";
    authForm.reset();

    if (isSignUpMode) {
      formTitle.textContent = "USER SIGN UP";
      avatarIcon.className = "fa-solid fa-user-plus";
      confirmPasswordGroup.classList.remove("hidden");
      loginActions.classList.add("hidden");
      submitBtn.textContent = "SIGN UP";
      toggleText.textContent = "Already have an account?";
      switchAuthMode.textContent = "Log In";
      emailInput.placeholder = "Enter your chosen username";
      passwordInput.placeholder = "Choose a strong password";
    } else {
      formTitle.textContent = "USER LOGIN";
      avatarIcon.className = "fa-solid fa-user";
      confirmPasswordGroup.classList.add("hidden");
      loginActions.classList.remove("hidden");
      submitBtn.textContent = "LOGIN";
      toggleText.textContent = "Don't have an account?";
      switchAuthMode.textContent = "Sign Up";
      emailInput.placeholder = "Enter username or email";
      passwordInput.placeholder = "Enter password";
    }
  });

  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const targetInput = document.getElementById(targetId);
      const isPassword = targetInput.getAttribute("type") === "password";

      targetInput.setAttribute("type", isPassword ? "text" : "password");
      btn.textContent = isPassword ? "Hide" : "Show";
    });
  });

  forgotPasswordLink.addEventListener("click", (e) => {
    e.preventDefault();
    const emailValue = emailInput.value.trim();

    if (!emailValue) {
      showAlert("Please enter your username or email first.", "error");
      emailInput.focus();
      return;
    }

    const recoveredPassword = localStorage.getItem("savedPassword") || "Password123!";
    showAlert(`Your password is: ${recoveredPassword}`, "success");
  });

  authForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value;
    const confirmPasswordValue = confirmPasswordInput.value;

    alertBox.className = "alert hidden";

    if (!emailValue) {
      showAlert("Please enter your username or email.", "error");
      emailInput.focus();
      return;
    }

    if (!passwordValue) {
      showAlert("Please enter a password.", "error");
      passwordInput.focus();
      return;
    }

    if (passwordValue.length < 6) {
      showAlert("Password must be at least 6 characters.", "error");
      passwordInput.focus();
      return;
    }

    if (isSignUpMode) {
      if (passwordValue !== confirmPasswordValue) {
        showAlert("Passwords do not match.", "error");
        confirmPasswordInput.focus();
        return;
      }

      showAlert("Account created successfully! Switching to Login...", "success");
      localStorage.setItem("savedPassword", passwordValue);

      setTimeout(() => {
        switchAuthMode.click();
      }, 1500);

    } else {
      showAlert("Login successful!", "success");
    }
  });

  function showAlert(message, type) {
    alertBox.textContent = message;
    alertBox.className = `alert ${type}`;
  }
});