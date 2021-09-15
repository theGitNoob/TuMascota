const requestUrl = "/public/JSON/login/login.json";
let xhr = new XMLHttpRequest();

xhr.open("GET", requestUrl);
xhr.responseType = "json";
xhr.send();

xhr.onload = () => {
    // if (xhr.status === 200) {
    // document.location = "mascotas.html";
    // }
    /*cambiar a 401*/
    let msgJSON = xhr.response;
    console.log(msgJSON);
    if (xhr.status === 200) {
        if (msgJSON.msg === "unconfirmed") {
            //TODO: Mostrar Modal
            console.log("muestro modal");
        } else {
            addAlert("error", [msgJSON.msg]);
        }
    }
};
