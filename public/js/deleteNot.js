let req = new XMLHttpRequest();

req.open("delete", `/users/messages/60d4b4dee1f2b058fcbbd773`);
req.send();

req.onload = function () {
  console.log(req.status);
};
