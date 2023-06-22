// pages/api/sendEmail.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  try {
    // Get the email details from the request body
    const { to, subject, transactionAmount, transactionReceiptLink } = req.body;

    // Create a Nodemailer transporter using SMTP
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Set to true if using a secure connection (TLS/SSL)
      auth: {
        user: '0xbhadresh.eth@gmail.com',
        pass: 'efkeagcvxmdhymyc',
      },
    });

    // Compose the email message with dynamic values
    const htmlContent = `
      <p>Your last transaction was successful.</p>
      <p>Amount: ${transactionAmount} of Matic on Polygon</p>
      <p>This is your transaction receipt: <a href="${transactionReceiptLink}">${transactionReceiptLink}</a></p>
    `;

    const mailOptions = {
      from: '0xbhadresh.eth@gmail.com',
      to,
      subject,
      html: htmlContent,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent:', info.messageId);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
}
