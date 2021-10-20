// document.querySelector("main").style.background = "green";
const galleryArticles = document.createElement("section");
galleryArticles.classList.add("modal-back");
galleryArticles.classList.add("modal-gallery-back");
galleryArticles.innerHTML =
    "<div class='modal modal-gallery'> <div class='modal-gallery__image-container'> <img class='modal-gallery__image' src='' alt=''> </div> </div><button class='modal-close' type='submit'> <img class='modal-close__icon' src='public/img/res/close-white.webp'> </button><div class='modal-gallery__pictures-list'> </div>";
document.body.appendChild(galleryArticles);

// // aqui selecciono todas las imagenes de la seccion mascotas o accesorios
const articleImgContainer = document.querySelectorAll(".article-img-container"),
    galleryImg = galleryArticles.querySelector(".modal-gallery__image"),
    galleryPicturesList = galleryArticles.querySelector(
        ".modal-gallery__pictures-list"
    );

function setModalGalleryImg(imgSrc) {
    galleryImg.src = imgSrc;
    // console.log(imgSrc);
}

function setGalleryPictures(images) {
    // main.style.background = "black";
    // Reseteo la galleria
    // if (galleryPicturesList.childElementCount > 0) {
    while (galleryPicturesList.childElementCount > 0) {
        galleryPicturesList.removeChild(galleryPicturesList.firstElementChild);
    }
    // }
    // Añado los elementos a la galeria
    for (var it = 0; it < images.length; it++) {
        var imgNode = document.createElement("div");
        imgNode.classList.add("modal-gallery__picture");
        imgNode.innerHTML = "<img src='" + images[it] + "' alt='articulo'>";
        galleryPicturesList.appendChild(imgNode);
    }
    // for (it of images) {
    //     console.log(it);
    //     var imgNode = document.createElement("div");
    //     imgNode.classList.add("modal-gallery__picture");
    //     imgNode.innerHTML = "<img src='" + it + "' alt='articulo'>";
    //     galleryPicturesList.appendChild(imgNode);
    // }
    //Añado los eventos de click para cambiar las imagenes en la galeria
    for (var img = 0; img < galleryPicturesList.children.length; img++) {
        var el = galleryPicturesList.children[img];
        el.addEventListener("click", function () {
            setModalGalleryImg(this.firstElementChild.src);
        });
    }
    // for (img of galleryPicturesList.children) {
    //     img.addEventListener("click", function () {
    //         setModalGalleryImg(this.firstElementChild.src);
    //     });
    // }
}

function showGallery(state) {
    mostrarModal(galleryArticles, galleryArticles.firstElementChild, state);
    if (!state)
        galleryPicturesList.classList.remove("show-gallery__pictures-list");
    else {
        galleryPicturesList.classList.add("show-gallery__pictures-list");
    }
}

// /*Aqui le asigno a la galeria la imagen clickeada*/

for (var img = 0; img < articleImgContainer.length; img++) {
    var el = articleImgContainer[img];
    el.addEventListener("click", function () {
        setModalGalleryImg(this.firstElementChild.src);
        if (!galleryArticles.classList.contains("show-modal-back")) {
            showGallery(1);
        }

        const id = this.parentNode.id;
        console.log(id);
        const request = new XMLHttpRequest();

        const path = document.location.pathname;

        var requestUrl;
        if (path === "/mascotas") {
            requestUrl = "/mascotas/" + id + "/images";
        } else if (path == "/accesorios") {
            requestUrl = "/accesorios/" + id + "/images";
        }

        request.open("GET", requestUrl);
        request.responseType = "json";
        request.send();

        request.onload = function () {
            const images = request.response;
            // main.innerText = request.response;
            // main.style.background = "yellow";
            setGalleryPictures(images);
        };
    });
}

// alert("hola");
// document.querySelector("main").style.background = "blue";

// // articleImgContainer.forEach(function (img) {
// //     img.addEventListener("click", function () {
// //         setModalGalleryImg(img.firstElementChild.src);
// //         if (!galleryArticles.classList.contains("show-modal-back")) {
// //             showGallery(1);
// //         }

// //         var id = img.parentNode.id;
// //         console.log(id);
// //         const request = new XMLHttpRequest();

// //         var path = document.location.pathname;

// //         var requestUrl;
// //         if (path.startsWith("/mascotas")) {
// //             requestUrl = `/mascotas/${id}/images`;
// //         } else if (path.startsWith("/accesorios")) {
// //             requestUrl = `/accesorios/${id}/images`;
// //         }

// //         request.open("GET", requestUrl);
// //         request.responseType = "json";
// //         request.send();

// //         request.onload = function () {
// //             const images = request.response;
// //             setGalleryPictures(images);
// //         };
// //     });
// // });

document.addEventListener("click", function (e) {
    //Aqui defino por donde cerrar la galeria, actualmente solo la tengo que se cierre por el boton de la X
    // if (e.target === galleryArticles) {
    //     if (galleryArticles.classList.contains("show-modal-back")) {
    //         showGallery(0);
    //     }
    // }
    if (
        e.target.classList.contains("modal-close") ||
        e.target.classList.contains("modal-close__icon") ||
        e.target.classList.contains("modal-back")
    ) {
        if (galleryArticles.classList.contains("show-modal-back")) {
            showGallery(0);
        }
    }
});
