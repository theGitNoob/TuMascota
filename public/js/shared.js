const modalBackContact = document.querySelector("#modal-back-contact");
const modalBackAbout = document.querySelector("#modal-back-about");
// const modalContact = document.querySelector("#modal-contact");
// const modalAbout = document.querySelector("#modal-about");
const modalContact = modalBackContact.firstElementChild;
const modalAbout = modalBackAbout.firstElementChild;
const closeModal = document.querySelectorAll(".modal-close");
const goTop = document.querySelector(".go-top");
const contactUs = document.querySelectorAll(".contact-us");
const aboutUs = document.querySelectorAll(".about-us");

function goTopScroll() {
    let scrY = window.pageYOffset;
    if (scrY > 200) {
        goTop.style.opacity = "1";
        goTop.style.visibility = "visible";
    } else {
        goTop.style.opacity = "0";
        goTop.style.visibility = "hidden";
    }
}

function makeRequest(requestType, url, userData) {
    console.log("ENTRO A SHARED", requestType, url, userData);
    const xhr = new XMLHttpRequest();
    xhr.open(requestType, url);
    xhr.setRequestHeader("Content-Type", "application/json");
    if (userData) xhr.send(JSON.stringify(userData));
    else xhr.send();
    return xhr;
}

// goTopScroll();
window.addEventListener("scroll", () => {
    goTopScroll();
});

function mostrarModal(modalback, modal, state) {
    if (!state) {
        /* esto es para que esperes un corto tiempo antes de poder quitar la modal, hay una excepcion en para el modal de 
		completado en modal-completed.js */
        setTimeout(function () {
            modal.classList.add("hide-modal");
            setTimeout(function () {
                modalback.classList.remove("show-modal-back");
                modal.classList.remove("show-modal");
                modal.classList.remove("hide-modal");
            }, 650);
        }, 400);
    } else if (state) {
        modalback.classList.add("show-modal-back");
        modal.classList.add("show-modal");
        if (modalback.classList.contains("show-modal-back") && modal.classList.contains("show-modal")) {
            modalback.style.zIndex = "9";
            modal.style.zIndex = "9";
        } else {
            modalback.style.zIndex = "1";
            modal.style.zIndex = "1";
        }
    }
}

/*Mostrar las modal de contacto y acerca de, funciona tanto desde el menu como desde el footer*/
contactUs.forEach(function (btn) {
    btn.addEventListener("click", function () {
        mostrarModal(modalBackContact, modalContact, 1);
    });
});

aboutUs.forEach(function (btn) {
    btn.addEventListener("click", function () {
        mostrarModal(modalBackAbout, modalAbout, 1);
    });
});

closeModal.forEach(function (btn) {
    btn.addEventListener("click", function () {
        let backModal = btn.parentElement.parentElement.parentElement;
        let modal = btn.parentElement.parentElement;
        mostrarModal(backModal, modal, 0);
    });
});

document.addEventListener("click", function (e) {
    switch (e.target) {
        case modalBackContact:
            mostrarModal(modalBackContact, modalContact, 0);
            break;
        case modalBackAbout:
            mostrarModal(modalBackAbout, modalAbout, 0);
            break;
    }
});
