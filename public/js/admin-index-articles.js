const mainTable = document.querySelector(".main-table");
const mainTableBody = document.querySelector(".main-table__body");
const deleteForm = document.querySelectorAll(".delete-form");

const deleteArticle = async (id) => {
    let url;
    if (window.location.pathname.startsWith("/admin/accesorios")) url = `/admin/accesorios/${id}`;
    else url = `/admin/mascotas/${id}`;
    const resp = await fetch(url, {
        method: "DELETE",
        credentials: "same-origin",
    }).then((resp) => {
        if (resp.ok) window.location.reload();
    });
};

deleteForm.forEach((form) => {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const res = window.confirm("Está seguro q desea eliminar este elemento");
        if (res) deleteArticle(form.getAttribute("data-articleId"));
    });
});
if (mainTableBody.childElementCount == 0) {
    if (window.location.pathname.startsWith("/admin/accesorios")) {
        mainTable.innerHTML = `<span class='no-elements'>No hay accesorios actualmente</span>`;
    } else {
        mainTable.innerHTML = `<span class='no-elements'>No hay mascotas actualmente</span>`;
    }
}
