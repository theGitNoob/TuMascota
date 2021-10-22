const galleryPictures = document.querySelectorAll(".home-gallery__picture");
const carrusel = document.getElementById("carrusel");
const homeTitle = document.querySelector(".home-title > strong");
const mediaQuery25rem = window.matchMedia("(min-width: 28rem)");
const mediaQuery38rem = window.matchMedia("(min-width: 38rem)");

function addCarruselIcons() {
    for (var it = 0; it < galleryPictures.length; it++) {
        var node = document.createElement("span");
        node.classList.add("carrusel__icon");
        carrusel.appendChild(node);
    }
}

addCarruselIcons();

const carrusellIcons = document.querySelectorAll(".carrusel__icon");

for (var cont = 0; cont < galleryPictures.length; cont++) {
    var picture = galleryPictures[cont];
    picture.style.display = "none";
}

//si estas en desktop, cambio los src de las imagenes de la galeria
function changeHomeTitle() {
    if (mediaQuery25rem.matches) {
        homeTitle.innerHTML = "Tienda de Mascotas y Accesorios";
        // console.log("Match!!");
    } else {
        homeTitle.innerHTML = "Tienda de <br> Mascotas y Accesorios";
        // console.log("!Not Match!!");
    }
}

function changeGalleryImages() {
    var srcArr;
    if (mediaQuery38rem.matches) {
        srcArr = [
            "/public/img/inicio/pet1.webp",
            "/public/img/inicio/pet2.webp",
            "/public/img/inicio/pet3.webp",
            "/public/img/inicio/pet4.webp",
        ];
    } else {
        srcArr = [
            "/public/img/inicio/pet1_mobile.png",
            "/public/img/inicio/pet2_mobile.png",
            "/public/img/inicio/pet3_mobile.png",
            "/public/img/inicio/pet4_mobile.png",
        ];
    }
    for (var it = 0; it < galleryPictures.length; it++) {
        var el = galleryPictures[it];
        el.src = srcArr[it];
    }
    // console.log("cambio de imagenes");
}

changeGalleryImages();
changeHomeTitle();

window.addEventListener("resize", function () {
    changeGalleryImages();
    changeHomeTitle();
});

galleryPictures[0].style.display = "inline-block";
galleryPictures[0].classList.add("gallery__picture--active");
carrusellIcons[0].classList.add("carrusel__icon--active");

function moveCarrusel(cont) {
    galleryPictures[cont].classList.remove("gallery__picture--active");
    carrusellIcons[cont].classList.remove("carrusel__icon--active");
    setTimeout(function () {
        galleryPictures[cont].style.display = "none";
        if (cont === galleryPictures.length - 1) {
            cont = -1;
        }
        galleryPictures[cont + 1].style.display = "inline-block";
        setTimeout(function () {
            galleryPictures[cont + 1].classList.add("gallery__picture--active");
            carrusellIcons[cont + 1].classList.add("carrusel__icon--active");
        }, 10);
    }, 430);
}

function createInterval(cnt) {
    return setInterval(function () {
        if (cnt === galleryPictures.length) cnt = 0;
        moveCarrusel(cnt);
        cnt++;
    }, 6000);
}

var carruselInterval = createInterval(0);

for (var contBtn = 0; contBtn < carrusellIcons.length; contBtn++) {
    var btn = carrusellIcons[contBtn];
    var btnIdx;
    btn.addEventListener("click", function () {
        for (btnIdx = 0; btnIdx < carrusellIcons.length; btnIdx++) {
            if (carrusellIcons[btnIdx] == this) break;
        }

        clearInterval(carruselInterval);
        /*Esto pone la imagen correspondiente al button clickeado*/
        var contImg;
        for (contImg = 0; contImg < galleryPictures.length; contImg++) {
            var img = galleryPictures[contImg];
            if (img.style.display === "inline-block") {
                img.classList.remove("gallery__picture--active");
                carrusellIcons[contImg].classList.remove("carrusel__icon--active");
                break;
            }
        }
        setTimeout(function () {
            console.log(btnIdx);
            galleryPictures[contImg].style.display = "none";
            carrusellIcons[contImg].classList.remove("carrusel__icon--active");
            galleryPictures[btnIdx].style.display = "inline-block";
            setTimeout(function () {
                galleryPictures[btnIdx].classList.add("gallery__picture--active");
                carrusellIcons[btnIdx].classList.add("carrusel__icon--active");
            }, 10);
        }, 430);
        carruselInterval = createInterval(btnIdx);
    });
}
