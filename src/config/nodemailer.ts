import nodemailer from 'nodemailer';

export function createTransport(host: string, port: number, user: string, pass: string) {
  return nodemailer.createTransport({
    host,
    port,
    auth: {
      user,
      pass,
    },
  });
}
