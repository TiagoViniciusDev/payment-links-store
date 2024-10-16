import express from 'express'
import { newProduct, allProducts, verifyTESTES, myProducts, deleteProductByID, productByID, changeStatus } from '../controllers/ProductController.js'
import { verifyToken } from '../utils/verifyUser.js'
import { verifyAdm } from '../utils/verifyAdm.js'

const ProductRoutes = express.Router()

ProductRoutes.get("/allProducts", allProducts)
ProductRoutes.get("/productByID/:id", productByID)

//Precisa está logado
ProductRoutes.get("/verifyTestes", verifyToken, verifyTESTES)
ProductRoutes.post("/newProduct", verifyToken, newProduct)
ProductRoutes.post("/myProducts", verifyToken, myProducts)

//Precisa ser adm
ProductRoutes.post("/changeStatus", verifyToken, verifyAdm, changeStatus)
ProductRoutes.delete("/deleteProduct", verifyToken, verifyAdm, deleteProductByID)

export default ProductRoutes