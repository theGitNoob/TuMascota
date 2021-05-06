document.addEventListener("DOMContentLoaded", () => {
  let petImages = document.querySelectorAll(".container-pet-img > img");
  loadImg(0);
  function loadImg(idx) {
    if (idx >= petImages.length) return;
    let imgNode = petImages[idx];
    imgNode.src += imgNode.id + imgNode.getAttribute("extension");
    let url = imgNode.getAttribute("url");
    imgNode.src = `${url}${imgNode.id}${imgNode.getAttribute("extension")}`;
    imgNode.onload = () => {
      loadImg(idx + 1);
    };
  }
});
