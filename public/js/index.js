const galleryPictures = document.querySelectorAll(".home-gallery__picture");
const carrusel = document.getElementById("carrusel");

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

// galleryPictures.forEach(function (picture) {
//     picture.style.display = "none";
//     // picture.classList.add("remove-gallery-picture");
// });

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

// let cont = 0;
// setTimeout(function () {
// var carruselInterval =  setInterval(function () {
//     if (cont === galleryPictures.length) cont = 0;
//     moveCarrusel(cont);
//     cont++;
// }, 3000);

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

// carrusellIcons.forEach(function (btn, contBtn) {
//     btn.addEventListener("click", function () {
//         console.log(carruselInterval);
//         clearInterval(carruselInterval);
//         /*Esto pone la imagen correspondiente al button clickeado*/
//         galleryPictures.forEach(function (img, contImg) {
//             if (img.style.display === "inline-block") {
//                 galleryPictures[contImg].classList.remove("gallery__picture--active");
//                 carrusellIcons[contImg].classList.remove("carrusel__icon--active");
//             }
//             setTimeout(function () {
//                 galleryPictures[contImg].style.display = "none";
//                 carrusellIcons[contImg].classList.remove("carrusel__icon--active");
//                 galleryPictures[contBtn].style.display = "inline-block";
//                 setTimeout(function () {
//                     galleryPictures[contBtn].classList.add("gallery__picture--active");
//                     carrusellIcons[contBtn].classList.add("carrusel__icon--active");
//                 }, 10);
//             }, 430);
//         });
//         carruselInterval = createInterval(contBtn);
//     });
// });
