const client = require("../config/twilio");

const sendWhatsappMessageForOverdueLoans = async (
  shopKeeperName,
  customerName,
  phoneNumber,
  loanAmount,
  amountDue,
  itemDescription
) => {
  try {
    const formattedDueAmount = new Intl.NumberFormat("en-IN").format(amountDue);
    const formattedLoanAmount = new Intl.NumberFormat("en-IN").format(
      loanAmount
    );
    const message = await client.messages.create({
      body: `
Hi ${customerName}! 👋

⏰ Payment Reminder  
Your loan payment of ₹${formattedLoanAmount} is overdue.

🔹 Item: ${itemDescription} 
💰 Loan Amount: ₹${formattedLoanAmount}/-  
📉 Remaining Balance: ₹${formattedDueAmount}/-  
🧾 Issued by: ${shopKeeperName}

⚠️ Please make the payment as soon as possible to avoid further inconvenience.

Thank you! 🙏
`,
      from: "whatsapp:+14155238886", // Twilio Sandbox WhatsApp number
      to: `whatsapp:+91${phoneNumber.replace(/\D/g, "")}`, // Customer number in WhatsApp format
    });
    console.log("WhatsApp message sent to customer:", customerName);
  } catch (err) {
    console.error("Whatsapp Message Error:", err.message);
  }
};

module.exports = { sendWhatsappMessageForOverdueLoans };
