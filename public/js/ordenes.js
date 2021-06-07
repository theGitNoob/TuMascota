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

document.querySelector(".filter-orders-menu").firstChild.click();
/*Esto es para la alerta de cancelar*/
btnCancelOrder.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    animarModalAlert();

    let cancelBtn = document.querySelector(".btn-alert.btn-alert-confirm");
    let node = e.target;
    let action = node.formAction;
    let method = node.formMethod;

    cancelBtn.onclick = (e) => {
      e.preventDefault();
      console.log(action, method);
      let req = new XMLHttpRequest();
      req.open(method, action);

      req.onload = function () {
        if (req.status == 200) {
          let cart = document.querySelector(".login-count-msj.orders-msj");
          let orders = Number(cart.textContent);

          cart.textContent = --orders;

          let root = node.parentNode.parentNode;
          let nodes = root.querySelectorAll("[data-state='pendient']");
          root.style = "display:none";
          for (const node of nodes) {
            node.setAttribute("data-state", "canceled");
          }
          nodes[1].textContent = "CANCELED";
          let img = document.createElement("img");
          img.src = "/public/img/res/borrar.png";
          nodes[1].appendChild(img);
          root.querySelector(".btn-cancel").remove();
        }
      };
      req.send();
    };
  });
});
