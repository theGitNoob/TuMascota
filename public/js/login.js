const showpassword = document.querySelectorAll(".show-password"),
  password = document.querySelectorAll(".password"),
  inputs = document.querySelectorAll(".form-container input"),
  loginForm = document.querySelector("#login-form"),
  registerForm = document.querySelector("#register-form"),
  modifyUserForm = document.querySelector("#modify-user-form");

if (inputs) {
  /*Esto es para el efecto del desplazamiento del placeholder en los input */

  /*Esto es para cuando tienes guardadas las contraseñas, se mueva el placeholder automaticamente*/

  window.onload = function () {
    inputs.forEach(function (inp) {
      if (inp.matches("-internal-autofill-selected")) {
        inp.nextElementSibling.classList.add("move-placeholder");
      }
      if (inp.value != "") {
        inp.nextElementSibling.classList.add("move-placeholder");
      }
    });
  };

  inputs.forEach(function (inp) {
    inp.addEventListener("change", function () {
      if (inp.value != "") {
        inp.nextElementSibling.classList.add("move-placeholder");
      }
    });
    inp.addEventListener("focus", function () {
      inp.nextElementSibling.classList.add("move-placeholder");
    });
    inp.addEventListener("blur", function () {
      if (inp.value === "") {
        inp.nextElementSibling.classList.remove("move-placeholder");
      }
    });
  });
}

if (showpassword) {
  showpassword.forEach(function (sh, cont) {
    sh.addEventListener("click", function () {
      if (cont === 0) {
        if (password[0].getAttribute("type") === "password") {
          password[0].setAttribute("type", "text");
          sh.firstElementChild.src = "/public/img/login/eye.png";
        } else if (password[0].getAttribute("type") === "text") {
          password[0].setAttribute("type", "password");
          sh.firstElementChild.src = "/public/img/login/show-eye.png";
        }
      } else {
        if (password[1].getAttribute("type") === "password") {
          password[1].setAttribute("type", "text");
          sh.firstElementChild.src = "/public/img/login/eye.png";
        } else if (password[1].getAttribute("type") === "text") {
          password[1].setAttribute("type", "password");
          sh.firstElementChild.src = "/public/img/login/show-eye.png";
        }
      }
    });
  });
}

//De esta manera se si estoy en la parte de acceder
if (loginForm) {
  function addModalConfirmEmail() {
    const modalLogin = document.createElement("div");
    modalLogin.classList.add("modal-back");
    modalLogin.classList.add("modal-back-confirm-login");
    modalLogin.innerHTML =
      "                <div class='modal confirm-login'><div class='modal__header'>Confirmar Cuenta<button type='submit' class='modal-close'><img class='modal-close__icon' src='/public/img/res/close-white.png' alt=''/></button></div><div class='modal__body modal__body-confirm-login'> <h3>Hola Jmlopez</h3> <img src='/public/img/login/email-warning.png' alt='' /><span>Aún no ha confirmado su cuenta en su correo electrónico.</span></div><div class='modal-line-login line-login'>si no le ha llegado el correo a su buzón, presione aquí <button type='submit' id='resend_email' class = 'btn btn__send-email'>Reenviar correo</button></div></div>";
    if (!document.querySelector(".modal-back-confirm-login")) {
      document.body.appendChild(modalLogin);
      let closeModal = modalLogin.querySelector(".modal-close");
      closeModal.addEventListener("click", function () {
        mostrarModal(modalLogin, modalLogin.firstElementChild, 0);
      });
      modalLogin.addEventListener("click", function (event) {
        if (event.target === modalLogin)
          mostrarModal(modalLogin, modalLogin.firstElementChild, 0);
      });
    }
  }

  function confirmAccountCheck() {
    addModalConfirmEmail();
    const modalBackConfirmLogin = document.querySelector(
        ".modal-back-confirm-login"
      ),
      modalConfirmLogin = modalBackConfirmLogin.firstElementChild,
      userNameInput = document.querySelector("#username"),
      passwordInput = document.querySelector("#password"),
      resendEmail = document.querySelector("#resend_email");

    let userData = {
      username: userNameInput.value,
      password: passwordInput.value,
    };

    //Esta es la parte de verificar si la cuenta esta validada
    const xhr = makeRequest("POST", "/users/login", userData);
    xhr.onload = function () {
      if (xhr.status === 200) {
        document.location = "/";
      }
      const errorsMsg = JSON.parse(xhr.response);
      if (xhr.status === 400) {
        addAlert("error", errorsMsg.errors);
      } else if (xhr.status === 401) {
        mostrarModal(modalBackConfirmLogin, modalConfirmLogin, 1);
      } else if (xhr.status === 500) {
        addAlert("error", ["Error Interno del servidor"]);
      }
    };

    //Esta es la parte de reenviar correo
    function resendEmailRequest() {
      let userData = {
        username: userNameInput.value,
        password: passwordInput.value,
      };
      const xhr = makeRequest("POST", "/users/send_email", userData);
      xhr.onload = function () {
        if (xhr.status === 200) {
          mostrarModal(modalBackConfirmLogin, modalConfirmLogin, 0);
          setTimeout(changeBack, 800);
        } else if (xhr.status === 500) {
          addAlert("error", ["Error Interno del servidor"]);
        }
      };
    }

    resendEmail.addEventListener("click", function () {
      resendEmailRequest();
    });
  }
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    confirmAccountCheck();
  });
}

//De esta manera se si estoy en la parte de registrarse
if (registerForm) {
  const registerInputs = registerForm.querySelectorAll("input");

  function checkRegister() {
    let userData = {
      //BUGFIX:Esto tiene error
      name: registerInputs[0].value,
      lastName: registerInputs[1].value,
      phone: registerInputs[2].value,
      address: registerInputs[3].value,
      userName: registerInputs[4].value,
      password: registerInputs[5].value,
      confirmPassowrd: registerInputs[6].value,
      lastName: registerInputs[7].value,
      checkbox: registerInputs[8].value,
    };

    const xhr = makeRequest("POST", "/users/register", userData);
    xhr.onload = function () {
      const errorsMsg = JSON.parse(xhr.response);
      if (xhr.status === 200) {
        return true;
      }
      if (xhr.status === 400) {
        addAlert("error", errorsMsg);
        return false;
      }
      if (xhr.status === 500) {
        addAlert("error", ["Error Interno del servidor"]);
        return false;
      }
      return false;
    };
  }

  registerForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (checkRegister()) {
      animCompleted(0);
      setTimeout(changeBack, 2700);
    }
  });
}

//De esta manera se si estoy en la parte de modificar perfil
if (modifyUserForm) {
  const modifyUserInputs = modifyUserForm.querySelectorAll("input");

  function checkModifyUser() {
    let userData = {
      name: modifyUserInputs[0].value,
      lastName: modifyUserInputs[1].value,
      phone: modifyUserInputs[2].value,
      address: modifyUserInputs[3].value,
      userName: modifyUserInputs[4].value,
      password: modifyUserInputs[5].value,
      confirmPassowrd: modifyUserInputs[6].value,
      lastName: modifyUserInputs[7].value,
      checkbox: modifyUserInputs[8].value,
    };

    const xhr = makeRequest("PUT", "users/change_perfil", userData);

    xhr.onload = function () {
      const errorsMsg = JSON.parse(xhr.response);
      if (xhr.status === 200) return true;
      if (xhr.status === 400) {
        addAlert("error", errorsMsg);
        return false;
      }
      if (xhr.status === 500) {
        addAlert("error", ["Error Interno del servidor"]);
      }
    };
  }

  modifyUserForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (checkModifyUser()) {
      animCompleted(0);
      window.location = "index.html";
    }
  });
}
