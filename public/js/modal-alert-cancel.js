const modalCanceledBack = document.querySelector("#modal-back-alert"),
    modalCanceled = modalCanceledBack.firstElementChild,
    btnCancelModal = modalCanceled.querySelector(".btn-alert-cancel"),
    btnAcceptModalCanceled = modalCanceled.querySelector(".btn-alert-confirm");

// btnAcceptModal.addEventListener("click", () => {
//     modalCanceledBack.click();
//     animCompleted(1);
// });

function animarModalAlert() {
    mostrarModal(modalCanceledBack, modalCanceled, 1);
}

document.addEventListener("click", function (e) {
    switch (e.target) {
        case modalCanceledBack:
            mostrarModal(modalCanceledBack, modalCanceled, 0);
            break;
        case btnAcceptModalCanceled:
            mostrarModal(modalCanceledBack, modalCanceled, 0);
    }
});
