function sendReq(nodes, url, method, callback) {
  let data = "";
  nodes.forEach((element) => {
    if (element.type == "checkbox" && element.checked == false) {
      return;
    }
    data +=
      encodeURIComponent(element.name) +
      "=" +
      encodeURIComponent(element.value) +
      "&";
  });
  let req = new XMLHttpRequest();

  req.open(method, url);
  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  req.onload = function () {
    callback(req);
  };
  req.send(data);
}

// let form = document.forms[0];
// let nodes = form.querySelectorAll("[name]");
// sendReq(nodes, form.action, form.method, (req) => {
//   if (req.status === 200) {
//     //Hacer la animacion
//     animCompleted(0);
//     setTimeout(changeBack, 2700);
//   }
//   if (req.status === 400) {
//     const errors = JSON.parse(req.response);
//     addAlert("warning", errors);
//   }
// });
