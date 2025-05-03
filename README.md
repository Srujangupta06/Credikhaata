# Credikhaata
 Objective:
 - To allow shopkeepers to manage customers, record credit sales (loans), track repayments, and receive overdue payment alerts

# API - End Points

# User Routes

### POST /user/sign-up

**Description**:  
Registration of ShopKeeper (if not exist already)

                      
  Request(body):
    {
    "name":"Sanjeev",
    "email":"abc@gmail.com",
    "password":"abc123#",
    "phone":"xxxxxxxxxx"
    }

  Response:
  case-1: If user is registering for first time
  
   {
    "message": "User Created Successfully"
   }

  case-2: If user tried to registered for twice
  
   {
    "message":"User already exists"
   }






  POST       - /user/login                   - For ShopKeeper Login purpose 

# Customer
 POST        - /customer/create              - to create a new customer (if not exising already)
 GET         - /customer/list                - to get list of customers belong to shopKeeper(logged In User)
 GET         - /customer/list/:customerId    - to get info about single customer
 PATCH       - /customer/edit/:customerId    - to update the respective fields of (already-saved) customer
 DELETE      - /customer/remove/:customerId  - to remove customer records

# Loan
 POST        - /loan/create                  - to create a loan for existing customer
 GET         - loan/list?status              - Gives existing loans of based on status [pending,paid,overdue]

# Repayment
 POST
