const btnBuyArr = document.querySelectorAll(".btn-buy");
const modalBackNeedAccount = document.querySelector("#modal-back-need-account");
// const modalNeedAccount = modalBackNeedAccount.modalBackNeedAccount.firstElementChild;
const modalNeedAccount = document.querySelector("#modal-need-account");
const modalBackBuy = document.querySelector(".modal-back-buy");
const modalBuy = modalBackBuy.firstElementChild;

const acceptBtnBuy = document.querySelector("#accept-btn-buy");
const cancelBtnBuy = document.querySelector("#cancel-btn-buy");

var buyCnt = modalBackBuy.querySelector(".spin-box-buy");
const plusBtn = document.querySelector(".plus-btn");
const lessBtn = document.querySelector(".less-btn");

const articlesNames = document.querySelectorAll(".article-name");
const modalArticleType = document.querySelector("#modal-article-type");
const modalPetBreed = document.querySelector("#modal-pet-breed");
const dataPetBreed = document.querySelectorAll(".article-info-title[data-pet-breed]");
const maxCount = document.querySelector("#max-cnt");

buyCnt.addEventListener("change", function () {
    var parseValue = parseInt(buyCnt.value);
    var parseValueMax = parseInt(buyCnt.getAttribute("max"));
    if (parseValue >= parseValueMax) {
        buyCnt.value = buyCnt.max;
    }
});

plusBtn.addEventListener("click", function () {
    var parseValue = parseInt(buyCnt.value);
    var parseValueMax = parseInt(buyCnt.getAttribute("max"));

    if (parseValue + 1 <= parseValueMax) buyCnt.value = parseInt(buyCnt.value) + 1;
});

lessBtn.addEventListener("click", function () {
    var parseValue = parseInt(buyCnt.value);

    if (parseValue > 1) {
        buyCnt.value = parseInt(buyCnt.value) - 1;
    }
});

function confirmBuyCheck(article) {
    const articleId = article.getAttribute("id");
    const articleData = {
        id: articleId,
        cnt: buyCnt.value,
    };
    // console.log(articleData);
    const location = window.location.pathname;
    var xhr;
    if (location === "/mascotas") xhr = makeRequest("POST", "/ordenes/mascotas", articleData);
    else if (location === "/accesorios") xhr = makeRequest("POST", "/ordenes/accesorios", articleData);

    xhr.onload = function () {
        console.log(xhr.response);
        if (xhr.status === 200) {
            mostrarModal(modalBackBuy, modalBuy, 0);
            animCompleted(1);
        }
        // console.log("pepe", { xhr });
        if (xhr.status === 401) {
            mostrarModal(modalBackBuy, modalBuy, 0);
            setTimeout(function () {
                setTimeout(function () {
                    mostrarModal(modalBackNeedAccount, modalNeedAccount, 1);
                }, 400);
            }, 650);
            // const errorsMsg = JSON.parse(xhr.response);
            // addAlert("error", errorsMsg.errors);
        }
        if (xhr.status === 500) {
            addAlert("error", ["Error Interno del servidor"]);
        }
    };
}

var btnBuyActive;
acceptBtnBuy.addEventListener("click", function (event) {
    event.preventDefault();
    var currentArticle = btnBuyActive;
    while (!currentArticle.classList.contains("article-container")) {
        currentArticle = currentArticle.parentNode;
    }
    confirmBuyCheck(currentArticle);
});

for (var idx = 0; idx < btnBuyArr.length; idx++) {
    var btnBuy = btnBuyArr[idx];
    btnBuy.addEventListener("click", function (e) {
        btnBuyActive = this;
        if (e.target.classList.contains("btn-buy")) {
            buyCnt.setAttribute("max", e.target.firstElementChild.value);
            maxCount.innerText = " ( " + e.target.firstElementChild.value + " ) ";
        } else {
            buyCnt.setAttribute("max", e.target.parentNode.firstElementChild.value);
            maxCount.innerText = " ( " + e.target.parentNode.firstElementChild.value + " ) ";
        }
        var ind = 0;
        for (var it = 0; it < btnBuyArr.length; it++) {
            if (btnBuyArr[it] == this) {
                ind = it;
            }
        }

        modalArticleType.innerText = " un " + articlesNames[ind].innerText;
        if (modalPetBreed) {
            modalPetBreed.innerText = dataPetBreed[ind].getAttribute("data-pet-breed");
        }

        mostrarModal(modalBackBuy, modalBuy, 1);
        buyCnt.value = 1;
    });
}

document.addEventListener("click", (e) => {
    switch (e.target) {
        case modalBackBuy:
            mostrarModal(modalBackBuy, modalBuy, 0);
            break;
        case modalBackNeedAccount:
            mostrarModal(modalBackNeedAccount, modalNeedAccount, 0);
            break;
        case cancelBtnBuy:
            mostrarModal(modalBackBuy, modalBuy, 0);
            break;
    }
});
