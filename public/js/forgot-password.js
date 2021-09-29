const sendEmail = document.getElementById("send-email"),
    newPassword = document.getElementById("new-password"),
    sendEmailBack = document.getElementById("back-email-send"),
    loginSectionContainer = document.querySelector(".login-section__container"),
    emailVal = document.getElementById("email-val"),
    confirmEmailInput = document.getElementById("email"),
    newPasswordInput = document.getElementById("password"),
    confirmNewPasswordInput = document.getElementById("confirm-password");

// const confirmAlert = document.createElement("div");
// confirmAlert.classList.add("modal-back");
// confirmAlert.setAttribute("id", "modal-back-completed");
// confirmAlert.innerHTML =
//     "<div id='modal-completed' class='modal modal-completed'><div class='modal__body modal-body__completed'>           <div class='success-checkmark'><div class='check-icon'><span class='icon-line line-tip'></span><span class='icon-line line-long'></span><div class='icon-circle'></div>                   <div class='icon-fix'></div></div></div><span class='completed'> Completado</span></div></div></div>";
// document.body.appendChild(confirmAlert);

// addAlertCompleted();

/*Aqui reviso si el email es valido en la parte de olvido la contraseña*/
function checkValidEmail() {
    const userData = { email: confirmEmailInput.value };
    const xhr = makeRequest("POST", "/users/forgot_password", userData);
    xhr.onload = function () {
        if (xhr.status === 200) {
            animCompleted(0);
            setTimeout(changeBack, 2700);
        } else if (xhr.status === 400) {
            const errorsMsg = JSON.parse(xhr.response);
            showErrorsForm(errorsMsg.errors);
            return false;
        } else if (xhr.status === 500) {
            addAlert("error", ["Error Interno del servidor"]);
        }
    };
}

/*Aqui reviso si hay algun error en la parte de nueva contraseña*/
function checkValidPassword() {
    const userData = {
        password: newPasswordInput.value,
        password2: confirmNewPasswordInput.value,
    };
    const xhr = makeRequest("GET", "/users/reset_password", userData);
    xhr.onload = function () {
        if (xhr.status === 200) {
            animCompleted(0);
            setTimeout(function () {
                document.location = "/users/login";
            }, 2700);
        } else if (xhr.status === 405) {
            const errorsMsg = JSON.parse(xhr.response);
            showErrorsForm(errorsMsg);
        } else if (xhr.status === 500) {
            addAlert("error", ["Error Interno del servidor"]);
        }
    };
}

function changeBack() {
    loginSectionContainer.style.display = "none";
    sendEmailBack.style.display = "block";
    // emailVal.innerHTML = confirmEmailInput.value;
}

if (newPassword) {
    newPassword.addEventListener("click", function (btn) {
        btn.preventDefault();
        checkValidPassword();
    });
}

if (sendEmail) {
    sendEmail.addEventListener("click", function (btn) {
        btn.preventDefault();
        checkValidEmail();
    });
}
