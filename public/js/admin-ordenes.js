const petsTables = document.querySelectorAll(".pets-table"),
    articlesTables = document.querySelectorAll(".articles-table"),
    petsTablesBody = document.querySelectorAll(".pets-table .main-table__body"),
    articlesTablesBody = document.querySelectorAll(".articles-table .main-table__body"),
    btnPetsTables = document.querySelectorAll(".btn-pets"),
    btnArticlesTable = document.querySelectorAll(".btn-articles"),
    mainContainer = document.querySelector(".main-container"),
    hiddenUsername = document.querySelectorAll(".hidden-input-username"),
    hiddenName = document.querySelectorAll(".hidden-input-name"),
    hiddenLastname = document.querySelectorAll(".hidden-input-lastname"),
    hiddenPhone = document.querySelectorAll(".hidden-input-phone"),
    hiddenAddress = document.querySelectorAll(".hidden-input-address"),
    hiddenEmail = document.querySelectorAll(".hidden-input-email"),
    modalBack = document.querySelector(".modal-back"),
    modalUsername = document.querySelector("#modal-username"),
    modalName = document.querySelector("#modal-name"),
    modalLastname = document.querySelector("#modal-lastname"),
    modalPhone = document.querySelector("#modal-phone"),
    modalAddress = document.querySelector("#modal-address"),
    modalEmail = document.querySelector("#modal-email"),
    closeModal = document.querySelector(".close-modal"),
    users = document.querySelectorAll(".username"),
    deleteForm = document.querySelectorAll(".delete-form"),
    formUpdateState = document.querySelectorAll(".update-state-form");

const deletePhoto = async (id) => {
    const url = `/admin/ordenes/${id}`;
    const resp = await fetch(url, {
        method: "DELETE",
    });
    if (resp.ok) window.location.reload();
};

deleteForm.forEach((form) => {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const idForm = form.getAttribute("data-orderId");
        const res = window.confirm("Está seguro q desea eliminar este elemento");
        if (res) deletePhoto(idForm);
    });
});

function handleModal(index) {
    modalUsername.innerText = hiddenUsername[index].value;
    modalName.innerText = hiddenName[index].value;
    modalLastname.innerText = hiddenLastname[index].value;
    modalPhone.innerText = hiddenPhone[index].value;
    modalAddress.innerText = hiddenAddress[index].value;
    modalEmail.innerText = hiddenEmail[index].value;
}

users.forEach(function (user, index) {
    user.addEventListener("click", function () {
        modalBack.classList.add("show-modal");
        handleModal(index);
    });
});

closeModal.addEventListener("click", function () {
    modalBack.classList.remove("show-modal");
});

function updateState(form) {
    const orderId = form.getAttribute("data-orderId");

    const inputRadio = form.querySelector("input[type='radio']:checked");

    // let inputChecked = inputRadio[0];
    // inputRadio.forEach(function (inp) {
    //     if (inp.checked) inputChecked = inp;
    // });
    // const userStateData = {
    //     state: inputChecked.value,
    // };

    // console.log(inputRadio);
    const userStateData = new FormData();
    userStateData.append("state", inputRadio.value);

    const url = `/admin/ordenes/${orderId}`;
    fetch(url, {
        method: "PUT",
        body: userStateData,
        credentials: "same-origin",
    }).then((resp) => {
        if (resp.ok) {
            window.location.reload;
        }
        // console.log(resp);
    });
}

formUpdateState.forEach(function (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        updateState(this);
    });
});

if (!mainContainer.childElementCount) {
    mainContainer.innerHTML =
        "<h3 style='margin: 1rem; color: #4c4c4c; font-weight: 600;'>No hay ninguna orden registrada actualmente </h3>";
}
petsTablesBody.forEach((tb) => {
    if (!tb.childElementCount)
        tb.parentElement.innerHTML =
            "<h3 class = 'no-orders-cell'>No hay ninguna orden de mascotas registrada actualmente para este usuario </h3>";
});

articlesTablesBody.forEach((tb) => {
    if (!tb.childElementCount)
        tb.parentElement.innerHTML =
            "<h3 class = 'no-orders-cell'>No hay ninguna orden de accesorios registrada actualmente para este usuario </h3>";
});

btnPetsTables.forEach(function (btn, index) {
    btn.addEventListener("click", function () {
        if (!petsTables[index].classList.contains("show-table")) {
            petsTables[index].classList.add("show-table");
            btn.innerHTML = "Mascotas <div class = 'underline'></div>";
            btn.style.backgroundColor = "#2fb5ee";
        } else {
            petsTables[index].classList.remove("show-table");
            btn.innerHTML = "Mascotas";
            btn.style.backgroundColor = "#007bff";
        }
    });
});
btnArticlesTable.forEach(function (btn, index) {
    btn.addEventListener("click", function () {
        if (!articlesTables[index].classList.contains("show-table")) {
            articlesTables[index].classList.add("show-table");
            btn.style.backgroundColor = "#2fb5ee";
            btn.innerHTML = "Accesorios <div class = 'underline'></div>";
        } else {
            articlesTables[index].classList.remove("show-table");
            btn.style.backgroundColor = "#007bff";
            btn.innerHTML = "Accesorios";
        }
    });
});
