const client = require("../config/twilio");

const sendWhatsappMessageForOverdueLoans = async (
  shopKeeperName,
  customerName,
  phoneNumber,
  loanAmount,
  amountDue
) => {
  try {
    const formattedDueAmount = new Intl.NumberFormat("en-IN").format(amountDue);
    const formattedLoanAmount = new Intl.NumberFormat("en-IN").format(
      loanAmount
    );
    const message = await client.messages.create({
      body: `
Dear ${customerName},

We wanted to remind you that your loan payment of ₹${formattedDueAmount} is overdue. The original loan amount was ₹${formattedLoanAmount}, and the payment is now overdue.

This loan was issued by ${shopKeeperName}. Please make the payment as soon as possible to avoid further inconvenience.

Thank you!
`,
      from: "whatsapp:+14155238886", // Twilio Sandbox WhatsApp number
      to: `whatsapp:+91${phoneNumber}`, // Customer number in WhatsApp format
    });
    console.log("WhatsApp message sent:", message.sid);
  } catch (err) {
    console.error("Whatsapp Message Error:", err.message);
  }
};

module.exports = { sendWhatsappMessageForOverdueLoans };
