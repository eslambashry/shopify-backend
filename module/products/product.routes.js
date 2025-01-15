import { Router } from "express";
import { createProduct, deleteProduct, fetchProducts, fetchProductsNumber, getSingleProducts } from "./product.controller.js";


const productRoutes = Router()

 productRoutes.get('/fetch-products', fetchProducts);
 productRoutes.get('/fetch-products-count', fetchProductsNumber);
 productRoutes.get('/single-product/:id', getSingleProducts);
 productRoutes.post('/create-products', createProduct);
 productRoutes.delete('/delete-product/:id', deleteProduct);
 
 
 
 export default productRoutes;
