import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  const msg = {
    to,
    from: {
      email: process.env.EMAIL_USER,
      name: 'Pool Room',
    },
    subject,
    html,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(
      error.response?.body || error.message || error
    );
    throw error;
  }
};

export default sendEmail;
