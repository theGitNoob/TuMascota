function addAlertCompleted() {
    const confirmAlert = document.createElement("div");
    confirmAlert.classList.add("modal-back");
    confirmAlert.setAttribute("id", "modal-back-completed");
    confirmAlert.innerHTML =
        "<div id='modal-completed' class='modal modal-completed'><div class='modal__body modal-body__completed'><div class='success-checkmark'><div class='check-icon'><span class='icon-line line-tip'></span><span class='icon-line line-long'></span><div class='icon-circle'></div>                   <div class='icon-fix'></div></div></div><span class='completed'> Completado</span></div></div></div>";
    document.body.appendChild(confirmAlert);
    console.log("SE AGREGO");
}

addAlertCompleted();
const modalBackCompleted = document.querySelector("#modal-back-completed");
const modalCompleted = document.querySelector("#modal-completed");
const succesCheckMark = document.querySelector(".success-checkmark");

function animCompleted(flag) {
    succesCheckMark.style.display = "none";

    function animarModal(state) {
        setTimeout(function () {
            mostrarModal(modalBackCompleted, modalCompleted, state);
        }, 400);
    }
    setTimeout(function () {
        animarModal(1);
    }, 650);

    setTimeout(function () {
        succesCheckMark.style.display = "block";
    }, 1350);

    setTimeout(function () {
        animarModal(0);
        if (flag) document.location.reload();
    }, 2500);
}
