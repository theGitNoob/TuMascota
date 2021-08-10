const avatar = document.querySelectorAll(".avatar-login"),
  orders = document.querySelectorAll(".orders-login"),
  notifications = document.querySelectorAll(".bell-login");
const bellNumber = document.querySelector(".bell-number");
const menuAccount = document.querySelector("#account-section");
const bellSection = document.querySelector("#bell-section");
const bellElements = bellSection.querySelectorAll(".bell-submenu__element");
const removeBell = bellSection.querySelectorAll(".remove-notifications");
const showAllNotifications = bellSection.querySelector(
  ".show-all-notifications"
);

const bellSubmenu = bellSection.querySelector(".bell-submenu");
avatar.forEach(function (avt) {
  avt.addEventListener("click", function () {
    menuAccount.classList.toggle("show-login-menu");
    if (bellSection.classList.contains("show-login-menu")) {
      bellSection.classList.toggle("show-login-menu");
    }
  });
});

function fromNewToOld() {
  bellElements.forEach(function (el) {
    el.classList.remove("anim-bell-scale");
    if (el.classList.contains("bell-submenu__element--new")) {
      el.classList.remove("bell-submenu__element--new");
      el.classList.add("bell-submenu__element--old");
    }
  });
}

let contBellOpen = 0;
notifications.forEach(function (not) {
  not.addEventListener("click", function () {
    /*Aqui hago q se muestre el div de mostrar todas las notificaciones*/
    showAllNotifications.style.display = "block";
    if (
      bellSubMenuList.firstElementChild.classList.contains(
        "no-new-notifications"
      )
    )
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
      bellElements.forEach(function (el, cont) {
        el.classList.add("anim-bell-scale");
        let calcDelay = 300 + cont * 60;
        el.style.animationDelay = calcDelay.toString() + "ms";
        // console.log(el.style.animationDelay, cont);
        if (el.classList.contains("bell-submenu__element--old")) {
          el.style.display = "none";
        }
        if (
          el.classList.contains("bell-submenu__element--new") ||
          el.classList.contains("no-new-notifications")
        ) {
          el.style.display = "block";
        }
      });
    } else {
      bellElements.forEach(function (el) {
        el.classList.remove("anim-bell-scale");
      });
    }
    if (menuAccount.classList.contains("show-login-menu")) {
      menuAccount.classList.toggle("show-login-menu");
    }
    /*checkeo el Height*/
    checkHeight();
  });
});

/*Selecciono todos los botones de borrar*/
const deleteBell = document.querySelectorAll(
  ".remove-notifications > img:last-child"
);

/*Animacion de los botones de borrar notificaciones*/
removeBell.forEach(function (btn) {
  btn.addEventListener("click", function () {
    if (!btn.classList.contains("move-remove")) {
      btn.classList.toggle("move-remove");
      btn.firstElementChild.classList.toggle("rot-three-dots");
      btn.lastElementChild.style.opacity = "1";
      btn.lastElementChild.style.visibility = "visible";
    } else {
      btn.classList.toggle("move-remove");
      btn.firstElementChild.classList.toggle("rot-three-dots");
      btn.lastElementChild.style.opacity = "0";
      btn.lastElementChild.style.visibility = "hidden";
    }
  });
});

/*Asignar Heigth a las notificaciones*/
const bellSubMenuList = bellSection.querySelector(".bell-submenu__list");
function checkHeight() {
  let sumHeight = 0;
  bellElements.forEach(function (el) {
    elementStyle = getComputedStyle(el);
    if (parseInt(elementStyle.height) > 0 && el.style.display == "block") {
      sumHeight +=
        parseFloat(elementStyle.height) +
        parseFloat(elementStyle.marginTop) * 2;
    }
  });

  if (bellSubMenuList.firstElementChild) {
    if (
      bellSubMenuList.firstElementChild.classList.contains(
        "no-new-notifications"
      ) ||
      (bellSubMenuList.firstElementChild.classList.contains(
        "no-notifications"
      ) &&
        bellSubMenuList.childElementCount > 1)
    ) {
      if (bellSubMenuList.firstElementChild.style.display != "none")
        sumHeight += parseFloat(bellSubMenuList.firstElementChild.style.height);
    }
  }

  bellSubmenu.style.height = sumHeight + 10 + "px";
  bellSubMenuList.style.height = getComputedStyle(bellSubmenu).maxHeight;
}

/*Borrar notificaciones*/
deleteBell.forEach(function (btn) {
  btn.addEventListener("click", function () {
    const element = btn.parentElement.parentElement;
    if (element.classList.contains("bell-submenu__element--new")) {
      let count = Number(
        document.querySelector(".login-count-msj.bell-msj").textContent
      );
      count--;
      document.querySelector(".login-count-msj.bell-msj").textContent = count;
    }
    const elementStyle = getComputedStyle(element);
    element.style.height = elementStyle.height;
    setTimeout(function () {
      element.style.height = 0;
    }, 10);
    // element.classList.add("delete-element");
    let notifications = Number(bellNumber.textContent);
    notifications--;
    bellNumber.textContent = notifications.toString();
    /*Aqui ya le pongo display:none, y luego tu elimarias la notificacion del DOM y de la BD*/
    setTimeout(function () {
      element.style.display = "none";
      /*checkeo el scroll*/
      checkHeight();
    }, 500);
  });
});
showAllNotifications.addEventListener("click", function () {
  bellElements.forEach(function (el) {
    if (el.classList.contains("bell-submenu__element--old")) {
      el.style.display = "block";
    }
    showAllNotifications.style.display = "none";
    bellSubmenu.style.borderRadius = "0 0 6px 6px";
  });
  /*checkeo el scroll*/
  if (
    bellSubMenuList.firstElementChild.classList.contains("no-new-notifications")
  ) {
    bellSubMenuList.firstElementChild.style.display = "none";
  }
  checkHeight();
});

/*Cuando no tienes notifiaciones*/
function checkBell() {
  let flag = 0;
  bellElements.forEach(function (el) {
    if (el.classList.contains("bell-submenu__element--new")) flag = 1;
  });

  if (!flag && bellSubMenuList.firstElementChild) {
    if (
      !bellSubMenuList.firstElementChild.classList.contains(
        "no-new-notifications"
      )
    ) {
      let node = document.createElement("li");
      node.classList.add("bell-submenu__element");
      node.classList.add("no-new-notifications");
      node.style.borderRadius = "0";
      node.style.padding = "0.5rem";
      node.innerHTML = "No tienes notificaciones recientes";
      if (
        !bellSubMenuList.firstElementChild.classList.contains(
          "no-notifications"
        )
      ) {
        bellSubMenuList.insertBefore(node, bellSubMenuList.firstElementChild);
      }
      node.style.height = getComputedStyle(node).height;
    }
  }

  if (bellSubMenuList.childElementCount == 0) {
    let node = document.createElement("li");
    node.classList.add("bell-submenu__element");
    node.classList.add("no-notifications");
    node.style.borderRadius = "0";

    node.innerHTML = "No tienes notificaciones actualmente";

    showAllNotifications.style.display = "none";
    bellSubMenuList.appendChild(node);
    node.style.height = getComputedStyle(node).height;
    console.log("epepe");
    if (
      bellSubMenuList.lastElementChild.classList.contains("no-notifications") &&
      bellSubMenuList.childElementCount == 1
    ) {
      showAllNotifications.style.display = "none";
    } else {
      showAllNotifications.style.display = "block";
    }
    if (
      bellSubMenuList.lastElementChild.classList.contains("no-notifications") &&
      bellSubMenuList.childElementCount > 1
    ) {
      // console.log("elimine");
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
