// js/signin.js

const forms = document.querySelector(".forms"),
  pwShowHide = document.querySelectorAll(".eye-icon"),
  links = document.querySelectorAll(".link");

// Password show/hide toggle
pwShowHide.forEach(eyeIcon => {
  eyeIcon.addEventListener("click", () => {
    let pwFields = eyeIcon.parentElement.parentElement.querySelectorAll(".password");
    
    pwFields.forEach(password => {
      if (password.type === "password") {
        password.type = "text";
        eyeIcon.classList.replace("bx-hide", "bx-show");
        return;
      }
      password.type = "password";
      eyeIcon.classList.replace("bx-show", "bx-hide");
    });
  });
});

// Toggle between login and signup forms
links.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault(); // Prevent default link behavior
    forms.classList.toggle("show-signup");
  });
});

// Additionally, add the AJAX form submission handlers to the same file

// Login form submission
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Clear previous error messages
    const loginEmailError = document.getElementById("loginEmailError");
    const loginPasswordError = document.getElementById("loginPasswordError");
    if (loginEmailError) loginEmailError.textContent = "";
    if (loginPasswordError) loginPasswordError.textContent = "";

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
      if (loginEmailError) loginEmailError.textContent = "Email and password are required.";
      return;
    }
    if (password.length < 6) {
      if (loginPasswordError) loginPasswordError.textContent = "Password must be at least 6 characters.";
      return;
    }

    try {
      const res = await fetch("login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (loginPasswordError) loginPasswordError.textContent = data.error || "Login failed.";
      } else {
        // Redirect on successful login
        window.location.href = "../newpeice/index.html";
      }
    } catch (error) {
      if (loginPasswordError) loginPasswordError.textContent = "Network error. Please try again.";
    }
  });
}

// Signup form submission
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Clear previous error messages
    const errorFields = [
      "signupEmailError",
      "signupPasswordError",
      "signupConfirmPasswordError",
      "signupUsernameError"
    ];
    errorFields.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = "";
    });

    const email = document.getElementById("signupEmail").value.trim();
    const username = document.getElementById("signupUsername").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirm = document.getElementById("signupConfirmPassword").value;

    if (!email) {
      const el = document.getElementById("signupEmailError");
      if (el) el.textContent = "Email is required.";
      return;
    }
    if (username.length < 3) {
      const el = document.getElementById("signupUsernameError");
      if (el) el.textContent = "Username must be at least 3 characters.";
      return;
    }
    if (password.length < 6) {
      const el = document.getElementById("signupPasswordError");
      if (el) el.textContent = "Password must be at least 6 characters.";
      return;
    }
    if (password !== confirm) {
      const el = document.getElementById("signupConfirmPasswordError");
      if (el) el.textContent = "Passwords do not match.";
      return;
    }

    try {
      const res = await fetch("signup.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.field) {
          const errorEl = document.getElementById(data.field + "Error");
          if (errorEl) errorEl.textContent = data.error;
          else alert(data.error);
        } else {
          alert(data.error || "Signup failed.");
        }
      } else {
        alert("Signup successful! Please log in.");
        // Switch back to login form
        forms.classList.remove("show-signup");
      }
    } catch (error) {
      alert("Network error. Please try again later.");
    }
  });
}
