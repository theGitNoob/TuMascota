const menuIcon = document.querySelector(".menu-icon");
const navMenu = document.querySelector(".nav-menu");
const navMenuElements = document.querySelectorAll(".nav-menu__element");
const subMenuPet = document.querySelector("#pet-submenu");
const subMenuServices = document.querySelector("#services-menu");
const submenuIcon = document.querySelectorAll(".show-submenu-img");
const submenu = document.querySelectorAll(".submenu");
const containerHeaderLogin = document.querySelectorAll(".main-header__container-login");

menuIcon.addEventListener("click", mostrarMenu);
// /*Mostrar el NavMenu*/
function mostrarMenu() {
    navMenu.classList.toggle("show-menu");
    menuIcon.classList.toggle("hide-menu-icon");

    if (navMenu.classList.contains("show-menu")) {
        for (var cont = 0; cont < navMenuElements.length; cont++) {
            const el = navMenuElements[cont];
            el.classList.add("anim-element-scale");
            const calcDelay = 400 + cont * 60;
            el.style.animationDelay = calcDelay.toString() + "ms";
        }
    } else {
        for (var cont = 0; cont < navMenuElements.length; cont++) {
            navMenuElements[cont].classList.remove("anim-element-scale");
        }
    }

    /*Esto esconde las opciones del header como notificaciones,
    cuenta y ordenes cuando abres el menu*/
    if (navMenu.classList.contains("show-menu")) {
        containerHeaderLogin[0].style.opacity = "0";
        containerHeaderLogin[0].style.visibility = "hidden";
    } else {
        containerHeaderLogin[0].style.visibility = "visible";
        containerHeaderLogin[0].style.opacity = "1";
    }
}
// /*Mostrar el SubMenu de Mascotas*/
subMenuPet.addEventListener("click", mostrarSubMenuPet);
function mostrarSubMenuPet() {
    submenu[0].classList.toggle("show-submenu");
    submenuIcon[0].classList.toggle("rot-submenu-icon");
}

subMenuServices.addEventListener("click", mostrarSubMenuServices);
function mostrarSubMenuServices() {
    submenu[1].classList.toggle("show-submenu");
    submenuIcon[1].classList.toggle("rot-submenu-icon");
}

document.addEventListener("click", function (e) {
    if (
        e.target != submenuIcon[0] &&
        e.target != subMenuPet &&
        e.target != subMenuPet.children[0] &&
        e.target != subMenuPet.children[1]
    ) {
        if (submenu[0].classList.contains("show-submenu")) {
            mostrarSubMenuPet();
        }
    }
    if (
        e.target != submenuIcon[1] &&
        e.target != subMenuServices &&
        e.target != subMenuServices.children[0] &&
        e.target != subMenuServices.children[1]
    ) {
        if (submenu[1].classList.contains("show-submenu")) {
            mostrarSubMenuServices();
        }
    }
});

window.addEventListener("click", function (e) {
    if (
        e.target != navMenu &&
        e.target != menuIcon &&
        e.target != submenuIcon[0] &&
        e.target != submenuIcon[1] &&
        e.target != subMenuPet &&
        e.target != subMenuServices &&
        e.target != subMenuPet.children[0] &&
        e.target != subMenuPet.children[1] &&
        e.target != subMenuServices.children[0] &&
        e.target != subMenuServices.children[1] &&
        e.target != submenu[0].childNodes &&
        e.target != submenu[1] &&
        e.target != navMenu.firstElementChild.firstElementChild &&
        navMenu.classList.contains("show-menu")
    ) {
        mostrarMenu();
        if (submenu[0].classList.contains("show-submenu")) {
            mostrarSubMenuPet();
        }
        if (submenu[1].classList.contains("show-submenu")) {
            mostrarSubMenuServices();
        }
    }
});
