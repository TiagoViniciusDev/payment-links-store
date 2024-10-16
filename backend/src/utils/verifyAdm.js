import UserModel from "../models/userModel.js"

export const verifyAdm = async (req, res, next) => {
    try {

        const {userID} = req.body

        const User = await UserModel.findById(userID)

        if(User.role !== "admin"){
            return res.status(401).json({sucess: false, msg: "Você não tem permissão"})
        } else{
            next()
        }
    } catch (error) {
        return res.status(401).json({sucess: false, msg: "Erro na verificação do token"})
    }
}