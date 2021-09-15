let socket = io();
socket.on("product update", (message) => {
  let info = JSON.parse(message);

  let container = document.getElementById(info.id);

  if (container !== null) {
    if (info.cnt == 0) {
      container.style = "display:none";
    }
    container.querySelector(".cnt").textContent = info.cnt;
  }
});
