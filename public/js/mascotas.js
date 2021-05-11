const filterSubMenuBtn = document.querySelector(".filter-btn");
const filterSubMenu = document.querySelector(".filter-form");

const filterBtnSub = filterSubMenu.querySelector(".filter-btn.filter-btn-sub");

filterBtnSub.addEventListener("click", () => {
  filterSubMenu.classList.toggle("show-filter-form");
});

filterSubMenuBtn.addEventListener("click", () => {
  filterSubMenu.classList.toggle("show-filter-form");
});
