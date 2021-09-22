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
        let errorsMsg = JSON.parse(xhr.response);
        if (xhr.status === 200) {
            return true;
        } else if (xhr.status === 400) {
            addAlert("error", errorsMsg.errors);
            return false;
        } else if (xhr.status === 500) {
            addAlert("error", ["Error Interno del servidor"]);
        }
    };
}

/*Aqui reviso si hay algun error en la parte de nueva contraseña*/
function checkValidPassword() {
    if (newPasswordInput.value === confirmNewPasswordInput.value) {
        let userData = { password: newPasswordInput, confirmNewPassword: confirmNewPasswordInput.value };
        const xhr = makeRequest("GET", "/users/reset_password", userData);
        xhr.onload = function () {
            let errorsMsg = JSON.parse(xhr.response);
            if (xhr.status === 200) return true;
            else if (xhr.status === 405) {
                addAlert("error", errorsMsg.errors);
                return false;
            } else if (xhr.status === 500) {
                addAlert("error", ["Error Interno del servidor"]);
                return false;
            }
        };
    } else {
        addAlert("error", ["Las contraseñas introducidas no son iguales"]);
    }
    return false;
}

function changeBack() {
    loginSectionContainer.style.display = "none";
    sendEmailBack.style.display = "block";
    emailVal.innerHTML = confirmEmailInput.value;
}

if (newPassword) {
    newPassword.addEventListener("click", function (btn) {
        btn.preventDefault();
        if (checkValidPassword()) {
            animCompleted(0);
            setTimeout(function () {
                document.location = "login.html";
            }, 2700);
        }
    });
}

if (sendEmail) {
    sendEmail.addEventListener("click", function (btn) {
        /*
    aqui tu revisarias si esta validado el email supongo
    if(....) 
    */
        btn.preventDefault();
        if (checkValidEmail()) {
            animCompleted(0);
            setTimeout(changeBack, 2700);
        }
    });
}
