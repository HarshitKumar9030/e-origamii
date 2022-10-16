import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    productId: { type: String, required: true, unique: true },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);

//Path: models\Product.js