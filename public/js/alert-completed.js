const modalBackCompleted = document.querySelector("#modal-back-completed");
const modalCompleted = modalBackCompleted.firstElementChild;
const succesCheckMark = document.querySelector(".success-checkmark");

function animCompleted() {
  succesCheckMark.style.display = "none";

  function animarModal() {
    mostrarModal(modalBackCompleted, modalCompleted);
  }
  setTimeout(() => {
    animarModal();
  }, 650);

  setTimeout(() => {
    succesCheckMark.style.display = "block";
  }, 1050);

  setTimeout(() => {
    animarModal();
    // document.location.reload();
  }, 2300);
}
