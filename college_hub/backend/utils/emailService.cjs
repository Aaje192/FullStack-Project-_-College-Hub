const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'adithyaaka0304@gmail.com',
    pass: 'jttm cwee zfqy laly'
  }
});

// Verify the connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('Email service configuration error:', error);
    console.error('Please check your Gmail app password and ensure it is still valid');
  } else {
    console.log('Email server is ready to send messages');
  }
});

const sendEmail = async (to, subject, text) => {
  try {
    // Validate input parameters
    if (!to || !subject || !text) {
      throw new Error('Missing required email parameters');
    }

    const mailOptions = {
      from: {
        name: 'College Hub Task Manager',
        address: 'adithyaaka0304@gmail.com'
      },
      to,
      subject,
      text
    };

    // Add detailed logging
    console.log(`Attempting to send email to ${to}`);
    console.log(`Subject: ${subject}`);

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', {
      messageId: info.messageId,
      to: to,
      subject: subject
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', {
      error: error.message,
      stack: error.stack,
      to: to,
      subject: subject
    });
    throw error; // Propagate the error to handle it in the task controller
  }
};

module.exports = { sendEmail }; 