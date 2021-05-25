const avatar = document.querySelector("#avatar-login");
const orders = document.querySelector("#orders-login");
const notifications = document.querySelector("#bell-login");

const menuAccount = document.querySelector("#account-section");
const bellSubMenu = document.querySelector("#bell-section");

const menuGoLogin = document.querySelector("#go-login");

/*
Rafa cuando no estas logueado solo te va a aparecer los botones de logueo
asi que los iconos de avatar, order y notification van a estar
con display:none
Ya tu lo cambias a display:inline-block una vez que te loguees:)

Y entonces a los dos botones de acceder y registrarse le pones
display:none

si estas logueado ponle al c

:)
 */

avatar.addEventListener("click", () => {
  menuAccount.classList.toggle("show-login-menu");
  //   if (bellSubMenu.classList.contains("show-login-menu")) {
  //     bellSubMenu.classList.toggle("show-login-menu");
  //   }
});

notifications.addEventListener("click", () => {
  bellSubMenu.classList.toggle("show-login-menu");

  //   if (menuAccount.classList.contains("show-login-menu")) {
  //     menuAccount.classList.toggle("show-login-menu");
  //   }
});

document.addEventListener("click", (e) => {
  if (
    e.target != avatar &&
    e.target != notifications.firstElementChild &&
    e.target != notifications.childNodes[3]
  ) {
    if (menuAccount.classList.contains("show-login-menu")) {
      if (e.target != menuAccount.firstElementChild.firstElementChild)
        menuAccount.classList.toggle("show-login-menu");
    }
    if (bellSubMenu.classList.contains("show-login-menu")) {
      if (
        e.path[0].getAttribute("class") != "bell-submenu-element" &&
        e.target.getAttribute("class") != "bell-time" &&
        e.target.getAttribute("class") != "remove-notifications" &&
        e.target.parentElement.getAttribute("class") != "remove-notifications"
      ) {
        // console.log(e.path[0]);
        bellSubMenu.classList.toggle("show-login-menu");
      }
    }
  }
  // console.log(e.path);
});
