const getConfirmHtml = function (link) {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    </head>
    <body style="font-family: 'Montserrat', sans-serif; color: #555555">
      <header
        style="background-color: #007bff; padding: 0.4rem; height: 74px"
      ></header>
      <main>
        <article style="background-color: #f8f8f9; padding: 0 1rem 1rem">
          <h1
            class="email-title"
            style="
              color: #f26422;
              padding: 1rem 0;
              font-size: 1.3rem;
              text-align: center;
            "
          >
            Validar Cuenta
            <div class="underline" style="text-align: center">
              <span
                style="
                  display: inline-block;
                  width: 40%;
                  min-width: 12em;
                  max-width: 30rem;
                  height: 3px;
                  background-color: #fff;
                  vertical-align: middle;
                  background-color: #ffa54c;
                  border-radius: 8px;
                "
              ></span>
            </div>
          </h1>
          <section
            class="main-section"
            style="
              padding: 1rem;
              background-color: #fff;
              margin-bottom: 1rem;
              font-size: 0.9rem;
            "
          >
            <h2 class="main-section__title">Hola</h2>
            <p class="main-section__info" style="margin: 2rem 0">
              Estas a punto de poder acceder a nuestras mascotas y accesorios.
              <strong>Solo necesitas verificar tu correo electrónico</strong>
            </p>
            <div
              class="main-section__btn"
              style="margin: 1.6rem 0; text-align: center"
            >
              <strong style="display: block; margin: 1rem 0"
                >Presione el botón para verificarlo</strong
              >
              <button
                class="btn"
                type="submit"
                style="
                  cursor: pointer;
                  outline: none;
                  background-color: #007bff;
                  padding: 0.5rem 0.7rem;
                  display: inline-block;
                  text-align: center;
                  font-size: 1rem;
                  font-weight: bold;
                  font-family: inherit;
                  margin: 0.4rem 0;
                  border: none;
                  border-radius: 6px;
                  box-shadow: 0 0 12px rgba(0, 0, 0, 0.26);
                  transition: all 0.4s ease;
                "
              >
                <a href="${link}" style="text-decoration: none; color: #fff"
                  >Confirmar Correo</a
                >
              </button>
            </div>
            <div class="main-section__contact" style="color: #007bff">
              <span
                >Si tiene alguna pregunta puede llamarnos al
                <strong> 58156518 </strong> o puede escribirnos a
                <strong class="email">tumascota@nauta.cu</strong>
              </span>
            </div>
          </section>
          <footer style="text-align: center">
            <div>
              <span class="copyright" style="display: block; font-size: 0.9rem"
                >&copy 2021- Todos los derechos reservados</span
              >
            </div>
            <div class="social-media" style="margin: 1rem 0; display: block">
              <span><strong>Enviado desde Las Tunas.</strong></span>
            </div>
          </footer>
        </article>
      </main>
    </body>
    <style>
      * {
        margin: 0;
        padding: 0;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
      }
    </style>
  </html>
  
  
  `;
};
const getForgetHtml = (link) => {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    </head>
    <body style="font-family: 'Montserrat', sans-serif; color: #555555">
      <header
        style="background-color: #007bff; padding: 0.4rem; height: 74px"
      ></header>
      <main>
        <article style="background-color: #f8f8f9; padding: 0 1rem 1rem">
          <h1
            class="email-title"
            style="
              color: #f26422;
              padding: 1rem 0;
              font-size: 1.3rem;
              text-align: center;
            "
          >
            Recuperar Contraseña
            <div class="underline" style="text-align: center">
              <span
                style="
                  display: inline-block;
                  width: 40%;
                  min-width: 12em;
                  max-width: 30rem;
                  height: 3px;
                  background-color: #fff;
                  vertical-align: middle;
                  background-color: #ffa54c;
                  border-radius: 8px;
                "
              ></span>
            </div>
          </h1>
          <section
            class="main-section"
            style="
              padding: 1rem;
              background-color: #fff;
              margin-bottom: 1rem;
              font-size: 0.9rem;
            "
          >
            <h2 class="main-section__title">Hola</h2>
            <p class="main-section__info" style="margin: 2rem 0">
              Quieres cambiar tu contraseña? no hay problema.
              <strong
                >Te enviaremos a una página para que puedas cambiarla
              </strong>
            </p>
            <div
              class="main-section__btn"
              style="margin: 1.6rem 0; text-align: center"
            >
              <strong style="display: block; margin: 1rem 0"
                >Presione el botón para cambiar la contraseña</strong
              >
              <button
                class="btn"
                type="submit"
                style="
                  cursor: pointer;
                  outline: none;
                  background-color: #007bff;
                  padding: 0.5rem 0.7rem;
                  display: inline-block;
                  text-align: center;
                  font-size: 1rem;
                  font-weight: bold;
                  font-family: inherit;
                  margin: 0.4rem 0;
                  border: none;
                  border-radius: 6px;
                  box-shadow: 0 0 12px rgba(0, 0, 0, 0.26);
                  transition: all 0.4s ease;
                "
              >
                <a href="${link}" style="text-decoration: none; color: #fff"
                  >Cambiar Contraseña</a
                >
              </button>
            </div>
            <div class="main-section__contact">
              <span
                >Si no quieres cambiar tu contraseña ignora este correo. Si tiene
                alguna pregunta puede llamarnos al
                <strong style="color: #007bff"> 58156518 </strong> o puede
                escribirnos a
                <strong class="email" style="color: #007bff"
                  >tumascota@nauta.cu</strong
                >
              </span>
            </div>
          </section>
          <footer style="text-align: center">
            <div>
              <span class="copyright" style="display: block; font-size: 0.9rem"
                >&copy 2021- Todos los derechos reservados</span
              >
            </div>
            <div class="social-media" style="margin: 1rem 0; display: block">
              <span><strong>Enviado desde Las Tunas.</strong></span>
            </div>
          </footer>
        </article>
      </main>
    </body>
    <style>
      * {
        margin: 0;
        padding: 0;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
      }
    </style>
  </html>
      `;
};
module.exports = {
  getConfirmHtml,
  getForgetHtml,
};
