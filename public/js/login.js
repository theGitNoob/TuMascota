const showpassword = document.querySelectorAll(".show-password"),
  password = document.querySelectorAll(".password"),
  inputs = document.querySelectorAll(".form-container input"),
  loginForm = document.querySelector("#login-form"),
  registerForm = document.querySelector("#register-form"),
  modifyUserForm = document.querySelector("#modify-user-form"),
  nameInput = document.querySelector("#name"),
  lastnameInput = document.querySelector("#lastname"),
  phoneInput = document.querySelector("#phone"),
  emailInput = document.querySelector("#email"),
  addressInput = document.querySelector("#address"),
  usernameInput = document.querySelector("#username"),
  passwordInput = document.querySelector("#password"),
  confirmPasswordInput = document.querySelector("#confirm-password"),
  notifyInput = document.querySelector("#checkbox");

if (inputs) {
  /*Esto es para el efecto del desplazamiento del placeholder en los input */

  /*Esto es para cuando tienes guardadas las contraseñas, se mueva el placeholder automaticamente,
    no funciona en chrome pero si en firefox, aun no encuentro solucion*/
  setTimeout(function () {
    inputs.forEach(function (inp) {
      if (inp.value != "") {
        inp.nextElementSibling.classList.add("move-placeholder");
      }
    });
  }, 10);

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

const allinputs = {
  name: nameInput,
  lastname: lastnameInput,
  phone: phoneInput,
  email: emailInput,
  address: addressInput,
  username: usernameInput,
  password: passwordInput,
  password2: confirmPasswordInput,
};

function cleanInputs() {
  const inputKeys = Object.values(allinputs);
  inputKeys.forEach(function (el) {
    if (el) {
      elParent = el.parentElement;
      if (elParent.lastElementChild.classList.contains("input-error")) {
        elParent.lastElementChild.remove();
      }
    }
  });
}

function showErrorsForm(errors) {
  function addFormError(id, msg) {
    const node = document.createElement("div");
    node.classList.add("input-error");
    node.innerHTML =
      " <img src='/public/img/login/error-formulario.png' alt='' /><span class='input-error__text'>" +
      msg +
      " </span> ";

    if (allinputs[id]) {
      const inputParent = allinputs[id].parentElement;
      inputParent.appendChild(node);
    }
  }
  cleanInputs();

  for (er of errors) {
    addFormError(er.field, er.msg);
  }
}

if (loginForm) {
  function addModalConfirmEmail() {
    const modalLogin = document.createElement("div");
    modalLogin.classList.add("modal-back");
    modalLogin.classList.add("modal-back-confirm-login");
    modalLogin.innerHTML = `<div class='modal confirm-login'><div class='modal__header'>Confirmar Cuenta<button type='submit' class='modal-close'><img class='modal-close__icon' src='/public/img/res/close-white.png' alt=''/></button></div><div class='modal__body modal__body-confirm-login'> <h3>Hola ${usernameInput.value}</h3> <img src='/public/img/login/email-warning.png' alt='' /><span>Aún no ha confirmado su cuenta en su correo electrónico.</span></div><div class='modal-line-login line-login'>si no le ha llegado el correo a su buzón, presione aquí <button type='submit' id='resend_email' class = 'btn btn__send-email'>Reenviar correo</button></div></div>`;
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
      resendEmail = document.querySelector("#resend_email");

    let userData = {
      username: usernameInput.value,
      password: passwordInput.value,
    };

    //Esta es la parte de verificar si la cuenta esta validada
    const xhr = makeRequest("POST", "/users/login", userData);
    xhr.onload = function () {
      if (xhr.status === 200) {
        document.location = "/";
      }
      if (xhr.status === 400) {
        const errorsMsg = JSON.parse(xhr.response);
        showErrorsForm(errorsMsg);
      } else if (xhr.status === 401) {
        mostrarModal(modalBackConfirmLogin, modalConfirmLogin, 1);
      } else if (xhr.status === 500) {
        addAlert("error", ["Error Interno del servidor"]);
      }
    };

    //Esta es la parte de reenviar correo
    function resendEmailRequest() {
      let userData = {
        username: usernameInput.value,
        password: passwordInput.value,
      };
      const xhr = makeRequest("POST", "/users/send_mail", userData);
      xhr.onload = function () {
        if (xhr.status === 200) {
          mostrarModal(modalBackConfirmLogin, modalConfirmLogin, 0);
          setTimeout(changeBack, 800);
        } else if (xhr.status === 400) {
          const errorsMsg = JSON.parse(xhr.response);
          showErrorsForm(errorsMsg);
        } else if (xhr.status === 500) {
          addAlert("error", ["Error Interno del servidor"]);
        }
      };
    }

    resendEmail.addEventListener("click", function (e) {
      e.preventDefault();
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
  function checkRegister() {
    const userData = {
      name: nameInput.value,
      lastname: lastnameInput.value,
      phone: phoneInput.value,
      email: emailInput.value,
      address: addressInput.value,
      username: usernameInput.value,
      password: passwordInput.value,
      password2: confirmPasswordInput.value,
      notify: notifyInput.value,
    };

    const xhr = makeRequest("POST", "/users/register", userData);
    xhr.onload = function () {
      if (xhr.status === 200) {
        animCompleted(0);
        setTimeout(changeBack, 2700);
      }
      if (xhr.status === 400) {
        const errorsMsg = JSON.parse(xhr.response);
        showErrorsForm(errorsMsg);
      }
      if (xhr.status === 500) {
        addAlert("error", ["Error Interno del servidor"]);
      }
    };
  }

  registerForm.addEventListener("submit", function (event) {
    event.preventDefault();
    checkRegister();
  });
}

//De esta manera se si estoy en la parte de modificar perfil
if (modifyUserForm) {
  function checkModifyUser() {
    const userData = {
      name: nameInput.value,
      lastname: lastnameInput.value,
      phone: phoneInput.value,
      address: addressInput.value,
      username: usernameInput.value,
      password: passwordInput.value,
      password2: confirmPasswordInput.value,
      notify: notifyInput.value,
    };

    const xhr = makeRequest("PUT", "/user/modify_profile", userData);

    xhr.onload = function () {
      if (xhr.status === 200) {
        animCompleted(0);
        cleanInputs();
        // window.location = "/";
      }
      if (xhr.status === 400) {
        const errorsMsg = JSON.parse(xhr.response);
        console.log(errorsMsg);
        // addAlert("error", errorsMsg);
        showErrorsForm(errorsMsg);
        // return false;
      }
      if (xhr.status === 500) {
        addAlert("error", ["Error Interno del servidor"]);
      }
    };
  }
  modifyUserForm.addEventListener("submit", function (event) {
    event.preventDefault();
    checkModifyUser();
  });
}
