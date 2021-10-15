let opts = document.querySelector("#options"),
    input = document.querySelector("#animal-type");
const inputFile = document.querySelector("#file-selector"),
    inputsData = document.querySelectorAll(".form-input"),
    btnAddPhoto = document.querySelector("btn-add-photo"),
    filesSelected = document.querySelector(".file-selected"),
    gallery = document.querySelector(".gallery"),
    btnPrevImage = document.querySelector(".btn-prev"),
    btnNextImage = document.querySelector(".btn-next"),
    allinputs = {};

inputsData.forEach((inp) => {
    const atr = inp.getAttribute("name");
    allinputs[atr] = inp;
});

function cleanInputs() {
    const inputKeys = Object.values(allinputs);
    inputKeys.forEach(function (el) {
        if (el) {
            console.log(el.parentElement, el);
            elParent = el.parentElement;
            if (elParent.lastElementChild.classList.contains("input-error")) {
                elParent.lastElementChild.remove();
            }
        }
    });
}

// console.log("pepeppe");

function showErrorsForm(errors) {
    function addFormError(id, msg) {
        const node = document.createElement("div");
        node.classList.add("input-error");
        node.innerHTML =
            " <img src='/public/img/login/error-formulario.webp' alt='' /><span class='input-error__text'>" +
            msg +
            " </span> ";

        if (allinputs[id]) {
            const inputParent = allinputs[id].parentElement;
            inputParent.appendChild(node);
        }
    }
    cleanInputs();

    for (er of errors) {
        addFormError(er.field, er.msg);
    }
}

function handleForm(url, action) {
    const formData = new FormData();
    for (let img of inputFile.files) {
        formData.append("images", img);
    }
    inputsData.forEach((el) => {
        if (el.name != "images") {
            formData.append(el.name, el.value);
        }
    });
    let finalUrl = url;

    if (gallery.getAttribute("id")) finalUrl = `${url}${gallery.getAttribute("id")}`;

    console.log("Woo", url, finalUrl);
    fetch(finalUrl, {
        method: action,
        body: formData,
        credentials: "same-origin",
    })
        .then((result) => {
            if (result.ok) {
                window.location = url;
            }
            return result.json();
        })
        .then((data) => {
            showErrorsForm(data);
            console.log(data);
        });
}

//Galeria de imagenes
let idxGallery = 0;
function moveGallery(dir) {
    if (!dir) {
        let flag = 0;
        for (idxGallery; idxGallery >= -1; idxGallery--) {
            let node = gallery.children[idxGallery];
            if (flag) {
                if (idxGallery === -1) {
                    node = gallery.children[gallery.childElementCount - 1];
                    idxGallery = gallery.childElementCount - 1;
                }
                node.classList.add("picture-show");
                flag = 0;
                break;
            }
            if (node.classList.contains("picture-show")) {
                node.classList.remove("picture-show");
                flag = 1;
            }
        }
    } else {
        let flag = 0;
        for (idxGallery; idxGallery <= gallery.children.length; idxGallery++) {
            let node = gallery.children[idxGallery];
            if (flag) {
                if (idxGallery === gallery.children.length) {
                    node = gallery.children[0];
                    idxGallery = 0;
                }
                node.classList.add("picture-show");
                flag = 0;
                break;
            }
            if (node.classList.contains("picture-show")) {
                node.classList.remove("picture-show");
                flag = 1;
            }
        }
    }
}

btnPrevImage.addEventListener("click", function () {
    moveGallery(0);
});
btnNextImage.addEventListener("click", function () {
    moveGallery(1);
});

inputFile.addEventListener("change", function () {
    let currentFiles = inputFile.files;
    if (currentFiles.length === 0 && gallery.childElementCount === 0) {
        gallery.innerHTML = "<span style = 'font-weight: 600;color: #4c4c4c;'>No ha seleccionado ninguna foto </span>";
    } else {
        if (!gallery.childElementCount || (currentFiles.length && !gallery.children[0] != "span")) {
            gallery.innerHTML = "";
        }
        //muestro los botones si hay elementos
        if (currentFiles.length) {
            btnPrevImage.parentElement.style.display = "block";
        }
        let flag = 0;
        for (let file of currentFiles) {
            let reader = new FileReader();

            reader.addEventListener("load", function (e) {
                const node = document.createElement("div");
                node.classList.add("picture");
                node.innerHTML = `<img src=${reader.result} alt=''>`;
                if (!flag) {
                    node.classList.add("picture-show");
                    idxGallery = 0;
                    flag = 1;
                }
                gallery.appendChild(node);
                //- handleDelete(node);
            });
            reader.readAsDataURL(file);
        }
    }
});

if (opts) {
    opts.addEventListener("click", (e) => {
        if (e.target.value == "otro") {
            //- e.target.style = 'display:none';
            input.style = "";
            input.setAttribute("name", "type");
            opts.removeAttribute("name");
        } else {
            opts.setAttribute("name", "type");
            input.removeAttribute("name");
            input.style = "display:none";
        }
    });
}
