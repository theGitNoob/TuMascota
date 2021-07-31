const firstElement = document.querySelector("#first-element-contact-us");
const secondElement = document.querySelector("#second-element-contact-us");
const modalBackContact = document.querySelector("#modal-back-contact");
const modalBackAbout = document.querySelector("#modal-back-about");
const modalContact = modalBackContact.firstElementChild;
const modalAbout = modalBackAbout.firstElementChild;
const goTop = document.querySelector(".go-top");

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

// goTopScroll();
window.addEventListener("scroll", () => {
    goTopScroll();
});

function mostrarModal(modalback, modal) {
    if (
        modalback.classList.contains("show-modal-back") &&
        modal.classList.contains("show-modal")
    ) {
        modal.classList.toggle("hide-modal");
        setTimeout(() => {
            modalback.classList.toggle("show-modal-back");
            modal.classList.toggle("show-modal");
            modal.classList.toggle("hide-modal");
        }, 650);
    } else {
        modalback.classList.toggle("show-modal-back");
        modal.classList.toggle("show-modal");
        if (
            modalback.classList.contains("show-modal-back") &&
            modal.classList.contains("show-modal")
        ) {
            modalback.style.zIndex = "9";
            modal.style.zIndex = "9";
        } else {
            modalback.style.zIndex = "1";
            modal.style.zIndex = "1";
        }
    }
}

document.addEventListener("click", function (e) {
    switch (e.target) {
        case modalBackContact:
            mostrarModal(modalBackContact, modalContact);
            break;
        case modalBackAbout:
            mostrarModal(modalBackAbout, modalAbout);
            break;
    }
});
