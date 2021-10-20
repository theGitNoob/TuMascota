const petOrderState = document.querySelectorAll(
    ".order-section--pet .order-state"
);
const articleOrderState = document.querySelectorAll(
    ".order-section--article .order-state"
);

const orderStates = document.querySelectorAll(
    ".order-section__table .order-state"
);

const filtros = document.querySelectorAll(".filter-order");

const btnCancelOrder = document.querySelectorAll(".cancel-order");
const deleteColumn = document.querySelectorAll(".delete-column");

const petTable = document.querySelector(".order-section--pet");
const articleTable = document.querySelector(".order-section--article");

const mediaQuery = window.matchMedia("(min-width: 50rem)");

/*Esto es para filtrar las ordenes*/
function filtrarOrdenes(fil) {
    for (var ods = 0; ods < orderStates.length; ods++) {
        const ord = orderStates[ods];
        if (fil.getAttribute("data-state") === "pendient") {
            if (mediaQuery.matches) {
                for (var cnbtn = 0; cnbtn < btnCancelOrder.length; cnbtn++) {
                    btnCancelOrder[cnbtn].parentElement.style.display =
                        "table-cell";
                }
                // btnCancelOrder.forEach(function (btn) {
                //     btn.parentElement.style.display = "table-cell";
                // });
                for (var col = 0; col < deleteColumn.length; col++) {
                    deleteColumn[col].style.display = "table-cell";
                }
                // deleteColumn.forEach(function (col) {
                //     col.style.display = "table-cell";
                // });
            } else {
                for (var cnbtn = 0; cnbtn < btnCancelOrder.length; cnbtn++) {
                    btnCancelOrder[cnbtn].parentElement.style.display = "block";
                }
                // btnCancelOrder.forEach(function (btn) {
                //     btn.parentElement.style.display = "block";
                // });
            }
            if (ord.getAttribute("data-state") === "pendient") {
                if (!mediaQuery.matches)
                    ord.parentElement.parentElement.style.display = "block";
                else
                    ord.parentElement.parentElement.style.display = "table-row";
            } else {
                ord.parentElement.parentElement.style.display = "none";
            }
        } else {
            for (var cnbtn = 0; cnbtn < btnCancelOrder.length; cnbtn++) {
                btnCancelOrder[cnbtn].parentElement.style.display = "none";
            }
            // btnCancelOrder.forEach(function (btn) {
            //     btn.parentElement.style.display = "none";
            // });
            for (var col = 0; col < deleteColumn.length; col++) {
                deleteColumn[col].style.display = "none";
            }
            // deleteColumn.forEach(function (col) {
            //     col.style.display = "none";
            // });
            if (
                fil.getAttribute("data-state") ===
                ord.getAttribute("data-state")
            ) {
                if (!mediaQuery.matches)
                    ord.parentElement.parentElement.style.display = "block";
                else
                    ord.parentElement.parentElement.style.display = "table-row";
            } else {
                ord.parentElement.parentElement.style.display = "none";
            }
        }
    }

    // orderStates.forEach(function (ord) {
    //     if (fil.getAttribute("data-state") === "pendient") {
    //         if (mediaQuery.matches) {
    //             btnCancelOrder.forEach(function (btn) {
    //                 btn.parentElement.style.display = "table-cell";
    //             });

    //             deleteColumn.forEach(function (col) {
    //                 col.style.display = "table-cell";
    //             });
    //         } else {
    //             btnCancelOrder.forEach(function (btn) {
    //                 btn.parentElement.style.display = "block";
    //             });
    //         }
    //         if (ord.getAttribute("data-state") === "pendient") {
    //             if (!mediaQuery.matches) ord.parentElement.parentElement.style.display = "block";
    //             else ord.parentElement.parentElement.style.display = "table-row";
    //         } else {
    //             ord.parentElement.parentElement.style.display = "none";
    //         }
    //     } else {
    //         btnCancelOrder.forEach(function (btn) {
    //             btn.parentElement.style.display = "none";
    //         });
    //         deleteColumn.forEach(function (col) {
    //             col.style.display = "none";
    //         });
    //         if (fil.getAttribute("data-state") === ord.getAttribute("data-state")) {
    //             if (!mediaQuery.matches) ord.parentElement.parentElement.style.display = "block";
    //             else ord.parentElement.parentElement.style.display = "table-row";
    //         } else {
    //             ord.parentElement.parentElement.style.display = "none";
    //         }
    //     }
    // });
}

//Determinar si tienen mascotas o articulos en las ordenes
function checkTable(table, fil) {
    const tableRows = table.children[1].childNodes;
    var flag = 0,
        cont = 0;
    for (var ch = 0; ch < tableRows.length; ch++) {
        var el = tableRows[ch];
        if (el.nodeName === "TR") {
            cont++;
            if (el.style.display != "none") {
                flag = 1;
            }
        }
    }
    // for (var ch of tableRows) {
    //     console.log("pepe asdasd  asdasd {ch}", ch);
    //     if (ch.hasAttribute) {
    //         cont++;
    //         if (ch.style.display != "none") {
    //             flag = 1;
    //         }
    //     }
    // }
    if (!flag || !cont) {
        table.style.display = "none";
        if (table.parentElement.lastElementChild.nodeName === "SPAN") {
            table.parentElement.lastElementChild.remove();
        }
        var node = document.createElement("span");
        node.classList.add("no-orders");
        node.innerHTML =
            "Usted no tiene ordenes " +
            "<span class='order-sate' data-state=" +
            fil.getAttribute("data-state") +
            ">" +
            fil.textContent +
            "</span> <br>";
        if (table === petTable) {
            node.innerHTML +=
                "<a class = 'btn' href='/mascotas'>Ver Mascotas</a>";
        } else {
            node.innerHTML +=
                "<a class = 'btn' href='/accesorios'>Ver Artículos</a>";
        }
        table.parentElement.appendChild(node);
    } else {
        if (table.parentElement.lastElementChild.nodeName === "SPAN") {
            table.style.display = "table";
            table.parentElement.lastElementChild.remove();
        }
    }
}

function changeFilter(f) {
    for (var c = 0; c < f.parentElement.children.length; c++) {
        var el = f.parentElement.children[c];
        if (!mediaQuery.matches && el.firstElementChild.tagName === "SPAN")
            el.firstElementChild.textContent = "";
        el.classList.remove("active");
    }

    // for (c of f.parentElement.childNodes) {
    //     if (c.hasAttribute) {
    //         if (!mediaQuery.matches && c.firstElementChild.tagName === "SPAN") c.firstElementChild.textContent = "";
    //         c.classList.remove("active");
    //     }
    // }
    f.classList.add("active");
    if (!mediaQuery.matches) {
        if (f.getAttribute("data-state") === "pendient") {
            f.firstElementChild.textContent = "Pendientes";
        } else if (f.getAttribute("data-state") === "aproved") {
            f.firstElementChild.textContent = "Aprobadas";
        } else if (f.getAttribute("data-state") === "completed") {
            f.firstElementChild.textContent = "Completadas";
        }
    }
    filtrarOrdenes(f);
    checkTable(petTable, f);
    checkTable(articleTable, f);
}

for (var f = 0; f < filtros.length; f++) {
    var fil = filtros[f];
    fil.addEventListener("click", function () {
        changeFilter(this);
    });
}

// filtros.forEach(function (f) {
//     f.addEventListener("click", function () {
//         changeFilter(f);
//     });
// });

window.addEventListener("resize", function () {
    for (var f = 0; f < filtros.length; f++) {
        var fil = filtros[f];
        if (fil.classList.contains("active")) {
            filtrarOrdenes(fil);
        }
    }
    // filtros.forEach(function (f) {
    //     if (f.classList.contains("active")) {
    //         filtrarOrdenes(f);
    //     }
    // });
});

/*Esto es para que salgan las pendientes en 1ra instancia, yo lo hago asi para trabajar mas comodo
,eso tu me dijiste q lo cambiaramos para que no cargue las otras, pero lo haras tu desde el backend
 */
filtros[0].click();

/*Esto es para la alerta de cancelar*/
var orderBtnActive;

for (cobtn = 0; cobtn < btnCancelOrder.length; cobtn++) {
    var btn = btnCancelOrder[cobtn];
    btn.addEventListener("click", function () {
        animarModalAlert();
        orderBtnActive = this;
    });
}

// btnCancelOrder.forEach(function (btn) {
//     btn.addEventListener("click", function () {
//         animarModalAlert();
//         orderBtnActive = btn;
//     });
// });

var btnAcceptModal = document.querySelector(".btn-alert-confirm");

function removeOrderCheck() {
    //Con esto voy hasta el padre del boton que le di click, para saber a q orden me refiero
    var orderId = orderBtnActive;
    while (orderId.getAttribute("class") !== "order-section__cell") {
        orderId = orderId.parentElement;
    }
    //La url
    const requestUrl = "ordenes/" + orderId.getAttribute("id");
    //La peticion con el metodo, la url, y los datos
    const xhr = makeRequest("DELETE", requestUrl, null);
    xhr.onload = function () {
        // console.log("Estado", xhr.status);
        if (xhr.status === 200) {
            mostrarModal(modalCanceledBack, modalCanceled, 0);
            animCompleted(1);
            return;
        }
        if (xhr.status === 500) {
            addAlert("error", ["Error interno del servidor"]);
            return;
        }
    };
}

//Aqui hago el evento del click de aceptar borrar la orden
btnAcceptModal.addEventListener("click", function (btn) {
    btn.preventDefault();
    removeOrderCheck();
});
