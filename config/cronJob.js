const cron = require("node-cron");
const Loan = require("../models/loanModel");
const moment = require("moment");
const momentTimeZone = require("moment-timezone");
const { sendWhatsappMessageForOverdueLoans } = require("../utils/SendMesaage");
const Customer = require("../models/customerModel");
console.log("CRON RUNNING at", momentTimeZone().tz("Asia/Kolkata").format());

// I want to check the status of all loans every day at 8 AM IST
const startCronOfOverdueLoans = () => {
  cron.schedule(
    "0 8 * * *",
    async () => {
      try {
        const todayEnd = momentTimeZone().tz("Asia/Kolkata").endOf("day").toDate();

        const overdueLoans = await Loan.find({
          dueDate: { $lt: todayEnd },
          status: { $ne: "paid" },
          remainingAmount: { $gt: 0 },
        });
       
        for (const loan of overdueLoans) {
          loan.status = "overdue";
          await loan.save();

          const { customerId } = loan;
          const customer = await Customer.findById(customerId).populate(
            "userId",
            "name"
          );
          if (!customer) {
            continue;
          }
          const shopKeeperName = customer?.userId?.name;
          const { name, phone } = customer;
          const { loanAmount, remainingAmount, itemDescription } = loan;

          sendWhatsappMessageForOverdueLoans(
            shopKeeperName,
            name,
            phone,
            loanAmount,
            remainingAmount,
            itemDescription
          );
        }
      } catch (err) {
        console.log("CRON JOB ERROR:", err.message);
      }
    },
    {
      timezone: "Asia/Kolkata", // Timezone should be in the options object
    }
  );
};

module.exports = { startCronOfOverdueLoans };
