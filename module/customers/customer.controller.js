
import axios from 'axios';
import Customer from '../../DB/model/customer.model.js';

export const getAllCustomer = async (req, res, next) => {
  try {
    const url = `https://${process.env.SHOPIFY_STORE}.myshopify.com/admin/api/2023-10/customers.json`;
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_API_TOKEN_PASSWORD,
      },
    });

    const customers = response.data.customers;

    // Save or update customers in MongoDB
    for (const customer of customers) {
      const customerData = {
        shopifyId: customer.id.toString(),
        email: customer.email,
        createdAt: customer.created_at,
        updatedAt: customer.updated_at,
        firstName: customer.first_name,
        lastName: customer.last_name,
        ordersCount: customer.orders_count,
        state: customer.state,
        totalSpent: customer.total_spent,
        lastOrderId: customer.last_order_id?.toString(),
        note: customer.note,
        verifiedEmail: customer.verified_email,
        multipassIdentifier: customer.multipass_identifier,
        taxExempt: customer.tax_exempt,
        tags: customer.tags,
        lastOrderName: customer.last_order_name,
        currency: customer.currency,
        phone: customer.phone,
        addresses: customer.addresses.map((address) => ({
          id: address.id.toString(),
          customer_id: address.customer_id?.toString(),
          first_name: address.first_name,
          last_name: address.last_name,
          company: address.company,
          address1: address.address1,
          address2: address.address2,
          city: address.city,
          province: address.province,
          country: address.country,
          zip: address.zip,
          phone: address.phone,
          name: address.name,
          province_code: address.province_code,
          country_code: address.country_code,
          country_name: address.country_name,
          default: address.default,
        })),
        taxExemptions: customer.tax_exemptions,
        emailMarketingConsent: customer.email_marketing_consent
          ? {
              state: customer.email_marketing_consent.state,
              optInLevel: customer.email_marketing_consent.opt_in_level,
              consentUpdatedAt: customer.email_marketing_consent.consent_updated_at,
            }
          : null,
        smsMarketingConsent: customer.sms_marketing_consent,
        adminGraphqlApiId: customer.admin_graphql_api_id,
        defaultAddress: customer.default_address
          ? {
              id: customer.default_address.id.toString(),
              customer_id: customer.default_address.customer_id?.toString(),
              first_name: customer.default_address.first_name,
              last_name: customer.default_address.last_name,
              company: customer.default_address.company,
              address1: customer.default_address.address1,
              address2: customer.default_address.address2,
              city: customer.default_address.city,
              province: customer.default_address.province,
              country: customer.default_address.country,
              zip: customer.default_address.zip,
              phone: customer.default_address.phone,
              name: customer.default_address.name,
              province_code: customer.default_address.province_code,
              country_code: customer.default_address.country_code,
              country_name: customer.default_address.country_name,
              default: customer.default_address.default,
            }
          : null,
      };

      // Use upsert (update or insert)
      await Customer.findOneAndUpdate(
        { shopifyId: customerData.shopifyId },
        customerData,
        { upsert: true, new: true }
      );
    }

    res.status(200).json({ message: 'Customers fetched and stored successfully.',customers });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

export const createCustomer = async (req, res, next) => {
  try {
    // Step 1: Receive customer data from request body
    const { firstName, lastName, email, phone, address } = req.body;

    // Step 2: Build the request data for Shopify
    const customerData = {
      customer: {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone,
        addresses: [
          {
            address1: address.address1,
            address2: address.address2 || '',
            city: address.city,
            province: address.province,
            country: address.country,
            zip: address.zip,
            phone: address.phone,
          },
        ],
      },
    };

    if (!customerData.addresses || !customerData.addresses.length) {
      throw new Error("Addresses are missing or empty.");
    }
    

    // Step 3: Make the POST request to Shopify API to create the customer
    const url = `https://${process.env.SHOPIFY_STORE}.myshopify.com/admin/api/2023-10/customers.json`;
    const response = await axios.post(url, customerData, {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_API_TOKEN_PASSWORD,
      },
    });

    // Step 4: Process the response
    const createdCustomer = response.data.customer;

    
    // Optional: Save the customer to your database (MongoDB)
    const customerDataToSave = {
      shopifyId: createdCustomer.id.toString(),
      email: createdCustomer.email,
      firstName: createdCustomer.first_name,
      lastName: createdCustomer.last_name,
      phone: createdCustomer.phone,
      addresses: createdCustomer.addresses.map((address) => ({
        id: address.id.toString(),
        customer_id: address.customer_id.toString(),
        first_name: address.first_name,
        last_name: address.last_name,
        address1: address.address1,
        address2: address.address2,
        city: address.city,
        province: address.province,
        country: address.country,
        zip: address.zip,
        phone: address.phone,
        name: address.name,
      })),
    };

    // Save the customer to MongoDB (or update if exists)
    await Customer.create(customerDataToSave);

    // Step 5: Send a response with the created customer data
    res.status(201).json({
      message: 'Customer created successfully',
      customer: createdCustomer,
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
};

export const createActivationURL = async (req, res, next) => {

  const id = req.params.id

  try {
    // Step 1: Receive customer data from request body
    const { firstName, lastName, email, phone, address } = req.body;

    // Step 2: Build the request data for Shopify
    const customerData = {
      customer: {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone,
        addresses: [
          {
            address1: address.address1,
            address2: address.address2 || '',
            city: address.city,
            province: address.province,
            country: address.country,
            zip: address.zip,
            phone: address.phone,
          },
        ],
      },
    };
    // Step 3: Make the POST request to Shopify API to create the customer
    const url = `https://${process.env.SHOPIFY_STORE}.myshopify.com/admin/api/2023-10/customers/${id}/account_activation_url.json`;
    const response = await axios.post(url, customerData, {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_API_TOKEN_PASSWORD,
      },
    });

    // Step 4: Process the response
    const createdCustomer = response.data.customer;

    // Optional: Save the customer to your database (MongoDB)
    const customerDataToSave = {
      shopifyId: createdCustomer.id.toString(),
      email: createdCustomer.email,
      firstName: createdCustomer.first_name,
      lastName: createdCustomer.last_name,
      phone: createdCustomer.phone,
      addresses: createdCustomer.addresses.map((address) => ({
        id: address.id.toString(),
        customer_id: address.customer_id.toString(),
        first_name: address.first_name,
        last_name: address.last_name,
        address1: address.address1,
        address2: address.address2,
        city: address.city,
        province: address.province,
        country: address.country,
        zip: address.zip,
        phone: address.phone,
        name: address.name,
      })),
    };

    // Save the customer to MongoDB (or update if exists)
    await Customer.create(customerDataToSave);

    // Step 5: Send a response with the created customer data
    res.status(201).json({
      message: 'Customer created successfully',
      customer: createdCustomer,
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
};

export const getSingleCustomer = async (req, res, next) => {
  try {

    const id = req.params.id
    const url = `https://${process.env.SHOPIFY_STORE}.myshopify.com/admin/api/2023-10/customers/${id}.json`;
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_API_TOKEN_PASSWORD,
      },
    });

    const customer = response.data.customer;

 

    res.status(200).json({ message: 'Customer Founded',customer });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

export const getCustomerwithOrders = async (req, res, next) => {
  try {

    const id = req.params.id
    const url = `https://${process.env.SHOPIFY_STORE}.myshopify.com/admin/api/2023-10/customers/${id}/orders.json`;
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_API_TOKEN_PASSWORD,
      },
    });

    const customer = response.data;

 

    res.status(200).json({ message: 'Customer Founded',customer });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

export const getCustomerCount= async (req, res, next) => {
  try {

    const url = `https://${process.env.SHOPIFY_STORE}.myshopify.com/admin/api/2023-10/customers/count.json`;
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_API_TOKEN_PASSWORD,
      },
    });

    const count = response.data.count;

 

    res.status(200).json({ message: `Customer Number is : ${count}` });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

export const searchByQuery = async (req, res, next) => {
  try {

    const query = req.params.query
    
    
    const url = `https://${process.env.SHOPIFY_STORE}.myshopify.com/admin/api/2023-10/customers/search.json?${query}`;
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_API_TOKEN_PASSWORD,
      },
    });

    const customer = response.data;



 

    res.status(200).json({ message: 'Customer Founded',customer });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

export const findByIdAndUpdate = async (req, res, next) => {
  try {
    const newData = req.body; // Data to update
    const id = req.params.id; // Customer ID from the URL
    console.log("Data to update:", newData);

    const url = `https://${process.env.SHOPIFY_STORE}.myshopify.com/admin/api/2023-10/customers/${id}.json`;

    // Make the PUT request
    const response = await axios.put(
      url,
      {
        customer: newData, // Payload under "customer" key
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": process.env.SHOPIFY_API_TOKEN_PASSWORD,
        },
      }
    );

    const customer = response.data.customer;

    res.status(200).json({ message: "Customer updated successfully", customer });
  } catch (error) {
    console.error("Error updating customer:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to update customer", details: error.response?.data });
  }
};

export const deleteCustomer = async (req, res, next) => {

  const id = req.params.id




  try {
    const url = `https://${process.env.SHOPIFY_STORE}.myshopify.com/admin/api/2025-01/customers/${id}.json`;
    const response = await axios.delete(url, {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_API_TOKEN_PASSWORD,
      },
    });
    

    const customerExsited = await Customer.findOne({
      shopifyId:id
    })
  
    if(!customerExsited){
      res.status(404).json({message:"customer not found"})
    }
  
    await Customer.deleteOne({ shopifyId: id });



    res.status(200).json({ message: 'customer deleted' });
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
};