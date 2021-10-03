const modalBackCompleted = document.querySelector("#modal-back-completed");
const modalCompleted = modalBackCompleted.firstElementChild;
const succesCheckMark = document.querySelector(".success-checkmark");

function animCompleted() {
    succesCheckMark.style.display = "none";

    function animarModal() {
        mostrarModal(modalBackCompleted, modalCompleted);
    }
    setTimeout(function () {
        animarModal();
    }, 850);

    setTimeout(function () {
        succesCheckMark.style.display = "block";
    }, 1050);

    setTimeout(function () {
        animarModal();
        document.location.reload();
    }, 2300);
}
