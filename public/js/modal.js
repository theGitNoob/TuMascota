const firstElement = document.querySelector("#first-element-contact-us");
const secondElement = document.querySelector("#second-element-contact-us");
const btnBuyArr = document.querySelectorAll(".btn-buy");
const modalBackContact = document.querySelector("#modal-back-contact");
const modalBackAbout = document.querySelector("#modal-back-about");
const modalBackBuyThis = document.querySelector(".modal-back-buy-this");
let buyForm = document.querySelector("#buy-form");
let modalBackBuyThisCnt = modalBackBuyThis.querySelector(".spin-box-buy");
const modalBackCompleted = document.querySelector("#modal-back-completed");
const modalContact = document.querySelector("#modal-contact");
const modalAbout = document.querySelector("#modal-about");
const modalBuyThis = document.querySelector(".modal-buy-this");
const modalCompleted = document.querySelector("#modal-completed");
//Indique la cantidad que le interesaria Max(x) nos pondremos en contacto
//con usted a traves del telefono
const modalCompletedCircle = document.querySelector(".circle");
const modalCompletedCircleOk = document.querySelector(".circle-ok");

const acceptBtnBuy = document.querySelector("#accept-btn-buy");
const cancelBtnBuy = document.querySelector("#cancel-btn-buy");

acceptBtnBuy.addEventListener("click", () => {
  function animarModal() {
    mostrarModal(modalBackCompleted, modalCompleted);
    modalCompletedCircle.classList.toggle("show-circle");
    modalCompletedCircleOk.classList.toggle("show-completed");
  }
  animarModal();
  setTimeout(() => {
    animarModal();
    // mostrarModal(modalBackCompleted, modalCompleted);
    modalBackBuyThis.style.display = "none";
    buyForm.submit();
  }, 2000);
});

function mostrarModal(modalback, modal) {
  modalback.classList.toggle("show-modal-back");
  modal.classList.toggle("show-modal");
}

firstElement.addEventListener("click", () => {
  mostrarModal(modalBackContact, modalContact);
});

secondElement.addEventListener("click", () => {
  mostrarModal(modalBackAbout, modalAbout);
});

btnBuyArr.forEach((btnBuy) => {
  btnBuy.addEventListener("click", (e) => {
    let cnt;
    let parentNode =
      e.target.getAttribute("class") == "btn-buy"
        ? e.target
        : e.target.parentNode;
    let values = parentNode.querySelectorAll("input");

    cnt = values[0].value;

    buyForm.action += values[1].value;
    modalBackBuyThisCnt.max = cnt;
    document.querySelector("#cnt").textContent = `(${cnt})`;

    mostrarModal(modalBackBuyThis, modalBuyThis);
  });
});

document.addEventListener("click", (e) => {
  switch (e.target) {
    case modalBackContact:
      mostrarModal(modalBackContact, modalContact);
      break;
    case modalBackAbout:
      mostrarModal(modalBackAbout, modalAbout);
      break;
    case modalBackBuyThis:
      mostrarModal(modalBackBuyThis, modalBuyThis);
      break;
    // case modalBackCompleted:

    // mostrarModal(modalBackCompleted, modalCompleted);
    // break;
    case cancelBtnBuy:
      mostrarModal(modalBackBuyThis, modalBuyThis);
      break;
  }
});
