import { Router } from 'express';
import {  cancelOrders, closeOrders, createDraftOrders, createOrders, deleteOrder, fetchOrders, findOrderByIdAndUpdate, ordersCount, reOpenOrders, singleOrders } from './order.controller.js';


const orderRouters = Router()

orderRouters.get("/fetch-order",fetchOrders)
orderRouters.post("/create-draft-order",createDraftOrders)
orderRouters.post("/create-order",createOrders)
orderRouters.post("/cancel-order/:id",cancelOrders)
orderRouters.post("/close-order/:id",closeOrders)
orderRouters.post("/reopen-order/:id",reOpenOrders)
orderRouters.get("/single-order/:id",singleOrders)
orderRouters.get("/order-count",ordersCount)
orderRouters.put("/update-order/:id",findOrderByIdAndUpdate)
orderRouters.delete("/delete-order/:id",deleteOrder)



 export default orderRouters