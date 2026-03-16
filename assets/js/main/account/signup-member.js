document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupMemberForm");

  const nameInput = document.getElementById("signupMemberName");
  const birthInput = document.getElementById("signupMemberBirth");
  const genderInputs = document.querySelectorAll('input[name="memberGender"]');
  const phoneInput = document.getElementById("signupMemberPhone");
  const authCodeInput = document.getElementById("signupMemberAuthCode");
  const userIdInput = document.getElementById("signupMemberUserId");
  const pwdInput = document.getElementById("signupMemberPwd");
  const pwdReInput = document.getElementById("signupMemberPwdRe");

  const nameBox = document.getElementById("signupMemberNameBox");
  const birthBox = document.getElementById("signupMemberBirthBox");
  const phoneBox = document.getElementById("signupMemberPhoneBox");
  const authBox = document.getElementById("signupMemberAuthBox");
  const userIdBox = document.getElementById("signupMemberUserIdBox");
  const pwdBox = document.getElementById("signupMemberPwdBox");
  const pwdReBox = document.getElementById("signupMemberPwdReBox");

  const sendBtn = document.getElementById("signupMemberSendBtn");
  const authBtn = document.getElementById("signupMemberAuthBtn");
  const pwdChkBtn = document.getElementById("signupMemberPwdChkBtn");

  const authErr = document.getElementById("signupMemberAuthErr");
  const authOk = document.getElementById("signupMemberAuthOk");
  const idErr = document.getElementById("signupMemberIdErr");
  const idOk = document.getElementById("signupMemberIdOk");
  const pwdErr = document.getElementById("signupMemberPwdErr");
  const pwdOk = document.getElementById("signupMemberPwdOk");

  const REGEX = {
    korean: /^[가-힣\s]+$/,
    birth: /^\d{6}$/,
    phone: /^\d{11}$/,
    auth: /^\d{6}$/,
    userId: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,20}$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,20}$/
  };

  const DEMO_AUTH_CODE = "123456";
  let smsRequested = false;
  let smsVerified = false;

  const hide = (element) => element && element.classList.remove("signup-member_msg_show");
  const show = (element) => element && element.classList.add("signup-member_msg_show");

  function clearMessagePair(errorEl, successEl) {
    hide(errorEl);
    hide(successEl);
  }

  function clearBoxState(box) {
    if (!box) return;
    box.classList.remove("signup-member_inpbox_err", "signup-member_inpbox_ok");
  }

  function setError(box, errorEl, successEl) {
    clearBoxState(box);
    box && box.classList.add("signup-member_inpbox_err");
    if (successEl) hide(successEl);
    if (errorEl) show(errorEl);
  }

  function setSuccess(box, successEl, errorEl) {
    clearBoxState(box);
    box && box.classList.add("signup-member_inpbox_ok");
    if (errorEl) hide(errorEl);
    if (successEl) show(successEl);
  }

  function fail({ message, input, box, errorEl = null, successEl = null, popup = false }) {
    setError(box, errorEl, successEl);
    if (popup) {
      alert(message);
      input && input.focus();
    }
    return false;
  }

  function pass({ box, successEl = null, errorEl = null }) {
    setSuccess(box, successEl, errorEl);
    return true;
  }

  function isGenderSelected() {
    return Array.from(genderInputs).some((radio) => radio.checked);
  }

  function validateName(popup = false) {
    const value = nameInput.value.trim();
    if (!value) {
      return fail({ message: "*표는 필수입력입니다", input: nameInput, box: nameBox, popup });
    }
    if (!REGEX.korean.test(value)) {
      return fail({ message: "이름은 한글로 입력해주세요", input: nameInput, box: nameBox, popup });
    }
    return pass({ box: nameBox });
  }

  function validateBirth(popup = false) {
    const value = birthInput.value.trim();
    if (!value) {
      return fail({ message: "*표는 필수입력입니다", input: birthInput, box: birthBox, popup });
    }
    if (!REGEX.birth.test(value)) {
      return fail({ message: "생년월일은 6자리 숫자로 입력해주세요", input: birthInput, box: birthBox, popup });
    }
    return pass({ box: birthBox });
  }

  function validateGender(popup = false) {
    if (!isGenderSelected()) {
      if (popup) {
        alert("*표는 필수입력입니다");
        genderInputs[0].focus();
      }
      return false;
    }
    return true;
  }

  function validatePhone(popup = false) {
    const value = phoneInput.value.trim();
    if (!value) {
      return fail({ message: "*표는 필수입력입니다", input: phoneInput, box: phoneBox, popup });
    }
    if (!REGEX.phone.test(value)) {
      return fail({ message: "전화번호는 숫자만 11자리로 입력해주세요", input: phoneInput, box: phoneBox, popup });
    }
    return pass({ box: phoneBox });
  }

  function validateAuthCodeFormat(popup = false) {
    const value = authCodeInput.value.trim();
    if (!value) {
      return fail({
        message: "*표는 필수입력입니다",
        input: authCodeInput,
        box: authBox,
        errorEl: authErr,
        successEl: authOk,
        popup
      });
    }
    if (!REGEX.auth.test(value)) {
      return fail({
        message: "인증번호는 숫자 6자리로 입력해주세요",
        input: authCodeInput,
        box: authBox,
        errorEl: authErr,
        successEl: authOk,
        popup
      });
    }
    clearBoxState(authBox);
    clearMessagePair(authErr, authOk);
    return true;
  }

  function validateUserId(popup = false) {
    const value = userIdInput.value.trim();
    if (!value) {
      return fail({
        message: "*표는 필수입력입니다",
        input: userIdInput,
        box: userIdBox,
        errorEl: idErr,
        successEl: idOk,
        popup
      });
    }
    if (!REGEX.userId.test(value)) {
      return fail({
        message: "아이디는 영어와 숫자의 조합으로 입력해주세요",
        input: userIdInput,
        box: userIdBox,
        errorEl: idErr,
        successEl: idOk,
        popup
      });
    }
    return pass({ box: userIdBox, successEl: idOk, errorEl: idErr });
  }

  function validatePassword(popup = false) {
    const value = pwdInput.value.trim();
    if (!value) {
      return fail({ message: "*표는 필수입력입니다", input: pwdInput, box: pwdBox, popup });
    }
    if (!REGEX.password.test(value)) {
      return fail({
        message: "비밀번호는 영어, 특수문자, 숫자의 조합으로 해주세요",
        input: pwdInput,
        box: pwdBox,
        popup
      });
    }
    return pass({ box: pwdBox });
  }

  function validatePasswordConfirm(popup = false) {
    const value = pwdReInput.value.trim();
    if (!value) {
      return fail({
        message: "*표는 필수입력입니다",
        input: pwdReInput,
        box: pwdReBox,
        errorEl: pwdErr,
        successEl: pwdOk,
        popup
      });
    }
    if (pwdInput.value.trim() !== value) {
      return fail({
        message: "비밀번호가 일치하지 않습니다",
        input: pwdReInput,
        box: pwdReBox,
        errorEl: pwdErr,
        successEl: pwdOk,
        popup
      });
    }
    return pass({ box: pwdReBox, successEl: pwdOk, errorEl: pwdErr });
  }

  function resetAuthState() {
    smsRequested = false;
    smsVerified = false;
    clearBoxState(authBox);
    clearMessagePair(authErr, authOk);
  }

  function resetPasswordConfirmState() {
    clearBoxState(pwdReBox);
    clearMessagePair(pwdErr, pwdOk);
  }

  function resetIdState() {
    clearBoxState(userIdBox);
    clearMessagePair(idErr, idOk);
  }

  function resetAllStates() {
    [nameBox, birthBox, phoneBox, authBox, userIdBox, pwdBox, pwdReBox].forEach(clearBoxState);
    clearMessagePair(authErr, authOk);
    clearMessagePair(idErr, idOk);
    clearMessagePair(pwdErr, pwdOk);
    smsRequested = false;
    smsVerified = false;
  }

  birthInput.addEventListener("input", () => {
    birthInput.value = birthInput.value.replace(/\D/g, "").slice(0, 6);
    clearBoxState(birthBox);
  });

  phoneInput.addEventListener("input", () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 11);
    clearBoxState(phoneBox);
    resetAuthState();
  });

  authCodeInput.addEventListener("input", () => {
    authCodeInput.value = authCodeInput.value.replace(/\D/g, "").slice(0, 6);
    smsVerified = false;
    clearBoxState(authBox);
    clearMessagePair(authErr, authOk);
  });

  userIdInput.addEventListener("input", () => {
    userIdInput.value = userIdInput.value.replace(/\s/g, "");
    resetIdState();
  });

  pwdInput.addEventListener("input", () => {
    pwdInput.value = pwdInput.value.replace(/\s/g, "");
    clearBoxState(pwdBox);
    resetPasswordConfirmState();
  });

  pwdReInput.addEventListener("input", () => {
    pwdReInput.value = pwdReInput.value.replace(/\s/g, "");
    resetPasswordConfirmState();
  });

  nameInput.addEventListener("blur", () => validateName(false));
  birthInput.addEventListener("blur", () => validateBirth(false));
  phoneInput.addEventListener("blur", () => validatePhone(false));
  userIdInput.addEventListener("blur", () => validateUserId(false));
  pwdInput.addEventListener("blur", () => validatePassword(false));
  pwdReInput.addEventListener("blur", () => {
    if (pwdReInput.value.trim()) validatePasswordConfirm(false);
  });

  sendBtn.addEventListener("click", () => {
    if (!validatePhone(true)) return;
    smsRequested = true;
    smsVerified = false;
    clearBoxState(authBox);
    clearMessagePair(authErr, authOk);
    alert("인증번호가 전송되었습니다. 테스트용 인증번호는 123456 입니다.");
    authCodeInput.focus();
  });

  authBtn.addEventListener("click", () => {
    if (!smsRequested) {
      alert("먼저 문자인증을 요청해주세요");
      phoneInput.focus();
      return;
    }

    if (!validateAuthCodeFormat(true)) return;

    if (authCodeInput.value.trim() !== DEMO_AUTH_CODE) {
      smsVerified = false;
      fail({
        message: "잘못된 인증번호입니다",
        input: authCodeInput,
        box: authBox,
        errorEl: authErr,
        successEl: authOk,
        popup: true
      });
      return;
    }

    smsVerified = true;
    pass({ box: authBox, successEl: authOk, errorEl: authErr });
    alert("휴대폰 인증이 완료되었습니다");
  });

  pwdChkBtn.addEventListener("click", () => {
    validatePassword(true) && validatePasswordConfirm(true);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateName(true)) return;
    if (!validateBirth(true)) return;
    if (!validateGender(true)) return;
    if (!validatePhone(true)) return;

    if (!smsRequested) {
      alert("문자인증을 진행해주세요");
      phoneInput.focus();
      return;
    }

    if (!validateAuthCodeFormat(true)) return;

    if (!smsVerified) {
      fail({
        message: "휴대폰 인증을 완료해주세요",
        input: authCodeInput,
        box: authBox,
        errorEl: authErr,
        successEl: authOk,
        popup: true
      });
      return;
    }

    if (!validateUserId(true)) return;
    if (!validatePassword(true)) return;
    if (!validatePasswordConfirm(true)) return;

    alert("회원가입이 완료되었습니다");
    form.reset();
    resetAllStates();
  });
});