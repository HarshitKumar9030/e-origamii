import Order from "../../models/Order";
import ConnectDb from '../../middleware/mongoose';

const handler = async (req, res) => {
    if (req.method === "GET") {
        const orders = await Order.find();
        res.status(200).json(orders);
    }else{
        return res.status(405).json({ error: "Method not allowed" });
    }
}

export default ConnectDb(handler);
