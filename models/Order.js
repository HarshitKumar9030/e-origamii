import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    email: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    price: { type: String, required: true },
    date: { type: String, default: Date.now },
    productId: { type: String, required: true },
    status: { type: String, default: "pending" },
    uniqueId: { type: String, required: true, unique: true }
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);

//Path: models\Order.js
