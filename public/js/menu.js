const menuIcon = document.querySelector(".menu-icon");
const navMenu = document.querySelector(".nav-menu");

function mostrarMenu() {
  navMenu.classList.toggle("show-menu");
  menuIcon.classList.toggle("hide-menu-icon");
}

// window.addEventListener("click", (e) => {
//   if (
//     e.target != navMenu &&
//     e.target != menuIcon &&
//     navMenu.classList.contains("show-menu")
//   ) {
//     mostrarMenu();
//   }
// });
