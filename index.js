import express from 'express'
import { connectionDB } from './DB/connection.js'
const app = express()
const port = process.env.PORT
import { config } from 'dotenv'
import path from 'path'
import color from "@colors/colors"

config({path: path.resolve('./config/.env')})
import cors from "cors"

app.get('/', (req, res) => res.send('Hello World!'.bgBlack))

// import authRoutes from './module/auth/authRoutes.js'
// import { shopify } from './config/shopify.js'
// import { sessionHanx dler } from './middleware/sessionHandler.js'

import customerRoutes from './module/customers/customer.routes.js'
import productRoutes from './module/products/product.routes.js'
import shopifyRouter from './module/shopify/shopify.routes.js'
import orderRouters from './module/orders/order.routes.js'

app.use(express.json());

app.use(cors())

connectionDB()


// app.use(sessionHandler);
// app.use(authRoutes);



app.use(shopifyRouter)

app.use(orderRouters)

app.use(customerRoutes)

app.use(productRoutes)




app.listen(port, () => console.log(`Example app listening on port ${port}!`.random.bold))

