const btnBuyArr = document.querySelectorAll(".btn-buy");
const modalBackBuyThis = document.querySelector(".modal-back-buy-this");
const modalBuyThis = modalBackBuyThis.firstElementChild;

const acceptBtnBuy = document.querySelector("#accept-btn-buy");
const cancelBtnBuy = document.querySelector("#cancel-btn-buy");

let modalBackBuyThisCnt = modalBackBuyThis.querySelector(".spin-box-buy");
const plusBtn = document.querySelector(".plus-btn");
const lessBtn = document.querySelector(".less-btn");

const articlesNames = document.querySelectorAll(".article-name");
const modalArticleType = document.querySelector("#modal-article-type");
const modalPetBreed = document.querySelector("#modal-pet-breed");
const dataPetBreed = document.querySelectorAll(".article-info-title[data-pet-breed]");
const maxCount = document.querySelector("#max-cnt");

if (modalBackBuyThisCnt && plusBtn && lessBtn) {
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

        if (parseValue + 1 <= parseValueMax) modalBackBuyThisCnt.value = parseInt(modalBackBuyThisCnt.value) + 1;
    });

    lessBtn.addEventListener("click", () => {
        let parseValue = parseInt(modalBackBuyThisCnt.value);

        if (parseValue > 1) {
            modalBackBuyThisCnt.value = parseInt(modalBackBuyThisCnt.value) - 1;
        }
    });

    function confirmBuyCheck(article) {
        const articleId = article.getAttribute("id");
        const articleData = {
            id: articleId,
            cnt: modalBackBuyThisCnt.value,
        };
        console.log(articleData);
        const location = window.location.pathname;
        let xhr = "";
        if (location === "/mascotas") xhr = makeRequest("POST", "/ordenes/mascotas", articleData);
        else if (location === "/accesorios") xhr = makeRequest("POST", "/ordenes/accesorios", articleData);

        xhr.onload = function () {
            console.log(xhr.response);
            if (xhr.status === 200) {
                modalBackBuyThis.click();
                animCompleted(1);
            }
            console.log({ xhr });
            if (xhr.status === 400) {
                const errorsMsg = JSON.parse(xhr.response);
                addAlert("error", errorsMsg.errors);
            }
            if (xhr.status === 500) {
                addAlert("error", ["Error Interno del servidor"]);
            }
        };
    }

    let btnBuyActive;
    acceptBtnBuy.addEventListener("click", (event) => {
        event.preventDefault();
        console.log("PREVENT!!!!!!!!!!!!!!!!!!!!!");
        let currentArticle = btnBuyActive;
        while (!currentArticle.classList.contains("article-container")) {
            currentArticle = currentArticle.parentNode;
        }
        confirmBuyCheck(currentArticle);
    });

    btnBuyArr.forEach(function (btnBuy, ind) {
        btnBuy.addEventListener("click", (e) => {
            btnBuyActive = btnBuy;
            if (e.target.getAttribute("class") === "btn-buy") {
                modalBackBuyThisCnt.setAttribute("max", e.target.firstElementChild.value);
                maxCount.innerText = " ( " + e.target.firstElementChild.value + " ) ";
            } else {
                modalBackBuyThisCnt.setAttribute("max", e.target.parentNode.firstElementChild.value);
                maxCount.innerText = " ( " + e.target.parentNode.firstElementChild.value + " ) ";
            }

            modalArticleType.innerText = " un " + articlesNames[ind].innerText;
            if (modalPetBreed) {
                modalPetBreed.innerText = dataPetBreed[ind].getAttribute("data-pet-breed");
            }

            mostrarModal(modalBackBuyThis, modalBuyThis, 1);
            modalBackBuyThisCnt.value = 1;
        });
    });
} else {
    btnBuyArr.forEach(function (btn) {
        btn.addEventListener("click", function () {
            mostrarModal(modalBackBuyThis, modalBuyThis, 1);
        });
    });
}

document.addEventListener("click", (e) => {
    switch (e.target) {
        case modalBackBuyThis:
            mostrarModal(modalBackBuyThis, modalBuyThis, 0);
            break;
        case cancelBtnBuy:
            mostrarModal(modalBackBuyThis, modalBuyThis, 0);
            break;
    }
});
