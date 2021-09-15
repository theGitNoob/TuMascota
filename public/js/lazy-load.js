document.addEventListener("DOMContentLoaded", () => {
  let images = document.querySelectorAll(".pet-img");
  if (images.length == 0) images = document.querySelectorAll(".article-img");
  loadImg(0);
  function loadImg(idx) {
    if (idx >= images.length) return;
    let imgNode = images[idx];
    imgNode.src += imgNode.id + imgNode.getAttribute("extension");
    let url = imgNode.getAttribute("url");
    imgNode.src = `${url}${imgNode.id}.${imgNode.getAttribute("extension")}`;
    imgNode.onload = () => {
      loadImg(idx + 1);
    };
  }
});
