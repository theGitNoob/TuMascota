const btnBuyArr = document.querySelectorAll(".btn-buy");

const modalBackBuyThis = document.querySelector(".modal-back-buy-this");

const modalBackCompleted = document.querySelector("#modal-back-completed");

const modalBuyThis = document.querySelector(".modal-buy-this");
const modalCompleted = document.querySelector("#modal-completed");
//Indique la cantidad que le interesaria Max(x) nos pondremos en contacto
//con usted a traves del telefono
const buyForm = document.querySelector("#buy-form");
const spanCnt = document.querySelector("#cnt");

const succesCheckMark = document.querySelector(".success-checkmark");
const acceptBtnBuy = document.querySelector("#accept-btn-buy");
const cancelBtnBuy = document.querySelector("#cancel-btn-buy");

let modalBackBuyThisCnt = modalBackBuyThis.querySelector(".spin-box-buy");
const plusBtn = document.querySelector(".plus-btn");
const lessBtn = document.querySelector(".less-btn");

modalBackBuyThisCnt.addEventListener("change", () => {
  let parseValue = parseInt(modalBackBuyThisCnt.value);
  let parseValueMax = parseInt(modalBackBuyThisCnt.getAttribute("max"));
  if (parseValue >= parseValueMax) {
    modalBackBuyThisCnt.value = modalBackBuyThisCnt.max;
  }
});

plusBtn.addEventListener("click", () => {
  let parseValue = parseInt(modalBackBuyThisCnt.value);
  let parseValueMax = parseInt(modalBackBuyThisCnt.getAttribute("max"));

  if (parseValue + 1 <= parseValueMax)
    modalBackBuyThisCnt.value = parseInt(modalBackBuyThisCnt.value) + 1;
});

lessBtn.addEventListener("click", () => {
  let parseValue = parseInt(modalBackBuyThisCnt.value);
  // let parseValueMax = parseInt(modalBackBuyThisCnt.getAttribute("max"));
  // console.log(parseValue);

  // modalBackBuyThisCnt.value = parseInt(modalBackBuyThisCnt.value) - 1;
  if (parseValue > 1) {
    modalBackBuyThisCnt.value = parseInt(modalBackBuyThisCnt.value) - 1;
  }
});

// acceptBtnBuy.addEventListener("click", () => {
//   modalBackBuyThis.click();
//   succesCheckMark.style.display = "none";

//   function animarModal() {
//     mostrarModal(modalBackCompleted, modalCompleted);
//   }
//   setTimeout(() => {
//     animarModal();
//   }, 650);

//   setTimeout(() => {
//     succesCheckMark.style.display = "block";
//   }, 1050);
//   setTimeout(() => {
//     animarModal();
//   }, 2300);
// });

btnBuyArr.forEach((btnBuy) => {
  btnBuy.addEventListener("click", (e) => {
    let node =
      e.target.getAttribute("class") == "btn-buy"
        ? e.target.firstElementChild
        : e.target.parentNode.firstElementChild;
    let cnt = node.value;
    modalBackBuyThisCnt.setAttribute("max", cnt);
    spanCnt.textContent = ` (${cnt})`;
    buyForm.action += node.id;
    mostrarModal(modalBackBuyThis, modalBuyThis);
    modalBackBuyThisCnt.value = 1;
  });
});

document.addEventListener("click", (e) => {
  switch (e.target) {
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
buyForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let body = new URLSearchParams();
  let inputNode = buyForm.querySelector("input");
  body.append(inputNode.name, inputNode.value);
  fetch(buyForm.action, {
    method: "post",
    mode: "same-origin",
    cache: "default",
    credentials: "same-origin",
    headers: {
      "Cache-Control": "no-cache",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    body: body,
  })
    .then((response) => {
      if (!response.ok) throw 401;
    })
    .then(() => {
      modalBackBuyThis.click();
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
      }, 2300);
      setTimeout(() => {
        document.location.reload();
      }, 2500);
    })
    .catch((err) => {
      if (err == 401) {
      }
    });
});
