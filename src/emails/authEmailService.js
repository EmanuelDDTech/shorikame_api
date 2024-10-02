import { createTransport } from '../config/nodemailer.js';

export async function sendEmailVerification({ name, email, token }) {
  const transporter = createTransport(
    process.env.EMAIL_HOST,
    process.env.EMAIL_PORT,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASS,
  );

  // Enviar el email
  const info = await transporter.sendMail({
    from: 'ShoriKameCards <cuentas@shorikame.com>',
    to: email,
    subject: 'ShoriKameCards - Confirma tu cuenta',
    text: 'ShoriKameCards - Confirma tu cuenta',
    html: `<p>Hola: ${name}, confirma tu cuenta en ShoriKameCards</p>
    <p>Tu cuenta está casi lista, solo debes confirmarla en el siguiente enlace</p>
    <a href="${process.env.FRONTEND_URL}/auth/confirmar-cuenta/${token}">Confirmar cuenta</a>
    <p>Si tú no creaste esta cuenta, puedes ignorar este mensaje</p>
    `,
  });

  console.log('Mensaje enviado', info.messageId);
}
