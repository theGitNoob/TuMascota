const btnBuyArr = document.querySelectorAll(".btn-buy");

const modalBackBuyThis = document.querySelector(".modal-back-buy-this");

// const modalBuyThis = document.querySelector(".modal-buy-this");
const modalBuyThis = modalBackBuyThis.firstElementChild;

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

    if (parseValue > 1) {
        modalBackBuyThisCnt.value = parseInt(modalBackBuyThisCnt.value) - 1;
    }
});

acceptBtnBuy.addEventListener("click", () => {
    modalBackBuyThis.click();
    animCompleted(1);
});

btnBuyArr.forEach((btnBuy) => {
    btnBuy.addEventListener("click", (e) => {
        if (e.target.getAttribute("class") == "btn-buy") {
            modalBackBuyThisCnt.setAttribute(
                "max",
                e.target.firstElementChild.value
            );
            // modalBackBuyThisCnt.max = e.target.firstElementChild.value;
        } else {
            modalBackBuyThisCnt.setAttribute(
                "max",
                e.target.parentNode.firstElementChild.value
            );
            // modalBackBuyThisCnt.max = e.target.parentNode.firstElementChild.value;
        }
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
