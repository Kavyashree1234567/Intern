(() => {
  const form = document.getElementById("signup-form");
  if (!form) return;

  const $ = (sel) => form.querySelector(sel);
  const $$ = (sel) => Array.from(form.querySelectorAll(sel));

  const fields = {
    firstName: $("#first_name"),
    lastName: $("#last_name"),
    contact: $("#contact"),
    password: $("#password"),
    birthDay: $("#birth_day"),
    birthMonth: $("#birth_month"),
    birthYear: $("#birth_year"),
    genderInputs: $$("input[name='gender']"),
    genderRow: $(".gender-row"),
  };

  const errorMap = $$(".error-text").reduce((acc, el) => {
    const key = el.getAttribute("data-for");
    if (key) acc[key] = el;
    return acc;
  }, {});

  const showError = (key, msg) => {
    if (!errorMap[key]) return;
    errorMap[key].textContent = msg || "";
  };

  const markInvalid = (el, on) => {
    if (!el) return;
    el.classList.toggle("invalid", Boolean(on));
  };

  const validateName = (el, label) => {
    if (!el.value.trim()) {
      showError(el.id, `${label} is required.`);
      markInvalid(el, true);
      return false;
    }
    if (el.validity.patternMismatch) {
      showError(el.id, `${label} must contain only letters.`);
      markInvalid(el, true);
      return false;
    }
    showError(el.id, "");
    markInvalid(el, false);
    return true;
  };

  const validateContact = (el) => {
    const value = el.value.trim();
    if (!value) {
      showError(el.id, "Mobile number or email is required.");
      markInvalid(el, true);
      return false;
    }
    const hasLetters = /[A-Za-z]/.test(value);
    if (hasLetters) {
      const emailOk = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
        value,
      );
      if (!emailOk) {
        showError(el.id, "Invalid email.");
        markInvalid(el, true);
        return false;
      }
    } else {
      const phoneOk = /^[6-9][0-9]{9}$/.test(value);
      if (!phoneOk) {
        showError(el.id, "Invalid phone number.");
        markInvalid(el, true);
        return false;
      }
    }
    showError(el.id, "");
    markInvalid(el, false);
    return true;
  };

  const validatePassword = (el) => {
    if (!el.value) {
      showError(el.id, "Password is required.");
      markInvalid(el, true);
      return false;
    }
    if (el.validity.patternMismatch) {
      showError(
        el.id,
        "Password must be 6-8 chars and include 1 uppercase letter.",
      );
      markInvalid(el, true);
      return false;
    }
    showError(el.id, "");
    markInvalid(el, false);
    return true;
  };

  const monthIndexFrom = (value) => {
    const months = {
      jan: 0,
      january: 0,
      feb: 1,
      february: 1,
      mar: 2,
      march: 2,
      apr: 3,
      april: 3,
      may: 4,
      jun: 5,
      june: 5,
      jul: 6,
      july: 6,
      aug: 7,
      august: 7,
      sep: 8,
      sept: 8,
      september: 8,
      oct: 9,
      october: 9,
      nov: 10,
      november: 10,
      dec: 11,
      december: 11,
    };
    const key = String(value).trim().toLowerCase();
    return Object.prototype.hasOwnProperty.call(months, key)
      ? months[key]
      : null;
  };

  const daysInSelectedMonth = () => {
    const monthIndex = monthIndexFrom(fields.birthMonth?.value);
    const yearNum = Number(fields.birthYear?.value);
    if (monthIndex === null || !Number.isInteger(yearNum)) return 31;
    return new Date(yearNum, monthIndex + 1, 0).getDate();
  };

  const syncDayOptions = () => {
    const daySelect = fields.birthDay;
    if (!daySelect) return;

    const currentDay = Number(daySelect.value) || 1;
    const maxDays = daysInSelectedMonth();
    const nextDay = Math.min(currentDay, maxDays);

    daySelect.innerHTML = "";
    for (let day = 1; day <= maxDays; day += 1) {
      const option = document.createElement("option");
      option.value = String(day);
      option.textContent = String(day);
      daySelect.appendChild(option);
    }
    daySelect.value = String(nextDay);
  };

  const validateDob = () => {
    const day = fields.birthDay?.value;
    const month = fields.birthMonth?.value;
    const year = fields.birthYear?.value;
    if (!day || !month || !year) {
      showError("dob", "Date of birth is required.");
      markInvalid(fields.birthDay, true);
      markInvalid(fields.birthMonth, true);
      markInvalid(fields.birthYear, true);
      return false;
    }

    const monthIndex = monthIndexFrom(month);
    if (monthIndex === null) {
      showError("dob", "Select a valid birth month.");
      markInvalid(fields.birthDay, true);
      markInvalid(fields.birthMonth, true);
      markInvalid(fields.birthYear, true);
      return false;
    }

    const dayNum = Number(day);
    const yearNum = Number(year);
    const daysInMonth = daysInSelectedMonth();
    if (!Number.isInteger(dayNum) || dayNum < 1 || dayNum > daysInMonth) {
      showError("dob", "Invalid day for selected month.");
      markInvalid(fields.birthDay, true);
      markInvalid(fields.birthMonth, true);
      markInvalid(fields.birthYear, true);
      return false;
    }

    const birthDate = new Date(yearNum, monthIndex, dayNum);
    if (Number.isNaN(birthDate.getTime())) {
      showError("dob", "Select a valid date of birth.");
      markInvalid(fields.birthDay, true);
      markInvalid(fields.birthMonth, true);
      markInvalid(fields.birthYear, true);
      return false;
    }

    const today = new Date();
    const cutoff = new Date(
      today.getFullYear() - 13,
      today.getMonth(),
      today.getDate(),
    );
    if (birthDate > cutoff) {
      showError("dob", "You must be at least 13 years old.");
      markInvalid(fields.birthDay, true);
      markInvalid(fields.birthMonth, true);
      markInvalid(fields.birthYear, true);
      return false;
    }

    showError("dob", "");
    markInvalid(fields.birthDay, false);
    markInvalid(fields.birthMonth, false);
    markInvalid(fields.birthYear, false);
    return true;
  };

  const validateGender = () => {
    const selected = fields.genderInputs.some((g) => g.checked);
    if (!selected) {
      showError("gender", "Gender is required.");
      markInvalid(fields.genderRow, true);
      return false;
    }
    showError("gender", "");
    markInvalid(fields.genderRow, false);
    return true;
  };

  const validateAll = () =>
    validateName(fields.firstName, "First name") &
    validateName(fields.lastName, "Last name") &
    validateContact(fields.contact) &
    validatePassword(fields.password) &
    validateDob() &
    validateGender();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const ok = Boolean(validateAll());
    if (!ok) {
      const firstErrorKey = Object.keys(errorMap).find(
        (key) => errorMap[key]?.textContent,
      );
      if (firstErrorKey) {
        const target =
          form.querySelector(`#${firstErrorKey}`) ||
          (firstErrorKey === "dob"
            ? fields.birthDay
            : firstErrorKey === "gender"
              ? fields.genderInputs[0]
              : null);
        target?.focus();
      }
      return;
    }

    const user = {
      firstName: fields.firstName.value.trim(),
      lastName: fields.lastName.value.trim(),
      contact: fields.contact.value.trim(),
      password: fields.password.value,
      birthDay: fields.birthDay.value,
      birthMonth: fields.birthMonth.value,
      birthYear: fields.birthYear.value,
      gender: fields.genderInputs.find((g) => g.checked)?.value,
      createdAt: new Date().toISOString(),
    };

    const key = "signup_users";
    const users = JSON.parse(localStorage.getItem(key) || "[]");
    const contactKey = user.contact.toLowerCase();
    const existing = users.find(
      (u) => String(u.contact).toLowerCase() === contactKey,
    );

    if (existing) {
      if (String(existing.password) !== String(user.password)) {
        showError("password", "Password does not match this email/phone.");
        markInvalid(fields.password, true);
        fields.password.focus();
        return;
      }
      showError("contact", "Email or phone already registered.");
      markInvalid(fields.contact, true);
      fields.contact.focus();
      return;
    }

    users.push(user);
    localStorage.setItem(key, JSON.stringify(users));
    alert("Account created successful!");
    form.reset();
  });

  fields.firstName.addEventListener("input", () =>
    validateName(fields.firstName, "First name"),
  );
  fields.lastName.addEventListener("input", () =>
    validateName(fields.lastName, "Last name"),
  );
  fields.contact.addEventListener("input", () =>
    validateContact(fields.contact),
  );
  fields.password.addEventListener("input", () =>
    validatePassword(fields.password),
  );
  fields.birthDay.addEventListener("change", validateDob);
  fields.birthMonth.addEventListener("change", () => {
    syncDayOptions();
    validateDob();
  });
  fields.birthYear.addEventListener("change", () => {
    syncDayOptions();
    validateDob();
  });
  fields.genderInputs.forEach((g) =>
    g.addEventListener("change", validateGender),
  );

  syncDayOptions();
})();
