const orderStates = document.querySelectorAll(".order-state");
const filtros = document.querySelectorAll(".filter-order");

const btnCancelOrder = document.querySelectorAll(".btn-cancel");

/*Esto es para editar los estados de las ordenes*/
orderStates.forEach((ord) => {
  if (ord.getAttribute("data-state") == "onway") {
    let node = document.createElement("img");
    node.src = "/public/img/res/entrega.png";
    ord.appendChild(node);
  }
  if (ord.getAttribute("data-state") == "canceled") {
    let node = document.createElement("img");
    node.src = "/public/img/res/borrar.png";
    ord.appendChild(node);
  }
  if (ord.getAttribute("data-state") == "aproved") {
    let node = document.createElement("img");
    node.src = "/public/img/res/completadas.svg";
    ord.appendChild(node);
  }
  if (ord.getAttribute("data-state") == "pendient") {
    let node = document.createElement("span");
    node.classList.add("pendient");
    node.innerHTML = "!";
    ord.appendChild(node);
  }
  if (ord.getAttribute("data-state") == "completed") {
    let node = document.createElement("span");
    node.innerHTML = "";
    ord.appendChild(node);
  }
});

/*Esto es para filtrar las ordenes*/
filtros.forEach((f) => {
  f.addEventListener("click", () => {
    for (c of f.parentElement.childNodes) {
      if (c.hasAttribute) c.classList.remove("active");
    }
    f.classList.add("active");
    orderStates.forEach((ord) => {
      if (ord.getAttribute("data-state") != f.getAttribute("data-state")) {
        if (
          ord.parentElement.parentElement.getAttribute("class") ==
          "order-container"
        )
          ord.parentElement.parentElement.style.display = "none";
      } else {
        if (
          ord.parentElement.parentElement.getAttribute("class") ==
          "order-container"
        )
          ord.parentElement.parentElement.style.display = "block";
      }
    });
  });
});

/*Esto es para la alerta de cancelar*/
btnCancelOrder.forEach((btn) => {
  btn.addEventListener("click", () => {
    animarModalAlert();
  });
});
