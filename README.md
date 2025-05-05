# Credikhaata

 Objective:

 - To allow shopkeepers to manage customers, record credit sales (loans), track repayments, and receive overdue payment alerts

# How to Run Project

 - To run project in 

    - local Environment use script

      npm run server (enables nodemon to run project and run automatically upon file change and save)

    - Production Environment

      npm start or npm run start

  # Deployed Url:

  - This Web service is deployed on Render Platform

  - I have an how to deploy in AWS manually using EC2 instance due to some concerns I deployed in Render

    BASE_URL: https://credikhaata-yls1.onrender.com (PRODUCTION)

  # GITHUB URL:

  -  https://github.com/Srujangupta06/Credikhaata


# API - End Points

# Routers
- /user             - for user routes
- /customer         - for customer routes
- /loan             - for loan routes
- /repayment        - for Loan Repayments Routes

# User 
  POST       - /user/sign-up                 - For ShopKeeper Registration
  require(name,email,password)

  POST       - /user/login                   - For ShopKeeper Login purpose 

  require(email,password)

  POST       - /user/logout                  - For shopkeeper to logout(Clears cookie from client browser)
  
# Customer
 POST        - /customer/create              - to create a new customer (if not exising already)
 require(name,phone,address,trustScore,creditLimit)

 GET         - /customer/list                - to get list of customers belong to shopKeeper(logged In User)
 GET         - /customer/list/:customerId    - to get info about single customer

 PATCH       - /customer/edit/:customerId    - to update the respective fields of (already-saved) customer

 [name,phone - ARE NOT ALLOWED TO UPDATE]

 (only creditLimit,trustScore,address can be modified)

 DELETE      - /customer/remove/:customerId  - to remove customer records

# Loan
 POST        - /loan/create                  - to create a loan for existing customer
 (customerId,loanAmount,description,frequency) must need in req.body
 issueDate taken date from created
 based on frequency - weekly add 7 days from loan issued Date,
 monthly - add monthly dates from loan issued Date


 GET         - loan/list?status              - Gives existing loans of based on status (pending,paid,overdue)

 req.queryparms - status (default status = pending)

 GET         - loan/list/:customerId         - Gives info about only specific customer who has loan 
 (Expects customerId in Request params)

 GET         - loan/summary                  - Gives all summary about how much loan is issued,toalcollected,averageRepayments


# Repayment
POST         - /repayment/:loanId            - Create a Repayment for existing loan and adjusts the Loan Amount,Remaining Amount,Credit Limit of Customer
(expects loan Id in request params)

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



