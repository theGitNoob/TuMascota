const filterSection = document.querySelector(".filter");
const filterSubMenuBtn = document.querySelector(".filter-btn");
const filterSubMenuBtnImg = document.querySelector(".filter-btn img");
const filterSubMenu = document.querySelector(".filter-form");

//Así lo tiene jesus
//const filterBtnSub = filterSubMenu.childNodes[5];
//Dberia ser asi
const filterBtnSub = document.querySelector(".filter-form__submit");

filterBtnSub.addEventListener("click", () => {
  filterSubMenu.classList.toggle("show-filter-form");
});

filterSubMenuBtn.addEventListener("click", () => {
  filterSection.style.height =
    parseInt(getComputedStyle(filterSubMenu).height) + 60 + "px";
  if (filterSubMenu.classList.contains("show-filter-form")) {
    filterSection.style.height = "2.5rem";
    filterSubMenuBtnImg.style.transform = "rotate(90deg)";
  } else {
    filterSubMenuBtnImg.style.transform = "rotate(180deg)";
  }

  filterSubMenu.classList.toggle("show-filter-form");
});

window.addEventListener("resize", function () {
  if (filterSubMenu.classList.contains("show-filter-form")) {
    filterSection.style.height =
      parseInt(getComputedStyle(filterSubMenu).height) + 60 + "px";
  }
});
