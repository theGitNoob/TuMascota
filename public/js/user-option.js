const avatar = document.querySelectorAll(".avatar-login"),
    orders = document.querySelectorAll(".orders-login"),
    notifications = document.querySelectorAll(".bell-login"),
    menuGoLogin = document.querySelectorAll(".go-login");

const menuAccount = document.querySelector("#account-section");
const bellSection = document.querySelector("#bell-section");
const bellElements = bellSection.querySelectorAll(".bell-submenu__element");
const removeBell = bellSection.querySelectorAll(".remove-notifications");
const showAllNotifications = bellSection.querySelector(".show-all-notifications");
const bellMsj = document.querySelector("#bell-msj");
const bellNewMsj = document.querySelector("#bell-new-msj");

const bellSubmenu = bellSection.querySelector(".bell-submenu");

for (var avt = 0; avt < avatar.length; avt++) {
    avatar[avt].addEventListener("click", function () {
        menuAccount.classList.toggle("show-login-menu");
        if (bellSection.classList.contains("show-login-menu")) {
            bellSection.classList.toggle("show-login-menu");
        }
    });
}

// /*Notificaciones*/
function fromNewToOld() {
    for (var i = 0; i < bellElements.length; i++) {
        const el = bellElements[i];
        el.classList.remove("anim-bell-scale");
        if (el.classList.contains("bell-submenu__element--new")) {
            el.classList.remove("bell-submenu__element--new");
            el.classList.add("bell-submenu__element--old");
        }
    }
}

var contBellOpen = 0;
for (var n = 0; n < notifications.length; n++) {
    var notif = notifications[n];
    notif.addEventListener("click", function () {
        var messagesNodes = document.querySelectorAll("li.bell-submenu__element--new");
        var messages = Array.prototype.map.call(messagesNodes, function (elem) {
            return elem.id;
        });

        if (messages.length) {
            const data = { messages: messages };
            const xhr = new XMLHttpRequest();
            xhr.open("PATCH", "/user/messages/");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(data));
        }

        /*Aqui hago q se muestre el div de mostrar todas las notificaciones*/
        showAllNotifications.style.display = "block";
        if (bellSubMenuList.firstElementChild.classList.contains("no-new-notifications"))
            bellSubMenuList.firstElementChild.style.display = "block";
        /*Aqui reviso si tienes notifiaciones*/

        bellSection.classList.toggle("show-login-menu");
        if (bellSection.classList.contains("show-login-menu")) {
            contBellOpen++;
        }
        if (contBellOpen >= 2) {
            fromNewToOld();
        }
        checkBell();

        if (bellSection.classList.contains("show-login-menu")) {
            for (var cont = 0; cont < bellElements.length; cont++) {
                const bellEl = bellElements[cont];
                bellEl.classList.add("anim-bell-scale");
                const notCalcDelay = 300 + cont * 60;
                bellEl.style.animationDelay = notCalcDelay.toString() + "ms";
                // console.log(el.style.animationDelay, cont);
                if (bellEl.classList.contains("bell-submenu__element--old")) {
                    bellEl.style.display = "none";
                }
                if (
                    bellEl.classList.contains("bell-submenu__element--new") ||
                    bellEl.classList.contains("no-new-notifications")
                ) {
                    bellEl.style.display = "block";
                }
            }
        } else {
            for (var bl = 0; bl < bellElements.length; bl++) {
                bellElements[bl].remove("anim-bell-scale");
            }
        }
        if (menuAccount.classList.contains("show-login-menu")) {
            menuAccount.classList.toggle("show-login-menu");
        }
        /*checkeo el Height*/
        checkHeight();
    });
}

/*Selecciono todos los botones de borrar*/
const deleteBell = document.querySelectorAll(".remove-notifications > img:last-child");

// /*Animacion de los botones de borrar notificaciones*/
for (var rb = 0; rb < removeBell.length; rb++) {
    var rmBtn = removeBell[rb];
    rmBtn.addEventListener("click", function () {
        if (!this.classList.contains("move-remove")) {
            this.classList.toggle("move-remove");
            this.firstElementChild.classList.toggle("rot-three-dots");
            this.lastElementChild.style.opacity = "1";
            this.lastElementChild.style.visibility = "visible";
        } else {
            this.classList.toggle("move-remove");
            this.firstElementChild.classList.toggle("rot-three-dots");
            this.lastElementChild.style.opacity = "0";
            this.lastElementChild.style.visibility = "hidden";
        }
    });
}

// /*Asignar Heigth a las notificaciones*/
const bellSubMenuList = bellSection.querySelector(".bell-submenu__list");
function checkHeight() {
    var sumHeight = 0;
    for (var be = 0; be < bellElements.length; be++) {
        const elem = bellElements[be];
        elementStyle = getComputedStyle(elem);
        if (parseInt(elementStyle.height) > 0 && elem.style.display === "block") {
            sumHeight += parseFloat(elementStyle.height) + parseFloat(elementStyle.marginTop) * 2;
        }
    }
    const bfirst = bellSubMenuList.firstElementChild;
    if (bfirst) {
        if (
            bfirst.classList.contains("no-new-notifications") ||
            (bfirst.classList.contains("no-notifications") && bellSubMenuList.childElementCount > 0)
        ) {
            if (bfirst.style.display != "none") {
                sumHeight += parseFloat(bfirst.style.height);
            }
        }
    }
    bellSubmenu.style.height = sumHeight + 10 + "px";
    bellSubMenuList.style.height = getComputedStyle(bellSubmenu).maxHeight;
}

// /*Borrar notificaciones*/
for (var cnt = 0; cnt < deleteBell.length; cnt++) {
    const dBtn = deleteBell[cnt];
    dBtn.addEventListener("click", function () {
        var id = dBtn.parentNode.parentNode.id;
        var req = new XMLHttpRequest();
        req.open("DELETE", "/user/messages/" + id);
        req.send();
        // //TODO:Actualizar la cantidad de notificaciones
        req.onload = function () {
            if (req.status === 200) {
                var newMsj = parseInt(bellNewMsj.innerHTML);
                var totalMsj = parseInt(bellMsj.innerHTML);
                if (dBtn.parentNode.parentNode.classList.contains("bell-submenu__element--new")) {
                    newMsj--;
                }
                totalMsj--;
                bellNewMsj.innerHTML = newMsj;
                bellMsj.innerHTML = totalMsj;
            }
        };
        const element = dBtn.parentElement.parentElement;
        const elementStyle = getComputedStyle(element);
        element.style.height = elementStyle.height;
        setTimeout(function () {
            element.style.height = 0;
        }, 10);
        element.classList.add("delete-element");
        /*Aqui ya le pongo display:none, y luego tu elimarias la notificacion del DOM y de la BD*/
        setTimeout(function () {
            element.style.display = "none";
            checkHeight();
        }, 500);
    });
}

showAllNotifications.addEventListener("click", function () {
    for (var be = 0; be < bellElements.length; be++) {
        const bEl = bellElements[be];
        if (bEl.classList.contains("bell-submenu__element--old")) {
            bEl.style.display = "block";
        }
        showAllNotifications.style.display = "none";
        bellSubmenu.style.borderRadius = "0 0 6px 6px";
    }
    /*checkeo el scroll*/
    if (bellSubMenuList.firstElementChild.classList.contains("no-new-notifications")) {
        bellSubMenuList.firstElementChild.style.display = "none";
    }
    checkHeight();
});

// /*Cuando no tienes notifiaciones*/
function checkBell() {
    var flag = 0;
    for (var bli = 0; bli < bellElements.length; bli++) {
        if (bellElements[bli].classList.contains("bell-submenu__element--new")) flag = 1;
    }
    if (!flag && bellSubMenuList.firstElementChild) {
        if (!bellSubMenuList.firstElementChild.classList.contains("no-new-notifications")) {
            const node = document.createElement("li");
            node.classList.add("bell-submenu__element");
            node.classList.add("no-new-notifications");
            node.style.borderRadius = "0";
            node.style.padding = "0.5rem";
            node.innerHTML = "No tienes notificaciones recientes";
            if (!bellSubMenuList.firstElementChild.classList.contains("no-notifications")) {
                bellSubMenuList.insertBefore(node, bellSubMenuList.firstElementChild);
            }
            node.style.height = getComputedStyle(node).height;
        }
    }

    if (bellSubMenuList.childElementCount === 0) {
        const liNode = document.createElement("li");
        liNode.classList.add("bell-submenu__element");
        liNode.classList.add("no-notifications");
        liNode.style.borderRadius = "0";

        liNode.innerHTML = "No tienes notificaciones actualmente";

        showAllNotifications.style.display = "none";
        bellSubMenuList.appendChild(liNode);
        liNode.style.height = getComputedStyle(liNode).height;
        if (
            bellSubMenuList.lastElementChild.classList.contains("no-notifications") &&
            bellSubMenuList.childElementCount === 1
        ) {
            showAllNotifications.style.display = "none";
        } else {
            showAllNotifications.style.display = "block";
        }
        if (
            bellSubMenuList.lastElementChild.classList.contains("no-notifications") &&
            bellSubMenuList.childElementCount > 1
        ) {
            bellSubMenuList.removeChild(bellSubMenuList.lastElementChild);
        }
    }
}
checkBell();

document.addEventListener("click", function (e) {
    if (
        e.target != avatar[0] &&
        e.target != notifications[0].children[0] &&
        e.target != notifications[0].children[1] &&
        e.target != avatar[1] &&
        e.target != notifications[1].children[0] &&
        e.target != notifications[1].children[1]
    ) {
        if (menuAccount.classList.contains("show-login-menu")) {
            if (e.target != menuAccount.firstElementChild.firstElementChild)
                menuAccount.classList.toggle("show-login-menu");
        }
        if (bellSection.classList.contains("show-login-menu")) {
            if (
                !e.target.classList.contains("bell-submenu__element") &&
                !e.target.classList.contains("bell-time") &&
                !e.target.classList.contains("remove-notifications") &&
                !e.target.parentElement.classList.contains("remove-notifications") &&
                e.target != bellSection.firstElementChild &&
                e.target != bellSection.lastElementChild
            ) {
                bellSection.classList.toggle("show-login-menu");
                // bellElements.forEach(function (el) {
                //     el.classList.remove("anim-bell-scale");
                //     if (
                //         el.classList.contains("bell-submenu__element--new")
                //     ) {
                //         el.classList.remove("bell-submenu__element--new");
                //         el.classList.add("bell-submenu__element--old");
                //     }
                // });
                fromNewToOld();
            }
        }
    }
});
