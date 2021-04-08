const menuIcon = document.querySelector(".menu-icon");
const navMenu = document.querySelector(".nav-menu");

menuIcon.addEventListener("click", mostrarMenu);

function mostrarMenu() {
    navMenu.classList.toggle("show-menu");
}

window.addEventListener("click", (e) => {
    if (
        // e.target != navMenu &&
        e.target != menuIcon &&
        navMenu.classList.contains("show-menu")
    )
        navMenu.classList.toggle("show-menu");
});
