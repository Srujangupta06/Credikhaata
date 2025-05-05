# Credikhaata

 Objective:

 - To allow shopkeepers to manage customers, record credit sales (loans), track repayments, and receive overdue payment alerts

# API - End Points

# User 
  POST       - /user/sign-up                 - For ShopKeeper Registration
  POST       - /user/login                   - For ShopKeeper Login purpose 
  POST       - /user/logout                  - For shopkeeper to logout

# Customer
 POST        - /customer/create              - to create a new customer (if not exising already)
 GET         - /customer/list                - to get list of customers belong to shopKeeper(logged In User)
 GET         - /customer/list/:customerId    - to get info about single customer
 PATCH       - /customer/edit/:customerId    - to update the respective fields of (already-saved) customer
 DELETE      - /customer/remove/:customerId  - to remove customer records

# Loan
 POST        - /loan/create                  - to create a loan for existing customer
 GET         - loan/list?status              - Gives existing loans of based on status (pending,paid,overdue)
 GET         - loan/list/:customerId         - Gives info about only specific customer who has loan 
 GET         - loan/summary                  - Gives all summary about how much loan is issued,toalcollected,averageRepayments


# Repayment
POST         - /repayment/:loanId            - Create a Repayment for existing loan and adjusts the Loan Amount,Remaining Amount,Credit Limit of Customer
GET          - /repayment/list               - It gives all history of repayments happen with loggedIn ShopKeeper


# Main Dependencies

moment            - helps in dealing with dates easily
twilio            - Message Service for Overdue Alerts
node-cron         - For automating tasks (to check everyday for overdue payments)
cookie-parser     - to set token in cookie and send back to client 
dotenv            - to store secure keys

# Feature for Overdue Payment Tracking

- Used Twilio Whatsapp message service with combination of node cron job
- To check every day from morning 8 AM IST for customer overdue payments and sends respective message to customers for reminding about the Loan they took from ShopKeeper





# Deployment
- Create a account in AWS
- Created an AWS EC2 Instance
- Configured Instance
- Connected to Instance through ssh via .pem file
- Installed Node into remote instance
- cloned git repository
