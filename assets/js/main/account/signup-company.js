document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupCompanyForm");

  const companyNameInput = document.getElementById("companyName");
  const businessNumberInput = document.getElementById("businessNumber");
  const companyAddressInput = document.getElementById("companyAddress");
  const managerNameInput = document.getElementById("managerName");
  const managerPhoneInput = document.getElementById("managerPhone");
  const authCodeInput = document.getElementById("authCode");
  const userIdInput = document.getElementById("userId");
  const passwordInput = document.getElementById("password");
  const passwordConfirmInput = document.getElementById("passwordConfirm");

  const companyNameBox = document.getElementById("companyNameBox");
  const businessNumberBox = document.getElementById("businessNumberBox");
  const companyAddressBox = document.getElementById("companyAddressBox");
  const managerNameBox = document.getElementById("managerNameBox");
  const managerPhoneBox = document.getElementById("managerPhoneBox");
  const authCodeBox = document.getElementById("authCodeBox");
  const userIdBox = document.getElementById("userIdBox");
  const passwordBox = document.getElementById("passwordBox");
  const passwordConfirmBox = document.getElementById("passwordConfirmBox");

  const requestSmsBtn = document.getElementById("requestSmsBtn");
  const verifyAuthCodeBtn = document.getElementById("verifyAuthCodeBtn");
  const checkPasswordBtn = document.getElementById("checkPasswordBtn");

  const authCodeErrorMsg = document.getElementById("authCodeErrorMsg");
  const authCodeSuccessMsg = document.getElementById("authCodeSuccessMsg");
  const userIdErrorMsg = document.getElementById("userIdErrorMsg");
  const userIdSuccessMsg = document.getElementById("userIdSuccessMsg");
  const passwordConfirmErrorMsg = document.getElementById("passwordConfirmErrorMsg");
  const passwordConfirmSuccessMsg = document.getElementById("passwordConfirmSuccessMsg");

  const REGEX = {
    korean: /^[가-힣\s]+$/,
    businessNumber: /^(\d{3}-\d{2}-\d{5}|\d{10})$/,
    phone: /^\d{11}$/,
    auth: /^\d{6}$/,
    userId: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,20}$/,
    passwordCombo: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9])\S+$/
  };

  const DEMO_AUTH_CODE = "123456";
  let smsRequested = false;
  let smsVerified = false;

  function hide(element) {
    if (element) {
      element.classList.remove("is-show");
    }
  }

  function show(element) {
    if (element) {
      element.classList.add("is-show");
    }
  }

  function clearMessagePair(errorEl, successEl) {
    hide(errorEl);
    hide(successEl);
  }

  function clearBoxState(box) {
    if (!box) return;
    box.classList.remove("is-error", "is-success");
  }

  function setError(box, errorEl, successEl) {
    clearBoxState(box);
    if (box) box.classList.add("is-error");
    if (successEl) hide(successEl);
    if (errorEl) show(errorEl);
  }

  function setSuccess(box, successEl, errorEl) {
    clearBoxState(box);
    if (box) box.classList.add("is-success");
    if (errorEl) hide(errorEl);
    if (successEl) show(successEl);
  }

  function fail({ message, input, box, errorEl = null, successEl = null, popup = false }) {
    setError(box, errorEl, successEl);
    if (popup) {
      alert(message);
      if (input) input.focus();
    }
    return false;
  }

  function pass({ box, successEl = null, errorEl = null }) {
    setSuccess(box, successEl, errorEl);
    return true;
  }

  function validateCompanyName(popup = false) {
    const value = companyNameInput.value.trim();

    if (!value) {
      return fail({
        message: "*표는 필수입력입니다",
        input: companyNameInput,
        box: companyNameBox,
        popup
      });
    }

    return pass({ box: companyNameBox });
  }

  function validateBusinessNumber(popup = false) {
    const value = businessNumberInput.value.trim();

    if (!value) {
      return fail({
        message: "*표는 필수입력입니다",
        input: businessNumberInput,
        box: businessNumberBox,
        popup
      });
    }

    if (!REGEX.businessNumber.test(value)) {
      return fail({
        message: "사업자등록번호는 숫자 10자리 또는 123-45-67890 형식으로 입력해주세요",
        input: businessNumberInput,
        box: businessNumberBox,
        popup
      });
    }

    return pass({ box: businessNumberBox });
  }

  function validateCompanyAddress(popup = false) {
    const value = companyAddressInput.value.trim();

    if (!value) {
      return fail({
        message: "*표는 필수입력입니다",
        input: companyAddressInput,
        box: companyAddressBox,
        popup
      });
    }

    return pass({ box: companyAddressBox });
  }

  function validateManagerName(popup = false) {
    const value = managerNameInput.value.trim();

    if (!value) {
      return fail({
        message: "*표는 필수입력입니다",
        input: managerNameInput,
        box: managerNameBox,
        popup
      });
    }

    if (!REGEX.korean.test(value)) {
      return fail({
        message: "담당자 이름은 한글로 입력해주세요",
        input: managerNameInput,
        box: managerNameBox,
        popup
      });
    }

    return pass({ box: managerNameBox });
  }

  function validateManagerPhone(popup = false) {
    const value = managerPhoneInput.value.trim();

    if (!value) {
      return fail({
        message: "*표는 필수입력입니다",
        input: managerPhoneInput,
        box: managerPhoneBox,
        popup
      });
    }

    if (!REGEX.phone.test(value)) {
      return fail({
        message: "담당자 전화번호는 숫자만 11자리로 입력해주세요",
        input: managerPhoneInput,
        box: managerPhoneBox,
        popup
      });
    }

    return pass({ box: managerPhoneBox });
  }

  function validateAuthCodeFormat(popup = false) {
    const value = authCodeInput.value.trim();

    if (!value) {
      return fail({
        message: "*표는 필수입력입니다",
        input: authCodeInput,
        box: authCodeBox,
        errorEl: authCodeErrorMsg,
        successEl: authCodeSuccessMsg,
        popup
      });
    }

    if (!REGEX.auth.test(value)) {
      return fail({
        message: "인증번호는 숫자 6자리로 입력해주세요",
        input: authCodeInput,
        box: authCodeBox,
        errorEl: authCodeErrorMsg,
        successEl: authCodeSuccessMsg,
        popup
      });
    }

    clearBoxState(authCodeBox);
    clearMessagePair(authCodeErrorMsg, authCodeSuccessMsg);
    return true;
  }

  function validateUserId(popup = false) {
    const value = userIdInput.value.trim();

    if (!value) {
      return fail({
        message: "*표는 필수입력입니다",
        input: userIdInput,
        box: userIdBox,
        errorEl: userIdErrorMsg,
        successEl: userIdSuccessMsg,
        popup
      });
    }

    if (!/^[A-Za-z0-9]+$/.test(value)) {
      return fail({
        message: "아이디는 영어와 숫자만 입력해주세요",
        input: userIdInput,
        box: userIdBox,
        errorEl: userIdErrorMsg,
        successEl: userIdSuccessMsg,
        popup
      });
    }

    if (!REGEX.userId.test(value)) {
      return fail({
        message: "아이디는 영어와 숫자의 조합으로 5자 이상 20자 이하로 입력해주세요",
        input: userIdInput,
        box: userIdBox,
        errorEl: userIdErrorMsg,
        successEl: userIdSuccessMsg,
        popup
      });
    }

    return pass({
      box: userIdBox,
      successEl: userIdSuccessMsg,
      errorEl: userIdErrorMsg
    });
  }

  function validatePassword(popup = false) {
    const value = passwordInput.value;

    if (!value.trim()) {
      return fail({
        message: "*표는 필수입력입니다",
        input: passwordInput,
        box: passwordBox,
        popup
      });
    }

    if (value.length < 8 || value.length > 20) {
      return fail({
        message: "비밀번호는 8자 이상 20자 이하로 입력해주세요",
        input: passwordInput,
        box: passwordBox,
        popup
      });
    }

    if (!REGEX.passwordCombo.test(value)) {
      return fail({
        message: "비밀번호는 영어, 특수문자, 숫자의 조합으로 해주세요",
        input: passwordInput,
        box: passwordBox,
        popup
      });
    }

    return pass({ box: passwordBox });
  }

  function validatePasswordConfirm(popup = false) {
    const value = passwordConfirmInput.value;

    if (!value.trim()) {
      return fail({
        message: "*표는 필수입력입니다",
        input: passwordConfirmInput,
        box: passwordConfirmBox,
        errorEl: passwordConfirmErrorMsg,
        successEl: passwordConfirmSuccessMsg,
        popup
      });
    }

    if (passwordInput.value !== value) {
      return fail({
        message: "비밀번호가 일치하지 않습니다",
        input: passwordConfirmInput,
        box: passwordConfirmBox,
        errorEl: passwordConfirmErrorMsg,
        successEl: passwordConfirmSuccessMsg,
        popup
      });
    }

    return pass({
      box: passwordConfirmBox,
      successEl: passwordConfirmSuccessMsg,
      errorEl: passwordConfirmErrorMsg
    });
  }

  function resetAuthState() {
    smsRequested = false;
    smsVerified = false;
    clearBoxState(authCodeBox);
    clearMessagePair(authCodeErrorMsg, authCodeSuccessMsg);
  }

  function resetUserIdState() {
    clearBoxState(userIdBox);
    clearMessagePair(userIdErrorMsg, userIdSuccessMsg);
  }

  function resetPasswordConfirmState() {
    clearBoxState(passwordConfirmBox);
    clearMessagePair(passwordConfirmErrorMsg, passwordConfirmSuccessMsg);
  }

  function resetAllStates() {
    [
      companyNameBox,
      businessNumberBox,
      companyAddressBox,
      managerNameBox,
      managerPhoneBox,
      authCodeBox,
      userIdBox,
      passwordBox,
      passwordConfirmBox
    ].forEach(clearBoxState);

    clearMessagePair(authCodeErrorMsg, authCodeSuccessMsg);
    clearMessagePair(userIdErrorMsg, userIdSuccessMsg);
    clearMessagePair(passwordConfirmErrorMsg, passwordConfirmSuccessMsg);

    smsRequested = false;
    smsVerified = false;
  }

  businessNumberInput.addEventListener("input", () => {
    const digits = businessNumberInput.value.replace(/\D/g, "").slice(0, 10);
    let formatted = digits;

    if (digits.length > 3 && digits.length <= 5) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else if (digits.length > 5) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
    }

    businessNumberInput.value = formatted;
    clearBoxState(businessNumberBox);
  });

  managerPhoneInput.addEventListener("input", () => {
    managerPhoneInput.value = managerPhoneInput.value.replace(/\D/g, "").slice(0, 11);
    clearBoxState(managerPhoneBox);
    resetAuthState();
  });

  authCodeInput.addEventListener("input", () => {
    authCodeInput.value = authCodeInput.value.replace(/\D/g, "").slice(0, 6);
    smsVerified = false;
    clearBoxState(authCodeBox);
    clearMessagePair(authCodeErrorMsg, authCodeSuccessMsg);
  });

  userIdInput.addEventListener("input", () => {
    resetUserIdState();
  });

  passwordInput.addEventListener("input", () => {
    clearBoxState(passwordBox);
    resetPasswordConfirmState();
  });

  passwordConfirmInput.addEventListener("input", () => {
    resetPasswordConfirmState();
  });

  companyNameInput.addEventListener("blur", () => validateCompanyName(false));
  businessNumberInput.addEventListener("blur", () => validateBusinessNumber(false));
  companyAddressInput.addEventListener("blur", () => validateCompanyAddress(false));
  managerNameInput.addEventListener("blur", () => validateManagerName(false));
  managerPhoneInput.addEventListener("blur", () => validateManagerPhone(false));
  userIdInput.addEventListener("blur", () => {
    if (userIdInput.value.trim()) validateUserId(false);
  });
  passwordInput.addEventListener("blur", () => {
    if (passwordInput.value.trim()) validatePassword(false);
  });
  passwordConfirmInput.addEventListener("blur", () => {
    if (passwordConfirmInput.value.trim()) validatePasswordConfirm(false);
  });

  requestSmsBtn.addEventListener("click", () => {
    if (!validateManagerPhone(true)) return;

    smsRequested = true;
    smsVerified = false;
    clearBoxState(authCodeBox);
    clearMessagePair(authCodeErrorMsg, authCodeSuccessMsg);

    alert("인증번호가 전송되었습니다. 테스트용 인증번호는 123456 입니다.");
    authCodeInput.focus();
  });

  verifyAuthCodeBtn.addEventListener("click", () => {
    if (!smsRequested) {
      alert("먼저 인증요청을 해주세요");
      managerPhoneInput.focus();
      return;
    }

    if (!validateAuthCodeFormat(true)) return;

    if (authCodeInput.value.trim() !== DEMO_AUTH_CODE) {
      smsVerified = false;
      fail({
        message: "잘못된 인증번호입니다",
        input: authCodeInput,
        box: authCodeBox,
        errorEl: authCodeErrorMsg,
        successEl: authCodeSuccessMsg,
        popup: true
      });
      return;
    }

    smsVerified = true;
    pass({
      box: authCodeBox,
      successEl: authCodeSuccessMsg,
      errorEl: authCodeErrorMsg
    });

    alert("휴대폰 인증이 완료되었습니다");
  });

  checkPasswordBtn.addEventListener("click", () => {
    if (!validatePassword(true)) return;
    validatePasswordConfirm(true);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateCompanyName(true)) return;
    if (!validateBusinessNumber(true)) return;
    if (!validateCompanyAddress(true)) return;
    if (!validateManagerName(true)) return;
    if (!validateManagerPhone(true)) return;

    if (!smsRequested) {
      alert("인증요청을 먼저 진행해주세요");
      managerPhoneInput.focus();
      return;
    }

    if (!validateAuthCodeFormat(true)) return;

    if (!smsVerified) {
      fail({
        message: "휴대폰 인증을 완료해주세요",
        input: authCodeInput,
        box: authCodeBox,
        errorEl: authCodeErrorMsg,
        successEl: authCodeSuccessMsg,
        popup: true
      });
      return;
    }

    if (!validateUserId(true)) return;
    if (!validatePassword(true)) return;
    if (!validatePasswordConfirm(true)) return;

    alert("기업 회원가입이 완료되었습니다");
    form.reset();
    resetAllStates();
  });
});