const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_ID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = new twilio(accountSid, authToken);


// Export twilio client
module.exports = client