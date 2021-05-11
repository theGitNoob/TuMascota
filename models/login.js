const avatar = document.querySelector("#avatar-login");
//Registrarse
const menuLogin = document.querySelector("#login-section");
const accessForm = document.querySelector(".access-form");
const registerForm = document.querySelector(".register-form");
const accessSpan = document.querySelector("#access");
const registerSpan = document.querySelector("#register");
//Fin Registrarse

const menuAccount = document.querySelector("#account-section");

/*
Aqui es donde elijo que menu mostrar, configurarlo a tu gusto
menuLogin es cuando no estas logueado
menuAccount es cuando estas logueado
*/
avatar.addEventListener("click", () => {
  menuAccount.classList.toggle("show-login-menu");
  setTimeout(() => {
    accessSpan.click();
  }, 600);
});

accessSpan.addEventListener("click", () => {
  if (
    accessSpan.firstElementChild.classList.contains("hide-line") &&
    !accessSpan.firstElementChild.classList.contains("anim-line")
  ) {
    accessSpan.firstElementChild.classList.toggle("hide-line");
    accessSpan.firstElementChild.classList.toggle("anim-line");

    accessForm.style.transform = "scale(1)";
    accessForm.classList.toggle("show-form");
    accessForm.classList.toggle("change-access-form");
    registerForm.classList.toggle("show-register-form");
  }
  if (
    !registerSpan.firstElementChild.classList.contains("hide-line") &&
    registerSpan.firstElementChild.classList.contains("anim-line")
  ) {
    registerSpan.firstElementChild.classList.toggle("hide-line");
    registerSpan.firstElementChild.classList.toggle("anim-line");
  }
});

registerSpan.addEventListener("click", () => {
  if (registerSpan.firstElementChild.classList.contains("hide-line")) {
    registerSpan.firstElementChild.classList.toggle("hide-line");
    registerSpan.firstElementChild.classList.toggle("anim-line");

    accessForm.classList.toggle("show-form");
    accessForm.classList.toggle("change-access-form");
    registerForm.classList.toggle("show-register-form");
    accessForm.style.transform = "scale(0)";
  }
  if (
    !accessSpan.firstElementChild.classList.contains("hide-line") &&
    accessSpan.firstElementChild.classList.contains("anim-line")
  ) {
    accessSpan.firstElementChild.classList.toggle("hide-line");
    accessSpan.firstElementChild.classList.toggle("anim-line");
  }
});
