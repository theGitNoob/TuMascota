const formCreateArticle = document.querySelector(".create-article");

formCreateArticle.addEventListener("submit", (e) => {
    e.preventDefault();
    if (gallery.firstElementChild.tagName !== "SPAN") {
        const loc = window.location.pathname;
        let url;
        if (loc.startsWith("/admin/mascotas")) url = `/admin/mascotas/`;
        else if (loc.startsWith("/admin/accesorios")) url = `/admin/accesorios/`;
        handleForm(url, "POST");
    }
});
