(() => {
  const form = document.getElementById("login-form");
  if (!form) return;

  const contact = form.querySelector("#login_contact");
  const password = form.querySelector("#login_password");
  const errorMap = Array.from(form.querySelectorAll(".error-text")).reduce(
    (acc, el) => {
      const key = el.getAttribute("data-for");
      if (key) acc[key] = el;
      return acc;
    },
    {},
  );

  const showError = (key, msg) => {
    if (!errorMap[key]) return;
    errorMap[key].textContent = msg || "";
  };

  const markInvalid = (el, on) => {
    if (!el) return;
    el.classList.toggle("invalid", Boolean(on));
  };

  const validateContact = () => {
    const value = contact.value.trim();
    if (!value) {
      showError("login_contact", "Email or phone is required.");
      markInvalid(contact, true);
      return false;
    }
    const hasLetters = /[A-Za-z]/.test(value);
    if (hasLetters) {
      const emailOk = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
        value,
      );
      if (!emailOk) {
        showError("login_contact", "Invalid email.");
        markInvalid(contact, true);
        return false;
      }
    } else {
      const phoneOk = /^[6-9][0-9]{9}$/.test(value);
      if (!phoneOk) {
        showError("login_contact", "Invalid phone number.");
        markInvalid(contact, true);
        return false;
      }
    }
    showError("login_contact", "");
    markInvalid(contact, false);
    return true;
  };

  const validatePassword = () => {
    if (!password.value) {
      showError("login_password", "Password is required.");
      markInvalid(password, true);
      return false;
    }
    showError("login_password", "");
    markInvalid(password, false);
    return true;
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const ok = validateContact() & validatePassword();
    if (!ok) return;

    const users = JSON.parse(localStorage.getItem("signup_users") || "[]");
    const key = contact.value.trim().toLowerCase();
    const user = users.find(
      (u) => String(u.contact).toLowerCase() === key,
    );

    if (!user || String(user.password) !== String(password.value)) {
      showError("login_contact", "User not found.");
      showError("login_password", "User not found.");
      markInvalid(contact, true);
      markInvalid(password, true);
      alert("User not found.");
      contact.focus();
      return;
    }

    alert("Login successful!");
    form.reset();
  });

  contact.addEventListener("input", validateContact);
  password.addEventListener("input", validatePassword);
})();
