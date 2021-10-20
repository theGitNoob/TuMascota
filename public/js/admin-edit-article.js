const formEditArticle = document.querySelector(".edit-article");

formEditArticle.addEventListener("submit", (e) => {
    e.preventDefault();
    if (gallery.firstElementChild.tagName !== "SPAN") {
        const loc = window.location.pathname;
        let url;
        if (loc.startsWith("/admin/mascotas")) url = `/admin/mascotas/`;
        else if (loc.startsWith("/admin/accesorios")) url = `/admin/accesorios/`;
        handleForm(url, "PUT");
    }
});

//Muestro la 1ra imagen y los botones de movimiento
if (gallery.children.length > 0) {
    gallery.firstElementChild.classList.add("picture-show");
    btnPrevImage.parentElement.style.display = "block";
}

const deletePhoto = async (ImgId) => {
    const id = gallery.getAttribute("id");
    const url = `${id}/image/${ImgId}`;
    const resp = await fetch(url, {
        method: "DELETE",
    });
    if (resp.ok) return true;
    return false;
};
for (let ch of gallery.children) {
    const btn = ch.lastElementChild;
    if (btn.tagName === "BUTTON") {
        btn.addEventListener("click", () => {
            const ImgId = ch.firstElementChild.getAttribute("id");
            if (deletePhoto(ImgId)) {
                handleDelete(ch);
            }
        });
    }
}
