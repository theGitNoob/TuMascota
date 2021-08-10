const sendEmail = document.getElementById("send-email");
const btnRegister = document.getElementById("btn-register");
const newPassword = document.getElementById("new-password");
const sendEmailBack = document.getElementById("back-email-send");
const loginSectionContainer = document.querySelector(
    ".login-section__container"
);
const emailVal = document.getElementById("email-val");
const emailInput = document.getElementById("email");

// const confirmAlert = document.createElement("div");
// confirmAlert.classList.add("modal-back");
// confirmAlert.setAttribute("id", "modal-back-completed");
// confirmAlert.innerHTML =
//     "<div id='modal-completed' class='modal modal-completed'><div class='modal__body modal-body__completed'>           <div class='success-checkmark'><div class='check-icon'><span class='icon-line line-tip'></span><span class='icon-line line-long'></span><div class='icon-circle'></div>                   <div class='icon-fix'></div></div></div><span class='completed'> Completado</span></div></div></div>";
// document.body.appendChild(confirmAlert);

// addAlertCompleted();

function changeBack() {
    // sendEmailBack.parentElement.firstElementChild.style.display = "none";
    loginSectionContainer.style.display = "none";
    sendEmailBack.style.display = "block";
    emailVal.innerHTML = emailInput.value;
}

if (newPassword) {
    newPassword.addEventListener("click", function (btn) {
        btn.preventDefault();
        animCompleted(0);
        setTimeout(function () {
            document.location = "login.html";
        }, 2700);
    });
}

if (sendEmail) {
    sendEmail.addEventListener("click", function (btn) {
        /*
    aqui tu revisarias si esta validado el email supongo
    if(....) 
    */
        btn.preventDefault();
        animCompleted(0);
        setTimeout(changeBack, 2700);
    });
}

if (btnRegister) {
    btnRegister.addEventListener("click", function (btn) {
        console.log("click");
        /*
    aqui tu revisarias si se puede crear la cuenta
    if(....) 
    */
        btn.preventDefault();
        animCompleted(0);
        setTimeout(changeBack, 2700);
    });
}
