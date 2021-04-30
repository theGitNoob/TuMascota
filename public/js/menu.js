const menuIcon = document.querySelector(".menu-icon");
const navMenu = document.querySelector(".nav-menu");
const subMenuPet = document.querySelector("#pet-submenu");
const subMenuPetImg = document.querySelector("#pet-submenu > img");
const subMenuPetSpan = document.querySelector("#pet-submenu > span");
const subMenuServices = document.querySelector("#services-menu");
const subMenuServicesImg = document.querySelector("#services-submenu > img");
const subMenuServicesSpan = document.querySelector("#services-submenu > span");
const submenuIcon = document.querySelectorAll(".show-submenu-img");
const submenu = document.querySelectorAll(".submenu");

menuIcon.addEventListener("click", mostrarMenu);

/*Mostrar el NavMenu*/
function mostrarMenu() {
    navMenu.classList.toggle("show-menu");
    menuIcon.classList.toggle("hide-menu-icon");
}
/*Mostrar el SubMenu de Mascotas*/
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

document.addEventListener("click", (e) => {
    if (
        e.target != submenuIcon[0] &&
        e.target != subMenuPet &&
        e.target != subMenuPet.childNodes[1] &&
        e.target != subMenuPet.childNodes[3]
    ) {
        if (submenu[0].classList.contains("show-submenu")) {
            mostrarSubMenuPet();
        }
    }
    if (
        e.target != submenuIcon[1] &&
        e.target != subMenuServices &&
        e.target != subMenuServices.childNodes[1] &&
        e.target != subMenuServices.childNodes[3]
    ) {
        if (submenu[1].classList.contains("show-submenu")) {
            mostrarSubMenuServices();
        }
    }
});

window.addEventListener("click", (e) => {
    if (
        e.target != navMenu &&
        e.target != menuIcon &&
        e.target != submenuIcon[0] &&
        e.target != submenuIcon[1] &&
        e.target != subMenuPet &&
        e.target != subMenuServices &&
        e.target != subMenuPet.childNodes[1] &&
        e.target != subMenuPet.childNodes[3] &&
        e.target != subMenuServices.childNodes[1] &&
        e.target != subMenuServices.childNodes[3] &&
        e.target != submenu[0].childNodes &&
        e.target != submenu[1] &&
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
