import { Resend } from 'resend';

const sendEmail = async ({ to, subject, html }) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: 'Pool Room <onboarding@resend.dev>',
    reply_to: 'poolroomofficialg@gmail.com',
    to,
    subject,
    html,
  });
};

export default sendEmail;