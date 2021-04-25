"use strict";
window.addEventListener("DOMContentLoaded", (e) => {
  console.log("dsadasadsasd");
  let forms = document.getElementsByClassName("delete-form");

  for (let form of forms) {
    form.onsubmit = submitHandler;
  }

  function submitHandler(e) {
    console.log(e);
    let res = window.confirm("Esta seguro q desea eliminar este elemento");
    console.log(res);
    if (!res) {
      e.preventDefault();
    }
  }
});
