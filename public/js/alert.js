let arr = document.querySelectorAll(".alert");
setTimeout(() => {
  arr.forEach((elem) => elem.remove());
}, 3000);
