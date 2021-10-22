const formCreateArticle = document.querySelector(".create-article");
const mainTitle = document.querySelector(".main-title");

formCreateArticle.addEventListener("submit", (e) => {
    e.preventDefault();
    if (gallery.firstElementChild.tagName !== "SPAN") {
        const loc = window.location.pathname;
        let url;
        if (loc.startsWith("/admin/mascotas")) url = `/admin/mascotas/`;
        else if (loc.startsWith("/admin/accesorios")) url = `/admin/accesorios/`;
        handleForm(url, "POST");
    } else {
        gallery.firstElementChild.classList.add("bounce");
        setTimeout(() => {
            gallery.firstElementChild.classList.remove("bounce");
        }, 1000);
        window.scrollTo({ top: mainTitle.offsetTop, left: 0, behavior: "smooth" });
    }
});
