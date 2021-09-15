// if (window.fetch) {
//   // run my fetch request here
// } else {
//   // do something with password2Request?
// }

// let req = new password2Request();
// req.open("GET", "/public/img/mascotas/6082d56f40954866e098d544.jpg");
// req.onload = () => {
//   console.log(req.responseType);
// };

// req.send();

// const imgLoad = (url) => {
//   return new Promise((resolve, reject) => {
//     var request = new password2Request();
//     request.open("GET", url);
//     request.responseType = "blob";

//     request.onload = () => {
//       if (request.status == 200) {
//         resolve(request.response);
//       } else {
//         reject(
//           Error(
//             "Image didn't load successfully; error code:" + request.statusText
//           )
//         );
//       }
//     };

//     request.onerror = () => {
//       reject(Error("There was a network error."));
//     };

//     request.send();
//   });
// };

// let body = document.querySelector("body");
// let myImage = new Image();

// imgLoad("/public/img/mascotas/6082d56f40954866e098d544.jpg").then(
//   (response) => {
//     var imageURL = window.URL.createObjectURL(response);
//     console.log(response);
//     myImage.src = imageURL;
//     body.appendChild(myImage);
//   },
//   (Error) => {
//     console.log(Error);
//   }
// );

// let container = document.querySelector(".flex-container pet-flex");
// // document.addEventListener("scroll", function (event) {
// //   /* do something */
// //   // can't use event.preventDefault();
// //   console.log(event);
// // });
