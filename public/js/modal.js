const btnBuyArr = document.querySelectorAll(".btn-buy");

const modalBackBuyThis = document.querySelector(".modal-back-buy-this");

const modalBuyThis = modalBackBuyThis.firstElementChild;

const acceptBtnBuy = document.querySelector("#accept-btn-buy");
const cancelBtnBuy = document.querySelector("#cancel-btn-buy");

let modalBackBuyThisCnt = modalBackBuyThis.querySelector(".spin-box-buy");
const plusBtn = document.querySelector(".plus-btn");
const lessBtn = document.querySelector(".less-btn");

let action = "";

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

  if (parseValue > 1) {
    modalBackBuyThisCnt.value = parseInt(modalBackBuyThisCnt.value) - 1;
  }
});
acceptBtnBuy.addEventListener("click", (e) => {
  e.preventDefault();

  let buyForm = document.getElementById("buy-form");
  let node = buyForm.querySelector("input");
  let data = node.name + "=" + node.value;

  let req = new XMLHttpRequest();

  req.open("POST", action);
  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  req.onload = () => {
    console.log(req.status);
    if (req.status == 200) {
      let orders = document.querySelector(".login-count-msj.orders-msj");
      let orderCnt = Number(orders.textContent);
      orderCnt++;
      orders.textContent = orderCnt.toString();

      modalBackBuyThis.click();
      animCompleted();
    }
  };

  req.send(data);
});

btnBuyArr.forEach((btnBuy) => {
  btnBuy.addEventListener("click", (e) => {
    let target = e.target;
    let root =
      target.getAttribute("class") == "btn-buy" ? target : target.parentNode;

    let cnt = root.firstElementChild.value;
    modalBackBuyThisCnt.setAttribute("max", cnt);

    let buyForm = document.getElementById("buy-form");
    action = buyForm.action + root.firstElementChild.id;

    mostrarModal(modalBackBuyThis, modalBuyThis);
    modalBackBuyThisCnt.value = 1;
  });
});

document.addEventListener("click", (e) => {
  switch (e.target) {
    case modalBackBuyThis:
      mostrarModal(modalBackBuyThis, modalBuyThis);
      break;
    case cancelBtnBuy:
      mostrarModal(modalBackBuyThis, modalBuyThis);

      break;
  }
});
