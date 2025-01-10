import express from 'express'
import { connectionDB } from './DB/connection.js'
import userRoutes from './module/auth/auth.router.js'
const app = express()
const port = 8000
import { config } from 'dotenv'
import path from 'path'
import productRoutes from './module/product/product.routes.js'
import shopifyRouter from './module/shopify/shopify.routes.js'
config({path: path.resolve('./config/.env')})

// import { ApiVersion, shopifyApi } from '@shopify/shopify-api';

app.use(express.json());
connectionDB()

app.get('/', (req, res) => res.send('Hello World!'))


// const shopify = shopifyApi({
//     apiKey: process.env.SHOPIFY_API_KEY,
//     apiSecretKey: process.env.SHOPIFY_API_SECRET,
//     accessToken: process.env.SHOPIFY_API_TOKEN_PASSWORD,
//     shop: `${process.env.SHOPIFY_STORE}.myshopify.com`,
//     hostName: process.env.SHOPIFY_HOST_NAME,
//     apiVersion: ApiVersion.October24, // Adjust for the correct API version
//   });

// app.use(express.urlencoded({ extended: true }));

// // 1. Redirect to Shopify OAuth Authorization URL
// app.get('/shopify/auth', (req, res) => {
//   const redirectUrl = shopify.auth.beginAuth(
//     req,
//     res,
//     `${process.env.SHOPIFY_STORE}.myshopify.com`,
//     true
//   );
//   res.redirect(redirectUrl);
// });

// // 2. Shopify OAuth callback route
// app.get('/shopify/auth/callback', async (req, res) => {
//   const { shop, code, hmac, timestamp } = req.query;
  
//   try {
//     const session = await shopify.auth.validateAuthCallback(req, res, req.query);
//     const accessToken = session.accessToken;

//     // Store the access token and shop name securely in your database for future API calls.
//     console.log(`Authenticated successfully! Access Token: ${accessToken}`);

//     res.send('Shopify Authentication Successful');
//   } catch (err) {
//     console.error('Authentication error', err);
//     res.status(500).send('Authentication failed');
//   }
// });



app.use(express.json())

app.use(userRoutes)
app.use(productRoutes)
app.use(shopifyRouter)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

