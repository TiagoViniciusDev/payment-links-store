import UserModel from "../models/userModel.js";
import ProductModel from "../models/productModel.js";

import { bucket } from '../../firebaseAdmin.js'

export const verifyTESTES = async (req, res) => {
    try {
        res.status(200).json({success: true, msg: "Acesso com successo a rota privada"})
    } catch (error) {
        res.status(400).json({success: false, msg: "Falha ao acessar rota privada"})
    }
}

export const allProducts = async (req, res) => {
    try {
        const { categoria, search, amount, status } = req.query;
        let query = {};

        // Se a categoria for passada, adiciona à query
        if (categoria) {
            query.category = categoria;
        }

        // Se o texto de busca for passado, adiciona à query com regex para busca parcial
        if (search) {
            query.name = { $regex: search, $options: 'i' }; // 'i' faz a busca ser case-insensitive
        }

        // Se a status for passado, adiciona à query
        if (status) {
            query.status = status;
        }

        let Products

        //Usado para limitar a quatidade de objetos a serem retornados
        if(amount){
            Products = await ProductModel.find(query).limit(amount);
        } else{
            Products = await ProductModel.find(query)
        }
        
        res.status(200).json({ success: true, Products });

    } catch (error) {
        res.status(400).json({success: false, msg: "Erro ao carregar produtos"})
    }
}

export const productByID = async (req, res) => {
    try {
        const productID = req.params.id
        
        if(!productID){
            return res.status(400).json({success: false, msg: "Informe o ID do produto"})
        }

        const Product = await ProductModel.findById(productID)
        res.status(200).json({success: true, Product})

    } catch (error) {
        res.status(400).json({success: false, msg: "Erro ao carregar produtos"})
    }
}

export const newProduct = async (req, res) => {
    try {
        const {userID, name, desc, category, price, imgs} = req.body

        //Verificando se usuário existe
        const user = await UserModel.findById(userID)
        if(!user){return res.status(404).json({success: false, msg: "usuário inválido"})}



        //FAZER VERIFICAÇÂO SE CATEGORIA EXISTE

        const Product = new ProductModel({
            userID, 
            name, 
            desc,
            category, 
            price,
            imgs
        })

        await Product.save()

        res.status(200).json({success: true, msg: 'produto publicado com successo'})

    } catch (error) {
        res.status(400).json({success: false, msg: 'Falha ao publicar produto'})
    }
}

export const myProducts = async (req, res) => {
    try {
        const { userID } = req.body
        const Products = await ProductModel.find({ userID: userID }).sort({ updatedAt: -1 });
        res.status(200).json({success: true, products: Products})

    } catch (error) {
        console.log(error)
        res.status(400).json({success: false, msg: 'Falha ao carregar produtos'})
    }
}

export const deleteProductByID = async (req, res) => {
    try {
        const { productID } = req.body

        if(!productID){
            return res.status(400).json({success: false, msg: "Informe o id do produto"})
        }

        const Product = await ProductModel.findById(productID)

        if(!Product){
            return res.status(404).json({success: false, msg: "Falha ao localizar produto"})
        }

        Product.imgs.map(async (url) => { //Map deletando todas as imgs do produto
            const imageName = url.split('/o/')[1].split('?alt=')[0];
            const decodeURL = decodeURIComponent(imageName)
            await bucket.file(decodeURL).delete();
        })

        await ProductModel.findByIdAndDelete(productID)

        res.status(200).json({success: true, msg: "Produto Deletado com sucesso"})

    } catch (error) {
        res.status(400).json({success: false, msg: "Falha ao deletar produto"})
    }
}

export const changeStatus = async (req, res) => {
    try {
        const { productID, status } = req.body

        if(!productID){
            res.status(400).json({success: false, msg: "Informe o id do produto"})
        }

        if(!status){
            res.status(400).json({success: false, msg: "Informe o novo status do produto"})
        }

        const Product = await ProductModel.findById(productID)

        if(!Product){
            return res.status(404).json({success: false, msg: "Produto não encontrado"})
        }

        await Product.updateOne({
            status
        })

        res.status(200).json({success: true, msg: "Status do produto alterado com sucesso"})

    } catch (error) {
        console.log(error)
        res.status(400).json({success: false, msg: 'Falha ao carregar produtos'})
    }
}