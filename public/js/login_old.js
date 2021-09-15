const showpassword = document.querySelectorAll(".show-password"),
  password = document.querySelectorAll(".password"),
  inputs = document.querySelectorAll(".form-container input"),
  loginForm = document.querySelector("#login-form");

if (inputs) {
  /*Esto es para el efecto del desplazamiento del placeholder en los input */

  /*Esto es para cuando tienes guardadas las contraseñas, se mueva el placeholder automaticamente*/
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

/**/

function addModalConfirmEmail() {
  const modalLogin = document.createElement("div");
  modalLogin.classList.add("modal-back");
  modalLogin.classList.add("modal-back-confirm-login");
  modalLogin.innerHTML =
    "                <div class='modal confirm-login'><div class='modal__header'>Confirmar Cuenta<button type='submit' class='modal-close'><img class='modal-close__icon' src='/public/img/res/close-white.png' alt=''/></button></div><div class='modal__body'> <h4>Hola Jmlopez</h4> <img src='/public/img/login/email-warning.png' alt='' /><span>Aún no ha confirmado su cuenta en su correo electrónico.</span></div><div class='modal-line-login line-login'>si no le ha llegado el correo a su buzón, presione aquí <a href='users/send_email'>reenviar correo</a></div></div>";
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
    modalConfirmLogin = modalBackConfirmLogin.firstElementChild;

  const requestUrl = "/public/JSON/login/login.json";
  let xhr = new XMLHttpRequest();

  xhr.open("GET", requestUrl);
  xhr.responseType = "json";
  xhr.send();

  xhr.onload = () => {
    // if (xhr.status === 200) {
    //     document.location = "index.html";
    // }
    /*cambiar a 401*/
    let msgJSON = xhr.response;
    console.log(msgJSON);
    if (xhr.status === 200) {
      if (msgJSON.msg === "unconfirmed") {
        mostrarModal(modalBackConfirmLogin, modalConfirmLogin, 1);
      } else {
        addAlert("error", [msgJSON.msg]);
      }
    }
  };
  return true;
}

if (loginForm) {
  loginForm.addEventListener("submit", function (log) {
    log.preventDefault();
    confirmAccountCheck();
  });
}
