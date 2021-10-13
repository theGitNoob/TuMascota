const alertNodeContainer = document.createElement("div");
alertNodeContainer.classList.add("alerts-container");
/*Con esta funcion lo unico que tienes que pasarle es el estado de la alerta(success,error,warning) y el texto que quieras pooner  listo*/
document.body.insertBefore(alertNodeContainer, document.body.firstElementChild);

function addAlert(state, textArray) {
    // console.log(textArray);
    /* */
    alertNodeContainer.innerHTML = "";
    for (let i = 0; i < textArray.length; i++) {
        const alertNode = document.createElement("div");
        alertNode.classList.add("alert-message");
        alertNode.innerHTML =
            "<div class='alert-message__icon-container'><div class='alert-message__color'></div><img class='alert-message__icon' src='' alt='' /></div><div class='alert-message__text'><strong>Completado!</strong><p>Cuenta creada satisfactoriamente</p></div><div class='alert-message__close'><img src='/public/img/res/close.webp' alt='' /></div>";
        alertNodeContainer.appendChild(alertNode);
    }
    const alertMessage = document.querySelectorAll(".alert-message");
    const alertMessageImg = document.querySelectorAll(".alert-message__icon");
    const alertClose = document.querySelectorAll(".alert-message__close");
    const alertText = document.querySelectorAll(".alert-message__text p");
    const alertStrong = document.querySelectorAll(".alert-message__text strong");

    function setAlertStyle(alert, cont) {
        if (alert.getAttribute("data-alert-state") === "success") {
            alertMessageImg[cont].src = "/public/img/res/success.webp";
            alertStrong[cont].textContent = "Completado!";
        }
        if (alert.getAttribute("data-alert-state") === "error") {
            alertMessageImg[cont].src = "/public/img/res/error.webp";
            alertStrong[cont].textContent = "Error!";
        }
        if (alert.getAttribute("data-alert-state") === "warning") {
            alertMessageImg[cont].src = "/public/img/res/warning.webp";
            alertStrong[cont].textContent = "Advertencia!";
        }
    }
    alertNodeContainer.style.display = "block";
    alertMessage.forEach(function (msg, cont) {
        msg.setAttribute("data-alert-state", state);
        setAlertStyle(msg, cont);
        alertText[cont].textContent = textArray[cont];
        // console.log("asdasdadsa", textArray[cont]);
        alertClose[cont].addEventListener("click", function () {
            alertMessage[cont].classList.add("close-alert-message");
            setTimeout(function () {
                alertMessage[cont].style.display = "none";
                alertNodeContainer.removeChild(alertMessage[cont]);
            }, 410);
        });
        setTimeout(function () {
            msg.classList.add("show-alert");
        }, 10);
    });

    // setTimeout(function () {

    // }, 10);
}

// addAlert("warning", ["Todo salio perfecto", "Mensaje 1"]);
// addAlert("warning", ["Puede cancelar las ordenes pendientes"]);
// addAlert("error", "Hubo un problema a la hora de validar su cuenta");
