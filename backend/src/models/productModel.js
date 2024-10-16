import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    desc: { type: String, required: true },
    userID: { type: String, required: true },
    category: {type: String, required: true },
    price: {type: Number, required: true },
    imgs: { type: Array },
    feedback: {type: Array},
    status: {type: String, enum: ["Approved", "Reproved", "Pending"], default: "Pending", required: true }
}, { timestamps: true });

const ProductModel = mongoose.model("Product", productSchema)

export default ProductModel

