import { Router } from "express";
import { createActivationURL, createCustomer, deleteCustomer, findByIdAndUpdate, getAllCustomer, getCustomerCount, getCustomerwithOrders, getSingleCustomer, searchByQuery } from "./customer.controller.js";


const customerRoutes = Router()


customerRoutes.get("/fetch-customers",getAllCustomer)
customerRoutes.post("/create-customers",createCustomer)
customerRoutes.post("/create-activation-url/:id",createActivationURL)
customerRoutes.get("/get-single-customer/:id",getSingleCustomer)
customerRoutes.get("/get-customer-orders/:id",getCustomerwithOrders)
customerRoutes.get("/fetch-customers-count",getCustomerCount)
customerRoutes.get("/fetch-customers-by-attribute",searchByQuery)
customerRoutes.put("/find-and-update/:id",findByIdAndUpdate)
customerRoutes.delete("/delete-customer/:id",deleteCustomer)


  

export default customerRoutes;