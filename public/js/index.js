const firstElement = document.querySelector("#first-element-contact-us");
const secondElement = document.querySelector("#second-element-contact-us");
const modalBackContact = document.querySelector("#modal-back-contact");
const modalBackAbout = document.querySelector("#modal-back-about");
const modalContact = document.querySelector("#modal-contact");
const modalAbout = document.querySelector("#modal-about");

firstElement.addEventListener("click", () => {
    mostrarModal(modalBackContact, modalContact);
});

secondElement.addEventListener("click", () => {
    mostrarModal(modalBackAbout, modalAbout);
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
            modalback.style.zIndex = "2";
            modal.style.zIndex = "2";
        } else {
            modalback.style.zIndex = "1";
            modal.style.zIndex = "1";
        }
    }
}

document.addEventListener("click", (e) => {
    switch (e.target) {
        case modalBackContact:
            mostrarModal(modalBackContact, modalContact);
            break;
        case modalBackAbout:
            mostrarModal(modalBackAbout, modalAbout);
            break;
    }
});
