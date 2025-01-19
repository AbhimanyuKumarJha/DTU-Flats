const nodemailer = require('nodemailer'); // Import Nodemailer
const { getUserById } = require('./userService'); // Import your user service
// import { generateAndDownloadPDF } from "../../frontend-app/src/app/lib/utils/pdfGenerator";

// Create a transporter instance
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // e.g., 'smtp.example.com'
  port: process.env.EMAIL_PORT, // e.g., 587
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Your email user
    pass: process.env.EMAIL_PASS, // Your email password
  },
});

const sendTransactionEmail = async (transaction, isUpdate = false) => {
  try {
    // Get user details
    const user = await getUserById(transaction.userId);
    
    // Format months paid for email
    const monthsStr = transaction.monthsPaid
      .map(m => `${getMonthName(m.month)} ${m.year}`)
      .join(', ');

    const emailSubject = isUpdate 
      ? 'DTU - Transaction Update Notice'
      : 'DTU - Payment Confirmation';

    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>DTU Transaction Notice</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; line-height: 1.6; color: #333333;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5;">
          <tr>
            <td align="center" style="padding: 20px;">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <!-- Header with DTU Logo -->
                <tr>
                  <td style="background-color: #003366; padding: 4px; text-align: center;">
                    <div style="background-image: url('https://test.piceeducare.com/images/1/1632465297phpyUzixv.jpeg'); background-size: cover;  height: 200px;"></div>
                  </td>
                </tr>

                <!-- Main Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #003366; margin: 0 0 20px 0; font-size: 24px; text-align: center; border-bottom: 2px solid #003366; padding-bottom: 10px;">
                      Transaction ${isUpdate ? 'Update' : 'Confirmation'}
                    </h2>
                    
                    <p style="margin: 0 0 20px 0;">Dear ${user.name},</p>
                    
                    <p style="margin: 0 0 20px 0;">This is to confirm that your payment has been ${isUpdate ? 'updated' : 'successfully recorded'} in our system. Please find the transaction details below:</p>

                    <table width="100%" style="background-color: #f8f9fa; border-radius: 4px; margin: 20px 0; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">
                          <strong>Amount:</strong>
                        </td>
                        <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">
                          ₹${transaction.calculatedAmount}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">
                          <strong>Payment Mode:</strong>
                        </td>
                        <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">
                          ${transaction.paymentMode}
                          ${transaction.paymentMode === 'UPI' ? `<br><strong>UPI ID:</strong> ${transaction.paymentDetails.upiTransactionId}` : ''}
                          ${['Cheque', 'DD'].includes(transaction.paymentMode) ? `<br><strong>${transaction.paymentMode} Number:</strong> ${transaction.paymentDetails.chequeOrDDNumber}` : ''}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">
                          <strong>Status:</strong>
                        </td>
                        <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">
                          <span style="color: ${transaction.status === 'Completed' ? '#28a745' : '#dc3545'};">
                            ${transaction.status}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">
                          <strong>Months Covered:</strong>
                        </td>
                        <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">
                          ${monthsStr}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">
                          <strong>Transaction Date:</strong>
                        </td>
                        <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">
                          ${new Date(transaction.transactionDate).toLocaleDateString()}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">
                          <strong>Transaction Time:</strong>
                        </td>
                        <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">
                          ${new Date(transaction.transactionDate).toLocaleTimeString()}
                        </td>
                      </tr>
                      
                    </table>

                    <p style="margin: 20px 0; padding: 15px; background-color: #e8f4fd; border-radius: 4px; border-left: 4px solid #003366;">
                      <strong>Note:</strong> Please keep this email as proof of your payment. For any queries, please contact the accounts department or reach out to our support team.
                    </p>

                    <p style="margin: 20px 0 0 0;">Best regards,</p>
                    <p style="margin: 0;">Accounts Department</p>
                    <p style="margin: 0;"><strong>Delhi Technological University</strong></p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #003366; color: #ffffff; padding: 20px; text-align: center; font-size: 12px;">
                    <p style="margin: 0;">Delhi Technological University</p>
                    <p style="margin: 5px 0;">Shahbad Daulatpur, Main Bawana Road, Delhi-110042</p>
                    <p style="margin: 5px 0;">Tel: +91-11-27871018</p>
                    <p style="margin: 5px 0;"><a href="https://dtu.ac.in" style="color: #ffffff; text-decoration: none;">www.dtu.ac.in</a></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"DTU Accounts" <${process.env.EMAIL_USER}>`,
      to: `${user.email}, ${user.alternateEmail ? user.alternateEmail : ''}`.trim(),
      subject: emailSubject,
      html: emailContent
    });

  } catch (error) {
    console.error('Error sending transaction email:', error);
    // Don't throw the error to prevent disrupting the save operation
  }
};

// Helper function to get month name
const getMonthName = (monthNumber) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthNumber - 1];
};

// Helper function to get payment details HTML
const getPaymentDetailsHtml = (transaction) => {
  if (transaction.paymentMode === 'UPI') {
    return `<li>UPI Transaction ID: ${transaction.paymentDetails.upiTransactionId}</li>`;
  } else if (['Cheque', 'DD'].includes(transaction.paymentMode)) {
    return `<li>${transaction.paymentMode} Number: ${transaction.paymentDetails.chequeOrDDNumber}</li>`;
  }
  return '';
};

module.exports = { sendTransactionEmail };