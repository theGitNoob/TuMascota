const modalCanceledBack = document.querySelector("#modal-back-alert");
const modalCanceled = modalCanceledBack.firstElementChild;
const btnCancelModal = modalCanceled.querySelector(".btn-alert-cancel");
const btnAcceptModal = modalCanceled.querySelector(".btn-alert-confirm");

btnAcceptModal.addEventListener("click", () => {
    modalCanceledBack.click();
    animCompleted(1);
});

function animarModalAlert() {
    mostrarModal(modalCanceledBack, modalCanceled);
}

document.addEventListener("click", (e) => {
    switch (e.target) {
        case modalCanceledBack:
            mostrarModal(modalCanceledBack, modalCanceled);
            break;
        case btnCancelModal:
            mostrarModal(modalCanceledBack, modalCanceled);
    }
});
