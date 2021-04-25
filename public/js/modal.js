const firstElement = document.querySelector("#first-element-contact-us");
const secondElement = document.querySelector("#second-element-contact-us");
const modalBack = document.querySelectorAll(".modal-back");
const modalContact = document.querySelector("#modal-contact");
const modalAbout = document.querySelector("#modal-about");

firstElement.addEventListener("click", () => {
    modalBack[0].classList.toggle("show-modal-back");
    modalContact.classList.toggle("show-modal");
});

secondElement.addEventListener("click", () => {
    modalBack[1].classList.toggle("show-modal-back");
    modalAbout.classList.toggle("show-modal");
});

window.addEventListener("click", (e) => {
    if (e.target == modalBack[0]) {
        modalBack[0].classList.toggle("show-modal-back");
        modalContact.classList.toggle("show-modal");
    } else if (e.target == modalBack[1]) {
        modalBack[1].classList.toggle("show-modal-back");
        modalAbout.classList.toggle("show-modal");
    }
});
