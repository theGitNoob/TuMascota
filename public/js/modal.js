const btnBuyArr = document.querySelectorAll(".btn-buy");

const modalBackBuyThis = document.querySelector(".modal-back-buy");

const modalBuyThis = modalBackBuyThis.firstElementChild;

const acceptBtnBuy = document.querySelector("#accept-btn-buy");
const cancelBtnBuy = document.querySelector("#cancel-btn-buy");

var modalBackBuyThisCnt = modalBackBuyThis.querySelector(".spin-box-buy");
const plusBtn = document.querySelector(".plus-btn");
const lessBtn = document.querySelector(".less-btn");

var action = "";

modalBackBuyThisCnt.addEventListener("change", () => {
    var parseValue = parseInt(modalBackBuyThisCnt.value);
    var parseValueMax = parseInt(modalBackBuyThisCnt.getAttribute("max"));
    if (parseValue >= parseValueMax) {
        modalBackBuyThisCnt.value = modalBackBuyThisCnt.max;
    }
});

plusBtn.addEventListener("click", () => {
    var parseValue = parseInt(modalBackBuyThisCnt.value);
    var parseValueMax = parseInt(modalBackBuyThisCnt.getAttribute("max"));

    if (parseValue + 1 <= parseValueMax)
        modalBackBuyThisCnt.value = parseInt(modalBackBuyThisCnt.value) + 1;
});

lessBtn.addEventListener("click", () => {
    var parseValue = parseInt(modalBackBuyThisCnt.value);

    if (parseValue > 1) {
        modalBackBuyThisCnt.value = parseInt(modalBackBuyThisCnt.value) - 1;
    }
});
acceptBtnBuy.addEventListener("click", (e) => {
    e.preventDefault();

    var buyForm = document.getElementById("buy-form");
    var node = buyForm.querySelector("input");
    var data = node.name + "=" + node.value;

    var req = new XMLHttpRequest();

    req.open("POST", action);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    req.onload = () => {
        console.log(req.status);
        if (req.status == 200) {
            var orders = document.querySelector(".login-count-msj.orders-msj");
            var orderCnt = Number(orders.textContent);
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
        var target = e.target;
        var root =
            target.getAttribute("class") == "btn-buy"
                ? target
                : target.parentNode;

        var cnt = root.firstElementChild.value;
        modalBackBuyThisCnt.setAttribute("max", cnt);

        var buyForm = document.getElementById("buy-form");
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
