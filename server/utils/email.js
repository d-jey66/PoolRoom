import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
      user: 'apikey',
      pass: process.env.SENDGRID_API_KEY
    }
  });

  await transporter.sendMail({
    from: `"Pool Room" <poolroomofficialg@gmail.com>`,
    to,
    subject,
    html
  });
};

export default sendEmail;