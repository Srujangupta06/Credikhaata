# Credikhaata
 Objective:
 - To allow shopkeepers to manage customers, record credit sales (loans), track repayments, and receive overdue payment alerts

 # API - End Points

# User Routes
 - /user/sign-up                - Registration of ShopKeeper
 - /user/login                  - For ShopKeeper Login purpose 

# Customer
- /customer/list                - to get list of customers belong to shopKeeper(logged In User)
- /customer/list/:customerId    - to get info about single customer
- /customer/edit/:customerId    - to update the respective fields of pre-saved customer
- /customer/remove/:customerId  - to remove customer records

# Loan