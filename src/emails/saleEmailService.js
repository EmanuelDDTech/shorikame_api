import { createTransport } from '../config/nodemailer.js';
import { Resend } from 'resend';

const resend = new Resend('re_hnByogcc_7oCRps9F1RScuETkurE6TiDn');

export async function sendEmailSaleConfirmation(orderData) {
  // const transporter = createTransport(
  //   process.env.EMAIL_HOST,
  //   process.env.EMAIL_PORT,
  //   process.env.EMAIL_USER,
  //   process.env.EMAIL_PASS,
  // );

  // // Enviar el email
  // const info = await transporter.sendMail({
  //   from: 'ShoriKameCards <ventas@shorikame.com>',
  //   to: orderData.user.email,
  //   subject: 'ShoriKameCards - Confirmación de pedido',
  //   text: 'ShoriKameCards - Pedido realizado',
  //   html: renderHTML(orderData),
  // });

  const { data, error } = await resend.emails.send({
    from: 'ShoriKameCards <pedidos@shorikamecards.com>',
    to: [orderData.user.email],
    subject: 'ShoriKameCards - Pedido realizado',
    html: renderHTML(orderData),
  });

  if (error) {
    console.error('Error: ', error);
    return;
  }

  console.log(data);

  // console.log('Mensaje enviado', info.messageId);
}

function renderHTML({ user, order, items }) {
  let htmlProductRows = ``;

  items.forEach((item) => {
    htmlProductRows += `<tr>
                              <td>${item.name}</td>
                              <td>${item.quantity}</td>
                              <td>${item.price}</td>
                              <td>${item.price * item.quantity}</td>
                          </tr>`;
  });

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
                      <h2>Gracias por tu pedido #${order.id}</h2>
                      <p>Hola ${user.name},</p>
                      <p>Gracias por tu compra en <strong>ShoriKameCards</strong>. Tu pedido está en espera hasta que confirmemos el pago.</p>
                      <h3>Detalles del Pedido:</h3>
                      <table class="order-details">
                          <tr>
                              <th>Producto</th>
                              <th>Cantidad</th>
                              <th>Precio</th>
                              <th>Subtotal</th>
                          </tr>
                          ${htmlProductRows}
                      </table>
                      <p><strong>Total: ${order.amount_total}</strong></p>
                      <p>Si tienes dudas, contáctanos en <a href="mailto:shorikamecards@gmail.com">shorikamecards@gmail.com</a>.</p>
                      <p>Gracias por confiar en <strong>ShoriKameCards</strong> 🚀</p>
                  </div>
                  <div class="footer">
                      <p>&copy; 2025 ShoriKamenCards. Todos los derechos reservados.</p>
                  </div>
              </div>
          </body>`;

  return htmlEmail;
}
