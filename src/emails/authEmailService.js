import { createTransport } from '../config/nodemailer.js';
import { Resend } from 'resend';

const resend = new Resend('re_hnByogcc_7oCRps9F1RScuETkurE6TiDn');

export async function sendEmailVerification({ name, email, token }) {
  // const transporter = createTransport(
  //   process.env.EMAIL_HOST,
  //   process.env.EMAIL_PORT,
  //   process.env.EMAIL_USER,
  //   process.env.EMAIL_PASS,
  // );

  // Enviar el email
  // const info = await transporter.sendMail({
  //   from: 'ShoriKameCards <cuentas@shorikame.com>',
  //   to: email,
  //   subject: 'ShoriKameCards - Confirma tu cuenta',
  //   text: 'ShoriKameCards - Confirma tu cuenta',
  //   html: `<p>Hola: ${name}, confirma tu cuenta en ShoriKameCards</p>
  //   <p>Tu cuenta está casi lista, solo debes confirmarla en el siguiente enlace</p>
  //   <a href="${process.env.FRONTEND_URL}/auth/confirmar-cuenta/${token}">Confirmar cuenta</a>
  //   <p>Si tú no creaste esta cuenta, puedes ignorar este mensaje</p>
  //   `,
  // });

  const { data, error } = await resend.emails.send({
    from: 'ShoriKameCards <cuentas@shorikamecards.com>',
    to: [email],
    subject: 'ShoriKameCards - Confirma tu cuenta',
    html: renderHTML(name, token),
  });

  if (error) {
    console.error('Error: ', error);
    return;
  }

  console.log(data);

  // console.log('Mensaje enviado', info.messageId);
}

function renderHTML(name, token) {
  const htmlEmail = `<head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Confirmación de Pedido</title>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f4f4f4;
                      margin: 0;
                      padding: 0;
                  }
                  .container {
                      width: 100%;
                      max-width: 600px;
                      margin: 20px auto;
                      background: #ffffff;
                      padding: 20px;
                      border-radius: 10px;
                      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  }
                  .header {
                      text-align: center;
                      margin-bottom: 20px;
                  }
                  .header img {
                      max-width: 200px;
                  }
                  .content p {
                      font-size: 16px;
                      color: #333;
                  }
                  .order-details {
                      width: 100%;
                      border-collapse: collapse;
                      margin-top: 20px;
                  }
                  .order-details th, .order-details td {
                      border: 1px solid #ddd;
                      padding: 10px;
                      text-align: left;
                  }
                  .order-details th {
                      background-color: #f8f8f8;
                  }
                  .footer {
                      text-align: center;
                      margin-top: 20px;
                      font-size: 14px;
                      color: #777;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <img src="https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/assets%2Fkame_01.png?alt=media&token=9c1e6563-2477-4960-8ac0-efffbd5e0634" alt="Shorikame Logo">
                  </div>
                  <div class="content">
                      <h2>Hola ${name}</h2>
                      <p>Confirma tu cuenta en <strong>ShoriKameCards</strong>. Tu pedido está en espera hasta que confirmemos el pago.</p>
                      <p>Tú cuenta está casi lista, solo deber confirmarla en el siguiente enlace: <a href="${process.env.FRONTEND_URL}/auth/confirmar-cuenta/${token}">Confirmar cuenta.</a></p>

                      <p>Si tú no creaste esta cuenta, puedes ignorar este mensaje.</p>
                  </div>
                  <div class="footer">
                      <p>&copy; 2025 ShoriKamenCards. Todos los derechos reservados.</p>
                  </div>
              </div>
          </body>`;

  return htmlEmail;
}
